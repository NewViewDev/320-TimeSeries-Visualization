const prisma = require("../utils/prisma");
// const { ObjectId } = require("bson");

const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");

async function createGroup(GROUP_ID, GROUP_NAME, readable) {
  readable.pause();
  await prisma.groups.create({
    data: {
      GROUP_ID: GROUP_ID,
      GROUP_NAME: GROUP_NAME,
    },
  });
  readable.resume();
}

async function createScenario(
  SCENARIO_ID,
  SCENARIO_NAME,
  AUTHOR_GROUP_ID,
  readable
) {
  readable.pause();
  await prisma.scenarios.create({
    data: {
      SCENARIO_ID,
      SCENARIO_NAME,
      AUTHOR_GROUP_ID,
    },
  });
  readable.resume();
}

async function createNode(SCENARIO_ID, PNODE_NAME, PERIOD_ID, LMP, readable) {
  readable.pause();
  const period = PERIOD_ID.split(" ");
  const date = new Date(period[0]);
  date.setUTCHours(period[1]);
  await prisma.nodes.create({
    data: {
      SCENARIO_ID,
      PNODE_NAME,
      PERIOD_ID: date,
      LMP: parseFloat(LMP),
    },
  });
  readable.resume();
}

const group_readable = fs
  .createReadStream(
    path.resolve(__dirname, "../dummy-data/", "dummy-groups.csv")
  )
  .pipe(csv.parse({ headers: true }))
  .on("error", (error) => console.error(error))
  .on("data", (row) => {
    const { GROUP_ID, GROUP_NAME } = row;
    createGroup(GROUP_ID, GROUP_NAME, group_readable);
  })
  .on("end", (rowCount) => console.log(`Parsed ${rowCount} rows`));

const scenario_readable = fs
  .createReadStream(
    path.resolve(__dirname, "../dummy-data/", "dummy-scenarios.csv")
  )
  .pipe(csv.parse({ headers: true }))
  .on("error", (error) => console.error(error))
  .on("data", (row) => {
    const { SCENARIO_ID, SCENARIO_NAME, AUTHOR_GROUP_ID } = row;
    createScenario(
      SCENARIO_ID,
      SCENARIO_NAME,
      AUTHOR_GROUP_ID,
      scenario_readable
    );
  })
  .on("end", (rowCount) => console.log(`Parsed ${rowCount} rows`));

const node_readable = fs
  .createReadStream(
    path.resolve(__dirname, "../dummy-data/", "dummy-node-data.csv")
  )
  .pipe(csv.parse({ headers: true }))
  .on("error", (error) => console.error(error))
  .on("data", (row) => {
    const { SCENARIO_ID, PNODE_NAME, PERIOD_ID, LMP } = row;
    createNode(SCENARIO_ID, PNODE_NAME, PERIOD_ID, LMP, node_readable);
  })
  .on("end", (rowCount) => console.log(`Parsed ${rowCount} rows`));
