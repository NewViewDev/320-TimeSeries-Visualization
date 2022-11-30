const mongoose = require("mongoose");
const Node = require("../models/Node");
const Scenario = require("../models/Scenario");
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");

mongoose.connect(
  "mongodb+srv://team4am:team4am@cluster0.bplpxq2.mongodb.net/data?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

async function createNode(SCENARIO_ID, PNODE_NAME, PERIOD_ID, LMP) {
  const period = PERIOD_ID + "+00:00";
  const date = new Date(period);
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

const node_stream = fs
  .createReadStream(
    path.resolve(__dirname, "../dummy-data/", "dummy-data-3.7.csv")
  )
  .pipe(csv.parse({ headers: true }))
  .on("error", (error) => console.error(error))
  .on("data", (row) => {
    const { SCENARIO_ID, PNODE_NAME, PERIOD_ID, LMP } = row;
    node_stream.pause();
    setTimeout(() => {
      node_stream.resume();
    }, 2);
    createNode(SCENARIO_ID, PNODE_NAME, PERIOD_ID, LMP);
  })
  .on("end", (rowCount) => console.log(`Parsed ${rowCount} rows`));

// fs.createReadStream(
//   path.resolve(__dirname, "../dummy-data/", "dummy-scenarios.csv")
// )
//   .pipe(csv.parse({ headers: true }))
//   .on("error", (error) => console.error(error))
//   .on("data", (row) => {
//     const { SCENARIO_ID, SCENARIO_NAME, AUTHOR_GROUP_ID } = row;
//     createScenario(SCENARIO_ID, SCENARIO_NAME, AUTHOR_GROUP_ID);
//   })
//   .on("end", (rowCount) => console.log(`Parsed ${rowCount} rows`));
