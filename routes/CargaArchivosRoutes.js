const express = require("express");

const router = express.Router();

const {
    apikeys,
} = require("../middleware/apikeys");

// Load Methods from Controller
const {
    CargaArchivoProveedores, CargaArchivoLocaciones,
} = require("../controllers/CargaArchivosController");

// Describe the route entrypoints
router.route("/locaciones")
    .post(
        apikeys,
        CargaArchivoLocaciones,
    );

// Describe the route entrypoints
router.route("/proveedores")
    .post(
        apikeys,
        CargaArchivoProveedores,
    );

module.exports = router;
