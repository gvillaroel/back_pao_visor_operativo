const express = require("express");

const router = express.Router();
const {
  apikeys,
} = require("../middleware/apikeys");

// Load Methods from Controller
const {
  createApikey, fetchOneApikey, fetchAllApikey, updateApikey, deleteApikey,
} = require("../controllers/ApikeyController");

// Describe the route entrypoints
router.route("/create")
  .post(
    apikeys,
    createApikey,
  );

router.route("/:apikey")
  .get(
    apikeys,
    fetchOneApikey,
  );

router.route("/")
  .get(
    apikeys,
    fetchAllApikey,
  );

router.route("/")
  .put(
    apikeys,
    updateApikey,
  );

router.route("/:id_key")
  .delete(
    apikeys,
    deleteApikey,
  );

module.exports = router;
