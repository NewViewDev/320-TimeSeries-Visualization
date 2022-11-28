const mongoose = require("mongoose");
const NodeSchema = new mongoose.Schema({
  SCENARIO_ID: {
    type: String,
  },
  PNODE_NAME: {
    type: String,
  },
  PERIOD_ID: {
    type: Date,
  },
  LMP: {
    type: Number,
  },
});

module.exports = mongoose.model("Node", NodeSchema);
