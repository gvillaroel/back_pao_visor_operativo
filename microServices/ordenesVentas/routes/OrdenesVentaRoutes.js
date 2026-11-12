const express = require('express');

const router = express.Router();
// const { authJWT } = require('../middleware/jwt');

// @desc Importing the methods from the utils repository;
const { generarRateLimit } = require('../utils/rate_limiter');

const {
  getHealth,
  getOrdenInfoBy,
  getOrderByOrderNo,
  exportSalesOrdersToExcel,
} = require('../controllers/OrdenesVentaController');
const { apikeys } = require('../middleware/apikeys');

router.route('/health').get(getHealth);

router
  .route('/:OrderNo')
  .get(generarRateLimit('ORDENES_VENTA'), apikeys, getOrderByOrderNo);
// .get(generarRateLimit('ORDENES_VENTA'), apikeys, getOrdenInfoById);

router
  .route('/')
  .get(generarRateLimit('ORDENES_VENTA'), apikeys, getOrdenInfoBy);

 router
  .route('/export-sales-orders/excel')
  .get(generarRateLimit('ORDENES_VENTA'), apikeys, exportSalesOrdersToExcel);

module.exports = router;
