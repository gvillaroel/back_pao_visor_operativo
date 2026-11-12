const express = require("express");

const router = express.Router();
// const { authJWT } = require("../middleware/jwt");

// @desc Importing the methods from the utils repository;
const { generarRateLimit } = require("../utils/rate_limiter");

const { getXd } = require("../controllers/XdController");
const { apikeys } = require("../middleware/apikeys")
// Describe the route entrypoints
router.route("/getXd/:orderNo/:sku").get(generarRateLimit("XD"), apikeys, getXd);

module.exports = router;
