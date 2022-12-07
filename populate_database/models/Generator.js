const mongoose = require("mongoose");
const GeneratorSchema = new mongoose.Schema({
  PNODE: {
    type: String,
  },
  NAME: {
    type: String,
  },
  TYPE: {
    type: String,
  },
  LOAD_ZONE: {
    type: String,
  },
  DISPATCH_ZONE: {
    type: String,
  },
  RESERVE_ZONE: {
    type: String,
  },
  FUEL: {
    type: String,
  },
});

module.exports = mongoose.model("Generator", GeneratorSchema);
