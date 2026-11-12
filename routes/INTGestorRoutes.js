const express = require("express");

const router = express.Router();

const {
    apikeys,
} = require("../middleware/apikeys");

// Load Methods from Controller
const {
    INTGestor,
} = require("../controllers/INTGestor");

// Describe the route entrypoints
router.route("/")
    .post(
        apikeys,
        INTGestor,
    );

module.exports = router;
