const express = require("express");

const router = express.Router();

const {
    apikeys,
} = require("../middleware/apikeys");

// Load Methods from Controller
const {
    createProveedor,
    getProveedores,
    getProveedoresByID,
    updateProveedor,
    deleteProveedor,
} = require("../controllers/ProveedoresController");

// Describe the route entrypoints
router.route("/")
    .post(apikeys, createProveedor)
    .get(apikeys, getProveedores);

router.route("/:id")
    .get(apikeys, getProveedoresByID)
    .put(apikeys, updateProveedor)
    .delete(apikeys, deleteProveedor);

module.exports = router;
