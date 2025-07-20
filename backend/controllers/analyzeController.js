const { spawn } = require('child_process');
const path = require('path');
const satelliteService = require('../services/satelliteService');
const reportService = require('../services/reportService');

exports.analyzeArea = async (req, res) => {
  try {
    const { coordinates, area } = req.body;
    
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid coordinates. Expected [longitude, latitude]' 
      });
    }

    console.log('Starting analysis for coordinates:', coordinates);

    // Step 1: Fetch satellite images
    console.log('Fetching satellite images...');
    let currentImage, historicalImage;
    
    try {
      currentImage = await satelliteService.getNasaGibsImage(coordinates);
      historicalImage = await satelliteService.getHistoricalImage(coordinates);
      console.log('Satellite images fetched successfully');
    } catch (error) {
      console.error('Satellite fetch error:', error);
      // Use placeholder images if satellite fetch fails
      currentImage = satelliteService.getPlaceholderImage(coordinates, new Date().toISOString().split('T')[0]);
      historicalImage = satelliteService.getPlaceholderImage(coordinates, new Date().toISOString().split('T')[0]);
    }
    
    if (!currentImage.success) {
      console.log('Using fallback satellite data');
      currentImage = satelliteService.getPlaceholderImage(coordinates, new Date().toISOString().split('T')[0]);
    }

    // Step 2: Run YOLOv8 analysis
    console.log('Running YOLOv8 analysis...');
    const analysisResult = await runYOLOAnalysis(coordinates, area, currentImage.imageUrl, historicalImage.success ? historicalImage.imageUrl : null);
    
    if (!analysisResult.success) {
      console.error('YOLO analysis failed:', analysisResult.error);
      return res.status(500).json({ 
        success: false, 
        error: analysisResult.error 
      });
    }

    // Step 3: Generate AI report
    console.log('Generating AI report...');
    let report;
    try {
      report = await reportService.generateReport(analysisResult.data);
    } catch (error) {
      console.error('Report generation error:', error);
      report = reportService.generateMockReport(analysisResult.data);
    }

    // Step 4: Prepare comprehensive response
    const response = {
      success: true,
      analysis: analysisResult.data,
      report: report,
      satelliteData: {
        currentImage: {
          url: currentImage.imageUrl,
          metadata: currentImage.metadata
        },
        historicalImage: historicalImage.success ? {
          url: historicalImage.imageUrl,
          metadata: historicalImage.metadata
        } : null
      },
      timestamp: new Date().toISOString()
    };

    console.log('Analysis completed successfully');
    res.json(response);

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Analysis failed' 
    });
  }
};

// Helper function to run YOLO analysis
function runYOLOAnalysis(coordinates, area, currentImageUrl, historicalImageUrl) {
  return new Promise((resolve, reject) => {
    const pyPath = path.join(__dirname, '../ml/yolo_infer.py');
    const pythonPath = path.join(__dirname, '../ml_env/bin/python');
    const py = spawn(pythonPath, [pyPath]);

    let result = '';
    let error = '';

    py.stdout.on('data', (data) => {
      result += data.toString();
    });

    py.stderr.on('data', (data) => {
      error += data.toString();
    });

    py.on('close', (code) => {
      if (code !== 0 || error) {
        console.error('Python script error:', error);
        resolve({
          success: false,
          error: error || 'Python script error'
        });
        return;
      }
      
      try {
        const output = JSON.parse(result);
        resolve({
          success: true,
          data: output
        });
      } catch (e) {
        console.error('JSON parse error:', e);
        resolve({
          success: false,
          error: 'Invalid JSON from Python script'
        });
      }
    });

    // Send data to Python script
    const inputData = {
      coordinates: coordinates,
      area: area,
      image_url: currentImageUrl,
      historical_image_url: historicalImageUrl
    };
    
    py.stdin.write(JSON.stringify(inputData));
    py.stdin.end();
  });
}

// New endpoint for generating reports only
exports.generateReport = async (req, res) => {
  try {
    const { analysisData } = req.body;
    
    if (!analysisData) {
      return res.status(400).json({ 
        success: false, 
        error: 'Analysis data is required' 
      });
    }

    const report = await reportService.generateReport(analysisData);
    
    res.json({
      success: true,
      report: report
    });

  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Report generation failed' 
    });
  }
};

// New endpoint for downloading reports
exports.downloadReport = async (req, res) => {
  try {
    const { analysisData } = req.body;
    
    if (!analysisData) {
      return res.status(400).json({ 
        success: false, 
        error: 'Analysis data is required' 
      });
    }

    const report = await reportService.generateReport(analysisData);
    const pdfReport = await reportService.generatePDFReport(report);
    
    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Content-Disposition', `attachment; filename="${pdfReport.filename}"`);
    res.send(pdfReport.content);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Download failed' 
    });
  }
}; 