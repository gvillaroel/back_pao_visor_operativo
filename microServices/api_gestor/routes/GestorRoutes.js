const express = require("express");

const router = express.Router();

// @desc Importing the methods from the utils repository;
const { generarRateLimit } = require("../utils/rate_limiter");

const { getGestor } = require("../controllers/GestorController");
const { apikeys } = require("../middleware/apikeys");

// Describe the route entrypoints
router.route("/:guia").get(generarRateLimit("GESTOR"), apikeys, getGestor);

module.exports = router;
