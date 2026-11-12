const express = require("express");
const {
  getAvailability,
  processInventoryUpdateHttp,
} = require("../controllers/NodeAvailabilityController");

const router = express.Router();

// Entrada POST para consultar disponibilidad por centro y skus
router.route("/").post(getAvailability);

// Entrada POST para procesar actualizaciones de inventario (mismo payload de Pub/Sub y Kafka)
router.route("/inventory-updates").post(processInventoryUpdateHttp);

module.exports = router;
