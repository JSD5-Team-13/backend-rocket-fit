const express = require("express");
const app = express();

//import cookie parser
const cookie = require("cookie-parser");

//import file .env
require("dotenv").config();

//import Middleware
const cors = require("cors");
const morgan = require("morgan");
const bodyParse = require("body-parser");

app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParse.json({ limit: "10mb" }));
app.use(cookie());

//import Databases
const connectDB = require("./Config/databases");
connectDB();

//import Routes auth.js
const authRouters = require("./Routes/auth");
app.use("/api", authRouters);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Sever is Running`);
});
