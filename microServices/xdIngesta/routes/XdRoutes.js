const express = require("express");

const router = express.Router();
// const { authJWT } = require("../middleware/jwt");

// @desc Importing the methods from the utils repository;
const { generarRateLimit } = require("../utils/rate_limiter");

const { saveXd, persistXd } = require("../controllers/XdController");
const { apikeys } = require("../middleware/apikeys");

// Describe the route entrypoints
router.route("/").post(generarRateLimit("XD"), apikeys, saveXd);
router.route("/persist").post(generarRateLimit("XD"), apikeys, persistXd);
module.exports = router;
