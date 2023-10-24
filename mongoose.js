const mongoose = require("mongoose");
require("./model");

module.exports = async function mongo() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/users");
    console.log("DB connected successfully");
  } catch (err) {
    console.log("DB connection refused");
  }
};
