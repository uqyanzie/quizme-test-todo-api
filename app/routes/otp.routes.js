const express = require("express");
const router = express.Router();

const otpController = require("../controllers/otp.controller");

router.post("/send-otp", otpController.sendOTP);

module.exports = router;