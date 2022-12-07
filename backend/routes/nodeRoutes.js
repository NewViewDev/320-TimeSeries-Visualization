const express = require("express");
const router = express.Router();

const dataController = require("../controllers/nodeController");

router.route("/").get(dataController.getNode);
router.route("/group").get(dataController.getGroup);
router.route("/name").get(dataController.getNodeNames);

module.exports = router;
