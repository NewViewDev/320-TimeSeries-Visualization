const express = require("express");
const router = express.Router();

const dataController = require("../controllers/dataController");

router.route("/nodes").get(dataController.getNode);
router.route("/nodes/name").get(dataController.getNodeNames);
router.route("/scenarios").get(dataController.getScenarios);

module.exports = router;
