const express = require("express");

const router = express.Router();

const {
    apikeys,
} = require("../middleware/apikeys");

// Load Methods from Controller
const {
    RecordarioNdias,
} = require("../controllers/RecordatoriosController");

// Describe the route entrypoints
router.route("/:dias")
    .get(
        apikeys,
        RecordarioNdias,
    );

module.exports = router;
