const express = require('express');
const router = express.Router();

const transcribeController = require('../controller/transcribeController');

router.post('/transcribe', transcribeController);

module.exports = router;