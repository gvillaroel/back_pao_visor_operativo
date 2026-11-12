const express = require("express");

const router = express.Router();

const {
  apikeys,
} = require("../middleware/apikeys");

// Load Methods from Controller
const {
  ErroresUnique, ListaReprocesoDirigido, ReprocesoDirigidoLotes,
} = require("../controllers/ReprocesosController");

// Describe the route entrypoints
router.route("/getErrores")
  .get(
    apikeys,
    ErroresUnique,
  );

router.route("/ListaReprocesoDirigido")
  .post(
    apikeys,
    ListaReprocesoDirigido,
  );

router.route("/ReprocesoDirigidoLotes")
  .post(
    apikeys,
    ReprocesoDirigidoLotes,
  );

module.exports = router;
