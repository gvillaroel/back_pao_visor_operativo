const express = require('express');

const router = express.Router();

const { generarRateLimit } = require('../utils/rate_limiter');

const {
  saveFolio,
  getIncidentReportInfo,
  postIncidentReportInfo,
} = require('../controllers/FolioController');
const { apikeys } = require('../middleware/apikeys');

// Describe the route entrypoints
router.route('/').post(generarRateLimit('FOLIO'), apikeys, saveFolio);

router
  .route('/:orderHeaderKey/:documentType/:sku')
  .get(generarRateLimit('FOLIO'), apikeys, getIncidentReportInfo);

router
  .route('/folio')
  .post(generarRateLimit('FOLIO'), apikeys, postIncidentReportInfo);

module.exports = router;
