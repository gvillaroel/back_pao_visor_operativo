const express = require("express");
const { getHealth } = require("../controllers/HealthCheckController");

const router = express.Router();

router.route("/").get(getHealth);

module.exports = router;
