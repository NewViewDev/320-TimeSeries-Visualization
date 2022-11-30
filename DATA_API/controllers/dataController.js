const { StatusCodes } = require("http-status-codes");
const prisma = require("../utils/prisma");

// const { NotFoundError, BadRequestError } = require("../errors");

exports.findMany = async (req, res) => {
  let nodes = await prisma[req.params["collection"]].findMany(req.body);

  res.status(StatusCodes.OK).json(nodes);
};
