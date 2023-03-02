const mongoose = require("mongoose");

const dbConnection = async (db) => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(db);
    console.log(" | Successfully connected to the database");
  } catch (err) {
    console.log(" | The connection to the database was unsuccessful");
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = dbConnection;
