const path = require("path");
require("dotenv").config();

if (!process.env.JWT_SECRET) {
    console.log("JWT secret is missing!");
    process.exit(1);
}
 
const express = require('express');
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');
const cors = require('cors');
const history = require('connect-history-api-fallback');
const http = require("http");
const https = require("https");
const fs = require('fs');
const { Server } = require('socket.io');
const socketIoHandler = require("./util/socketIoHandler");
const { startAgenda } = require('./util/agenda');

const historyFallbackOptions = {
    rewrites: [
        // Exclude API endpoints from the fallback
        { from: /^\/api\//, to: context => context.parsedUrl.pathname },
        // Fallback to index.html for all other routes
        { from: /./, to: '/index.html' }
    ]
  };

const isDev = process.env.NODE_ENV && process.env.NODE_ENV.trim() === "development";
const app = express();

const distPath = path.resolve(__dirname, "../frontend/dist");

// middleware
app.use(cookieParser());
app.use(express.json());

// DEV CORS
if (isDev) {
    app.use(cors({
        credentials: true,
        origin: "http://localhost:5173",
        optionsSuccessStatus: 200
    }));
// PRODUCTION CORS
} else {
    const allowedOrigins = [`${process.env.SERVER_URL}:${process.env.SERVER_PORT}`, `${process.env.SERVER_URL}`];
    const corsOptions = {
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
    };
    app.use(cors(corsOptions));
}

let httpsServerOptions;
if (!isDev) {
    const keyPath = process.env.SSL_KEY_FILE;
    const certPath = process.env.SSL_CERT_FILE;

    if (!keyPath || !certPath) {
        console.error('SSL_KEY_FILE and SSL_CERT_FILE environment variables must be set.');
        process.exit(1);
    }

    httpsServerOptions = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
    }
}

const server = isDev ? http.createServer(app) : https.createServer(httpsServerOptions, app);
// const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: isDev ? "http://localhost:5173" : "https://unizamarketplace.noiyy.eu",
        methods: ["GET", "POST"],
        credentials: true
    }
});
if (isDev) io.disconnectSockets(true);
socketIoHandler(io, app);

// routes
const authRoutes = require('./routes/authApi');
const userRoutes = require("./routes/userApi");
const productRoutes = require("./routes/productApi");
const feedbackRoutes = require("./routes/feedbackApi");
const miscRoutes = require("./routes/miscApi");
const messageRoutes = require("./routes/messageApi");
 
app.use('/api/auth', authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/misc", miscRoutes);
app.use("/api/messages", messageRoutes);

app.use(express.static(path.join(distPath)));
app.use(history(historyFallbackOptions));

// Handle all other routes and serve the index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

app.use((req, res, next) => {
  console.log("@@@ API CALL - ", req.path, req.method);
  console.log("");
  next();
})
 
// connect to mongodb
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('connected to database')
    startAgenda().catch(console.error);

    server.listen(process.env.PORT, () => {
        console.log('listening for requests on port', process.env.PORT);
    })
})
.catch((err) => {
    console.log("Database connection error:", err);
}) 