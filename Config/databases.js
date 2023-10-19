const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.databases);
    console.log("DataBases Connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
