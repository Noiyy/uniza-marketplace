const path = require("path");
require("dotenv").config();
 
const express = require('express');
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');
const cors = require('cors');
 
const authRoutes = require('./routes/authApi');
const userRoutes = require("./routes/userApi");
const productRoutes = require("./routes/productApi");
const feedbackRoutes = require("./routes/feedbackApi");
const miscRoutes = require("./routes/miscApi");

const app = express();
const isDev = true;
 
// middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    credentials: true
}));
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
})
 
// routes
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