const express = require("express");

const router = express.Router();

const {
    apikeys,
} = require("../middleware/apikeys");

// Load Methods from Controller
const {
    INT300,
} = require("../controllers/INT300Controller");

// Describe the route entrypoints
router.route("/")
    .post(
        apikeys,
        INT300,
    );

module.exports = router;
