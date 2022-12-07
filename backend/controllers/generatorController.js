const { StatusCodes } = require("http-status-codes");

const { NotFoundError, BadRequestError } = require("../errors");

const dataLayer = require("../utils/axios-setup");

exports.getFields = async (req, res) => {
  let example = await dataLayer.post("/data/find/generators", {
    take: 1,
  });

  example = example.data[0];
  delete example.id;

  const object_fields = Object.keys(example);

  const fields = {};
  for (let i = 0; i < object_fields.length; i++) {
    const field = object_fields[i];
    let options = await dataLayer.post("/data/find/generators", {
      select: { [field]: true },
      distinct: [field],
    });
    options = options.data;

    options = options.map((generator) => generator[field]);
    fields[field] = options;
  }

  res.status(StatusCodes.OK).json({ fields });
};
