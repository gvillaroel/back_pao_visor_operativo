const express = require("express");

const router = express.Router();

const {
    apikeys,
} = require("../middleware/apikeys");

// Load Methods from Controller
const {
    createLocacion,
    getLocaciones,
    getLocacionesByID,
    updateLocacion,
    deleteLocacion,
} = require("../controllers/LocacionesController");

// Describe the route entrypoints
router.route("/")
    .post(apikeys, createLocacion)
    .get(apikeys, getLocaciones);

router.route("/:id")
    .get(apikeys, getLocacionesByID)
    .put(apikeys, updateLocacion)
    .delete(apikeys, deleteLocacion);

module.exports = router;
