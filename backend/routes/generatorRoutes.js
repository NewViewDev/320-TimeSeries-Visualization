const express = require("express");
const router = express.Router();

const generatorController = require("../controllers/generatorController");

router.route("/").get(generatorController.getGeneratorGroup);
router.route("/fields").get(generatorController.getFieldNames);

module.exports = router;
