const express = require("express");
const app = express();

require("express-async-errors");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();

const dataRouter = require("./routes/dataRoutes");

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use("/api/v1/data", dataRouter);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
