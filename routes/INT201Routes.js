const express = require("express");

const router = express.Router();

const {
    apikeys,
} = require("../middleware/apikeys");

// Load Methods from Controller
const {
    INT201,
} = require("../controllers/INT201Controller");

// Describe the route entrypoints
router.route("/")
    .post(
        apikeys,
        INT201,
    );

module.exports = router;
