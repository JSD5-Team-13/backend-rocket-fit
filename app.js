const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const logging = require("morgan");
const Auth = require("./middleware/auth.js");
require("dotenv").config();

const app = express();
const database = process.env.DATABASE_URL;

mongoose.Promise = global.Promise;

mongoose.connect(database, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to mongoDB");
});

const allowedMethods = ["GET", "PUT", "POST", "DELETE"];
const allowedHeaders = ["Authorization", "Content-Type", "x-auth-token"];

app.use(
  cors({
    origin: "https://rocket-fit.vercel.app/",
    methods: allowedMethods.join(", "),
    allowedHeaders: allowedHeaders.join(", "),
    credentials: true,
  })
);

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logging("tiny"));

//Protected Routes

//Routes
app.use('/calendar' , require('./routes/memo'))
app.use('/register' , require('./routes/register'))
app.use('/login' , require('./routes/login'))
app.use('/activity', require('./routes/activity'));
app.use('/post', require('./routes/post'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/connection' , require('./routes/connection'))
app.use('/all' , require('./routes/alluser'))
app.use('/upload', require('./routes/upload.js'))
app.use('/sleeptime' , require('./routes/sleeptime'))
app.use(Auth);
app.use("/users", require("./routes/user"));
app.use("/comment", require("./routes/comment"));

//Auth

const ipAddress = '127.0.0.1';
const port = 8000;

app.listen(port, ipAddress, () => {
  console.log(`Server starting on IP:${ipAddress} Port: ${port}`);
});

module.exports = app;
