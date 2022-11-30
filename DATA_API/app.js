const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
require("dotenv").config();

const prisma = require("./utils/prisma");

require("express-async-errors");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();

const dataRouter = require("./routes/dataRoutes");
const errorHandlerMiddleware = require("./utils/error-handler");

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use("/api/v1/data", dataRouter);

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
