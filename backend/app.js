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

const isDev = process.env.NODE_ENV && process.env.NODE_ENV.trim() === "development";
const app = express();

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
                const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
    };
    app.use(cors(corsOptions));
}

app.use((req, res, next) => {
  console.log("@@@ API CALL - ", req.path, req.method);
  console.log("");
  next();
})

// routes
const authRoutes = require('./routes/authApi');
const userRoutes = require("./routes/userApi");
const productRoutes = require("./routes/productApi");
const feedbackRoutes = require("./routes/feedbackApi");
const miscRoutes = require("./routes/miscApi");
 
app.use('/api/auth', authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/misc/", miscRoutes);
 
// connect to mongodb
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('connected to database')
    app.listen(process.env.PORT, () => {
        console.log('listening for requests on port', process.env.PORT);
    })
})
.catch((err) => {
    console.log(err);
}) 