const { StatusCodes } = require("http-status-codes");
const prisma = require("../utils/prisma");

const math = require("mathjs");

const { NotFoundError, BadRequestError } = require("../errors");

exports.getNodeNames = async (req, res) => {
  let nodes = await prisma.nodes.findMany({
    select: {
      PNODE_NAME: true,
    },
    distinct: ["PNODE_NAME"],
  });

  if (nodes.length == 0) {
    throw new NotFoundError("No node found");
  }
  nodes = nodes.map((node) => node.PNODE_NAME);
  res.status(StatusCodes.OK).json({ data: { nodes } });
};

exports.getScenarios = async (req, res) => {
  let scenarios = await prisma.scenarios.findMany({});
  scenarios = scenarios.map((s) => ({
    SCENARIO_ID: s.SCENARIO_ID,
    SCENARIO_NAME: s.SCENARIO_NAME,
  }));
  if (scenarios.length == 0) {
    throw new NotFoundError("No scenario with specified filters");
  }
  res.status(StatusCodes.OK).json({ data: { scenarios } });
};

// Get data points for specified node with two scenarios
exports.getNode = async (req, res) => {
  // extract params from url
  let {
    PNODE_NAME,
    SCENARIO_ID_1,
    SCENARIO_ID_2,
    START_DATE,
    END_DATE,
    FIELD,
  } = req.query;
  let nodes;

  if (!PNODE_NAME || !SCENARIO_ID_1 || !SCENARIO_ID_2 || !FIELD) {
    throw new BadRequestError("Please provide all values");
  }

  if (START_DATE && END_DATE) {
    START_DATE = new Date(START_DATE);
    END_DATE = new Date(END_DATE);
    START_DATE.setUTCHours(0);
    END_DATE.setUTCHours(0);

    nodes = await prisma.nodes.findMany({
      where: {
        PNODE_NAME: PNODE_NAME,
        OR: [{ SCENARIO_ID: SCENARIO_ID_1 }, { SCENARIO_ID: SCENARIO_ID_2 }],
        PERIOD_ID: {
          gte: START_DATE,
          lte: END_DATE,
        },
      },
      select: {
        SCENARIO_ID: true,
        PERIOD_ID: true,
        [FIELD]: true,
      },
      orderBy: [
        {
          SCENARIO_ID: "asc",
        },
        { LMP: "asc" },
      ],
    });
  } else {
    nodes = await prisma.nodes.findMany({
      where: {
        PNODE_NAME: PNODE_NAME,
        OR: [{ SCENARIO_ID: SCENARIO_ID_1 }, { SCENARIO_ID: SCENARIO_ID_2 }],
      },
      select: {
        SCENARIO_ID: true,
        PERIOD_ID: true,
        [FIELD]: true,
      },
      orderBy: [
        {
          SCENARIO_ID: "asc",
        },
        { LMP: "asc" },
      ],
    });
  }

  if (nodes.length == 0) {
    throw new NotFoundError("No node with specified filters");
  }

  res.status(StatusCodes.OK).json({ data: { nodes } });
};

// Group by

exports.getNodeGroup = async (req, res) => {
  // extract params from url
  let { SCENARIO_ID, START_DATE, END_DATE, FIELD, GROUPBY, LMP_RANGE } =
    req.query;
  let nodes;

  if (!SCENARIO_ID || !START_DATE || !END_DATE) {
    throw new BadRequestError("Please provide all values");
  }

  START_DATE = new Date(START_DATE);
  END_DATE = new Date(END_DATE);
  START_DATE.setUTCHours(0);
  END_DATE.setUTCHours(0);

  nodes = await prisma.nodes.findMany({
    where: {
      SCENARIO_ID: SCENARIO_ID,
      PERIOD_ID: {
        gte: START_DATE,
        lte: END_DATE,
      },
    },
    select: {
      PNODE_NAME: true,
      SCENARIO_ID: true,
      PERIOD_ID: true,
      [FIELD]: true,
    },
    orderBy: {
      LMP: "asc",
    },
  });

  let groups = { all: [...nodes] };

  if (GROUPBY?.includes("LMP")) {
    groups = group_int(nodes, "LMP", groups, LMP_RANGE.split(","));
  }

  if (GROUPBY?.includes("PNODE_NAME")) {
    groups = group_string(nodes, "PNODE_NAME", groups);
  }

  for (const group in groups) {
    const values = groups[group].map((node) => node["LMP"]);
    const std = math.std(values);
    const mean = math.mean(values);
    const median = math.median(values);
    const stat = { std, mean, median };
    groups[group] = { stats: stat, nodes: groups[group] };
  }

  if (nodes.length == 0) {
    throw new NotFoundError("No node with specified filters");
  }

  res.status(StatusCodes.OK).json({ data: { groups }, length: nodes.length });
};

function group_string(arr, FIELD, groups) {
  for (const group in groups) {
    arr = groups[group];
    arr.forEach((node) => {
      const prop = node[FIELD];
      const name = group !== "all" ? group + "," + prop : prop;
      if (groups.hasOwnProperty(name)) {
        groups[name].push(node);
      } else {
        groups[name] = [node];
      }
    });
    delete groups[group];
  }

  return groups;
}

function group_int(arr, FIELD, groups, query) {
  for (const group in groups) {
    arr = groups[group];
    let max = 0;
    let query_index = 0;
    for (let i = 0; i < arr.length; i++) {
      max = Math.max(max, arr[i][FIELD]);
      if (arr[i][FIELD] > parseInt(query[query_index])) {
        query_index++;
      }
      const name =
        group !== "all" ? group + "," + query[query_index] : query[query_index];
      if (groups.hasOwnProperty(name)) {
        groups[name].push(arr[i]);
      } else {
        groups[name] = [arr[i]];
      }
    }
    const name = group !== "all" ? group + "," + "undefined" : "undefined";
    if (groups[name]) {
      groups[
        name === "undefined" ? Math.ceil(max) : group + "," + Math.ceil(max)
      ] = groups[name];
      delete groups[name];
    }
    delete groups[group];
  }
  return groups;
}
