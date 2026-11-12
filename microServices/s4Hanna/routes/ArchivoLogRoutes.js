const express = require("express");

const router = express.Router();

const {
  apikeys,
} = require("../middleware/apikeys");

// Load Methods from Controller
const {
  getLogFile,
  getLogFilesNames,
} = require("../controllers/ArchivoLogController");

// Describe the route entrypoints
router.route("/lista")
  .get(
    apikeys,
    getLogFilesNames,
  );

router.route("/lista/:nombre")
  .get(
    apikeys,
    getLogFile,
  );

module.exports = router;
