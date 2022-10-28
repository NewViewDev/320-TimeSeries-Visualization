const mongoose = require("mongoose");
const Node = require("../models/Node");
const Scenario = require("../models/Scenario");
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createNode(SCENARIO_ID, PNODE_NAME, PERIOD_ID, LMP) {
  const period = PERIOD_ID.split(" ");
  const date = new Date(period[0]);
  date.setUTCHours(period[1]);
  console.log(date);
  await Node.create({
    SCENARIO_ID,
    PNODE_NAME,
    PERIOD_ID: date,
    LMP: parseFloat(LMP),
  });
}
async function createScenario(SCENARIO_ID, SCENARIO_NAME, AUTHOR_GROUP_ID) {
  await Scenario.create({
    SCENARIO_ID,
    SCENARIO_NAME,
    AUTHOR_GROUP_ID,
  });
}

fs.createReadStream(
  path.resolve(__dirname, "../dummy-data/", "dummy-node-data.csv")
)
  .pipe(csv.parse({ headers: true }))
  .on("error", (error) => console.error(error))
  .on("data", (row) => {
    const { SCENARIO_ID, PNODE_NAME, PERIOD_ID, LMP } = row;
    createNode(SCENARIO_ID, PNODE_NAME, PERIOD_ID, LMP);
  })
  .on("end", (rowCount) => console.log(`Parsed ${rowCount} rows`));

fs.createReadStream(
  path.resolve(__dirname, "../dummy-data/", "dummy-scenarios.csv")
)
  .pipe(csv.parse({ headers: true }))
  .on("error", (error) => console.error(error))
  .on("data", (row) => {
    const { SCENARIO_ID, SCENARIO_NAME, AUTHOR_GROUP_ID } = row;
    createScenario(SCENARIO_ID, SCENARIO_NAME, AUTHOR_GROUP_ID);
  })
  .on("end", (rowCount) => console.log(`Parsed ${rowCount} rows`));
