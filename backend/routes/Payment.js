const express = require('express');
const { capturePayment, verifySignature } = require('../controllers/Payment');
const router = express.Router();
const { auth } = require("../middlewares/auth");

router.post('/capture-payment', auth, capturePayment);
router.post('/verify-signature', auth, verifySignature);

module.exports = router;
