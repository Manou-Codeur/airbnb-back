require("dotenv").config();
const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const port = process.env.port || 4000;
const origin = process.env.origin || 3000;
const dbConnection = require("./utils/db");
const { catchExeption } = require("./middlewares/exeptionsCatcher");

dbConnection(process.env.MONGO_URI);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: `http://localhost:${origin}`, credentials: true }));

fs.readdirSync("./src/routes").map((route) => {
  if (route.split(".")[1] !== "routes") {
    app.use("/api", require("./routes/" + route));
  }
});

// catch exceptions
app.use(catchExeption);

app.listen(port, () => {
  console.log(` | Listening on port ${port}`);
});
