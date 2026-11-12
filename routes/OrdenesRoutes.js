const express = require("express");

const router = express.Router();

const {
    apikeys,
} = require("../middleware/apikeys");

// Load Methods from Controller
const {
    getOrden, historicoOrden,
} = require("../controllers/OrdenesController");

// Describe the route entrypoints
router.route("/:OrderNo")
    .get(
        apikeys,
        getOrden,
    );

// Describe the route entrypoints
router.route("/historico/:OrderNo")
    .get(
        apikeys,
        historicoOrden,
    );

module.exports = router;
