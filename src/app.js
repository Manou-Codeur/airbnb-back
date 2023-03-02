require("dotenv").config();
const express = require("express");
const app = express();

const port = process.env.port || 4000;
const dbConnection = require("./utils/db");

dbConnection(process.env.MONGO_URI);

app.listen(port, () => {
  console.log(` | Listening on port ${port}`);
});
