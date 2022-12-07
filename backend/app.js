const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
require("dotenv").config();

require("express-async-errors");
const morgan = require("morgan");

const nodeRouter = require("./routes/nodeRoutes");
const scenarioRouter = require("./routes/scenarioRoutes");
const generatorRouter = require("./routes/generatorRoutes");

const errorHandlerMiddleware = require("./utils/error-handler");

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use("/api/v1/data/nodes", nodeRouter);
app.use("/api/v1/data/scenarios", scenarioRouter);
app.use("/api/v1/data/generators", generatorRouter);

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
