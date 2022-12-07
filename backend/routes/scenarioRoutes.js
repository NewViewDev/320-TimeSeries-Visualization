const express = require("express");
const router = express.Router();

const dataController = require("../controllers/scenarioController");

router.route("/").get(dataController.getScenarios);

module.exports = router;
