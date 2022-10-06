const express = require("express");
const router = express.Router();

const dataController = require("../controllers/dataController");

router.route("/").get(dataController.getAllData);

module.exports = router;
