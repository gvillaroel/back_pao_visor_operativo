const express = require('express');
const { apikeys } = require('../middleware/apikeys');

const router = express.Router();
// const { authJWT } = require('../middleware/jwt');

// @desc Importing the methods from the utils repository;
const { generarRateLimit } = require('../utils/rate_limiter');

const { postSiebel } = require('../controllers/SiebelController');

// Describe the route entrypoints
router.route('/').post(apikeys, generarRateLimit('SIEBEL'), postSiebel);

module.exports = router;
