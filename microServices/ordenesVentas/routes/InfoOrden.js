const express = require('express');

const router = express.Router();
// const { authJWT } = require('../middleware/jwt');

// @desc Importing the methods from the utils repository;
const { generarRateLimit } = require('../utils/rate_limiter');

const {
  getOrden,
  getOrdenEmp,
  getOrderSystems,
} = require('../controllers/InfoOrdenController');
const { apikeys } = require('../middleware/apikeys');


router
  .route('/:OrderNo')
  .get(apikeys, getOrden);

router
  .route('/:OrderNo/:Empresa')
  .get(apikeys, getOrdenEmp);
  
router
  .route('/systems/:OrderNo/get-info')
  .get(apikeys, getOrderSystems);

module.exports = router;
