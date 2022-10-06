const { StatusCodes } = require("http-status-codes");

exports.getAllData = (req, res) => {
  res.status(StatusCodes.OK).json({ data: {} });
};
