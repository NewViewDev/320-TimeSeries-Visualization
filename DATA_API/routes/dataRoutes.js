const express = require("express");
const router = express.Router();

const dataController = require("../controllers/dataController");

router.route("/find/:collection").post(dataController.findMany);

module.exports = router;
