const express = require("express");

const router = express.Router();
const { authJWT } = require("../middleware/jwt");

// @desc Importing the methods from the utils repository;
const { generarRateLimit } = require("../utils/rate_limiter");

const { saveS4Hanna, persistHanna } = require("../controllers/S4HannaController");
const { apikeys } = require('../middleware/apikeys')

// Describe the route entrypoints
router
  .route('/')
  .post(generarRateLimit('S4HANNA'), apikeys, saveS4Hanna);
router
    .route('/persist')
    .post(generarRateLimit('S4HANNA'), apikeys, persistHanna);

module.exports = router;
