const express = require("express");

const router = express.Router();

// @desc Importing the methods from the utils repository;
const { generarRateLimit } = require("../utils/rate_limiter");

const { getSimpliroute } = require("../controllers/SimplirouteController");
const { apikeys } = require("../middleware/apikeys");
// Describe the route entrypoints
router.route("/getSimpliroute/:orderId/:sku").get(generarRateLimit("SIMPLIROUTE"), apikeys, getSimpliroute);

module.exports = router;
