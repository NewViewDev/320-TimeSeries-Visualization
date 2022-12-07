const { StatusCodes } = require("http-status-codes");

const { NotFoundError, BadRequestError } = require("../errors");

const dataLayer = require("../utils/axios-setup");

// Get scenario ids and names
exports.getScenarios = async (req, res) => {
  let scenarios = await dataLayer.post("/data/find/scenarios", {});

  if (scenarios.status != 200) {
    throw new Error("Data Layer ERROR");
  }

  scenarios = scenarios.data;
  scenarios = scenarios.map((s) => ({
    SCENARIO_ID: s.SCENARIO_ID,
    SCENARIO_NAME: s.SCENARIO_NAME,
  }));
  if (scenarios.length == 0) {
    throw new NotFoundError("No scenario with specified filters");
  }
  res.status(StatusCodes.OK).json({ data: { scenarios } });
};
