const express = require("express");

const router = express.Router();
const { LoginPAO } = require("../controllers/LoginController");

router.route("/").post(LoginPAO);

module.exports = router;
