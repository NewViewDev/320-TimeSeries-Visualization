const express = require("express");
const router = express.Router();

const dataController = require("../controllers/generatorController");

router.route("/").get(dataController.getFields);

module.exports = router;
