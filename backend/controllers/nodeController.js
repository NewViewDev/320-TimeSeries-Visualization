const { StatusCodes } = require("http-status-codes");

const math = require("mathjs");
const { DateTime } = require("luxon");

const { NotFoundError, BadRequestError } = require("../errors");

const dataLayer = require("../utils/axios-setup");

// Get distinct node names
exports.getNodeNames = async (req, res) => {
  const START_DATE = DateTime.fromISO("2020-12-01T01:00:00", {
    zone: "UTC+0",
  }).toJSDate();
  const END_DATE = DateTime.fromISO("2020-12-02T00:00:00", {
    zone: "UTC+0",
  }).toJSDate();

  let nodes = await dataLayer.post("/data/find/nodes", {
    where: {
      PERIOD_ID: {
        gte: START_DATE,
        lte: END_DATE,
      },
    },
    select: {
      PNODE_NAME: true,
    },
    distinct: ["PNODE_NAME"],
  });

  if (nodes.status != 200) {
    throw new Error("Data Layer ERROR");
  }
  nodes = nodes.data;

  nodes = nodes.map((node) => node.PNODE_NAME);

  if (nodes.length == 0) {
    throw new NotFoundError("No node found");
  }
  res.status(StatusCodes.OK).json({ data: { nodes } });
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

  // check if params provided
  if (!PNODE_NAME || !SCENARIO_ID_1 || !SCENARIO_ID_2 || !FIELD) {
    throw new BadRequestError("Please provide all values");
  }

  let nodes;

  if (START_DATE && END_DATE) {
    START_DATE = DateTime.fromISO(START_DATE, { zone: "UTC+0" }).toJSDate();
    END_DATE = DateTime.fromISO(END_DATE, { zone: "UTC+0" }).toJSDate();

    nodes = await dataLayer.post("data/find/nodes", {
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
        { PERIOD_ID: "asc" },
      ],
    });
  } else {
    nodes = await dataLayer.post("/data/find/nodes", {
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
        { PERIOD_ID: "asc" },
      ],
    });
  }

  nodes = nodes.data;
  if (nodes.length == 0) {
    throw new NotFoundError("No node with specified filters");
  }

  res.status(StatusCodes.OK).json({ length: nodes.length, data: { nodes } });
};

// Group for specific node name
exports.getGroup = async (req, res) => {
  promise = [];
  let {
    SCENARIO_ID,
    START_DATE,
    END_DATE,
    FIELD,
    GROUPBY,
    LMP_RANGE,
    INTERVAL,
    OFFSET,
    PNODE_NAME,
    DST,
  } = req.query;

  if (!SCENARIO_ID) {
    throw new BadRequestError("Please provide all values");
  }

  START_DATE = DateTime.fromISO(START_DATE, { zone: "UTC+0" }).toJSDate();
  END_DATE = DateTime.fromISO(END_DATE, { zone: "UTC+0" }).toJSDate();
  OFFSET = parseInt(OFFSET);

  let arr = [];

  if (INTERVAL) {
    let start = new Date(START_DATE.getTime());
    while (start < END_DATE) {
      let interval;
      if (INTERVAL === "daily") {
        interval = 24;
      } else if (INTERVAL === "monthly") {
        var test = start.toISOString();
        interval =
          24 * getDays(start.getUTCFullYear(), start.getUTCMonth() + 1);
      } else if (INTERVAL === "yearly") {
        interval = 24 * daysInYear(start.getUTCFullYear());
      }

      if (DST) {
        interval += parseInt(DST);
      }

      promise.push(
        nodeGroup(
          PNODE_NAME,
          SCENARIO_ID,
          addHours(start, OFFSET),
          addHours(start, interval + OFFSET - 1),
          FIELD,
          GROUPBY,
          LMP_RANGE
        )
      );
      start = addHours(start, interval);
    }

    arr = await Promise.all(promise);
  } else {
    arr = [
      await nodeGroup(
        PNODE_NAME,
        SCENARIO_ID,
        addHours(START_DATE, OFFSET),
        addHours(END_DATE, OFFSET),
        FIELD,
        GROUPBY,
        LMP_RANGE
      ),
    ];
  }

  res.status(StatusCodes.OK).json({ length: arr.length, data: [...arr] });
};

// Gets days in a month
function getDays(year, month) {
  return new Date(year, month, 0).getDate();
}

function addHours(date, hours) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

function daysInYear(year) {
  return (year % 4 === 0 && year % 100 > 0) || year % 400 == 0 ? 366 : 365;
}

async function nodeGroup(
  PNODE_NAME,
  SCENARIO_ID,
  START_DATE,
  END_DATE,
  FIELD,
  GROUPBY,
  LMP_RANGE
) {
  let data_query = {
    SCENARIO_ID: SCENARIO_ID,
    PERIOD_ID: {
      gte: START_DATE,
      lte: END_DATE,
    },
  };

  if (PNODE_NAME) {
    data_query["PNODE_NAME"] = PNODE_NAME;
  }

  let nodes = await dataLayer.post("/data/find/nodes", {
    where: data_query,
    select: {
      PNODE_NAME: true,
      SCENARIO_ID: true,
      PERIOD_ID: true,
      [FIELD]: true,
    },

    orderBy: [
      {
        LMP: "asc",
      },
    ],
  });
  nodes = nodes.data;

  let groups = { all: [...nodes] };

  if (GROUPBY?.includes("LMP")) {
    groups = group_int("LMP", groups, LMP_RANGE.split(","));
  }

  // if (GROUPBY?.includes("PNODE_NAME")) {
  //   groups = group_string("PNODE_NAME", groups);
  // }

  for (const group in groups) {
    let stat;
    if (groups[group].length === 0) {
      stat = { std: 0, mean: 0, median: 0 };
    } else {
      const values = groups[group].map((node) => node["LMP"]);
      const std = math.std(values);
      const mean = math.mean(values);
      const median = math.median(values);
      stat = { std, mean, median };
    }
    // groups[group] = { stats: stat, nodes: groups[group] };
    groups[group] = { stats: stat };
  }

  const label = START_DATE.toISOString() + "-" + END_DATE.toISOString();

  return { interval: label, groups };
}

/**
 * Groups by equivalent strings
 * @param {String} FIELD
 * @param {object} groups
 * @returns
 */
function group_string(FIELD, groups) {
  for (const group in groups) {
    let arr = groups[group];
    arr.forEach((node) => {
      const prop = node[FIELD];
      // if first grouping discard "all"
      const name = group !== "all" ? group + "," + prop : prop;
      // add new group
      if (groups.hasOwnProperty(name)) {
        groups[name].push(node);
      } else {
        groups[name] = [node];
      }
    });
    // delete old group
    delete groups[group];
  }

  return groups;
}

/**
 * Groups by given ranges
 * @param {String} FIELD
 * @param {object} groups
 * @param {String[]} query
 * @returns
 */
function group_int(FIELD, groups, query) {
  for (const group in groups) {
    let arr = groups[group];
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
    // if last query integer is smaller than some of the elements
    // name last group with the max value of integer field
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
