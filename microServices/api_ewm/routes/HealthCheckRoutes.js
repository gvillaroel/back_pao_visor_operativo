const express = require("express");

const router = express.Router();

// Load Methods from Controller
const { getHealth } = require("../controllers/HealtCheckController");

router.route("/").get(getHealth);

module.exports = router;
