const { StatusCodes } = require("http-status-codes");
const math = require("mathjs");
const { DateTime } = require("luxon");

const { NotFoundError, BadRequestError } = require("../errors");

const dataLayer = require("../utils/axios-setup");

exports.getFieldNames = async (req, res) => {
  let example = await dataLayer.post("/data/find/generators", {
    take: 1,
  });

  example = example.data[0];
  let { id, NAME, PNODE, ...fields } = example;

  field_names = Object.keys(fields);

  res.status(StatusCodes.OK).json({ field_names });
};

exports.getGeneratorGroup = async (req, res) => {
  promise = [];
  let {
    SCENARIO_ID,
    START_DATE,
    END_DATE,
    GROUPBY,
    FIELD,
    LMP_RANGE,
    INTERVAL,
    OFFSET,
    DST,
  } = req.query;

  if (!SCENARIO_ID || !START_DATE || !END_DATE) {
    throw new BadRequestError("Please provide all values");
  }

  START_DATE = DateTime.fromISO(START_DATE, { zone: "UTC+0" }).toJSDate();
  END_DATE = DateTime.fromISO(END_DATE, { zone: "UTC+0" }).toJSDate();
  OFFSET = parseInt(OFFSET);

  let start = new Date(START_DATE.getTime());
  while (start < END_DATE) {
    let interval;
    if (INTERVAL === "daily") {
      interval = 24;
    } else if (INTERVAL === "monthly") {
      interval = 24 * getDays(start.getUTCFullYear(), start.getUTCMonth() + 1);
    } else if (INTERVAL === "yearly") {
      interval = 24 * daysInYear(start.getUTCFullYear());
    }

    if (DST) {
      interval += parseInt(DST);
    }

    promise.push(
      getFields(
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

  arr = [];
  arr = await Promise.all(promise);

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

getFields = async (
  SCENARIO_ID,
  START_DATE,
  END_DATE,
  FIELD,
  GROUPBY,
  LMP_RANGE
) => {
  let example = await dataLayer.post("/data/find/generators", {
    distinct: [FIELD],
  });

  example = example.data;
  example = example.map((example) => example[FIELD]);

  let groups = {};
  let generator_fields = example.map(async (e) => {
    const example_data = await dataLayer.post("/data/find/generators", {
      where: {
        [FIELD]: e,
      },
    });
    groups[e] = example_data.data;
  });

  await Promise.all(generator_fields);

  for (const group in groups) {
    let nodes = [];

    await Promise.all(
      groups[group].map(async (generator) => {
        let data_query = {
          SCENARIO_ID: SCENARIO_ID,
          PNODE_NAME: generator.PNODE,
        };

        if (START_DATE && END_DATE) {
          data_query["PERIOD_ID"] = {
            gte: START_DATE,
            lte: END_DATE,
          };
        }

        const example_data = await dataLayer.post("/data/find/nodes", {
          where: data_query,
        });
        nodes.push(...example_data.data);
      })
    );
    groups[group] = nodes;
  }

  if (GROUPBY?.includes("LMP")) {
    groups = group_int("LMP", groups, LMP_RANGE.split(","));
  }

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
};

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
