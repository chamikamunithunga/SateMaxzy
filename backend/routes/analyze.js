const express = require('express');
const router = express.Router();
const { analyzeArea, generateReport, downloadReport } = require('../controllers/analyzeController');

// POST /api/analyze - Full analysis with satellite data and AI report
router.post('/', analyzeArea);

// POST /api/analyze/report - Generate AI report from existing analysis data
router.post('/report', generateReport);

// POST /api/analyze/download - Download report as file
router.post('/download', downloadReport);

module.exports = router; 