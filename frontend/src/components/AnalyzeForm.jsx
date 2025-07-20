import React, { useState } from 'react';
import axios from 'axios';
import MapSelector from './MapSelector';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AnalyzeForm = () => {
  const [coordinates, setCoordinates] = useState('');
  const [area, setArea] = useState('');
  const [selectedArea, setSelectedArea] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState('ready'); // ready, fetching, analyzing, reporting

  const handleAreaSelect = (areaData) => {
    setSelectedArea(areaData);
    if (areaData) {
      setCoordinates(areaData.coordinates.join(','));
      setArea(areaData.area);
    } else {
      setCoordinates('');
      setArea('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setCurrentStep('fetching');
    
    try {
      const coords = coordinates.split(',').map(Number);
      setCurrentStep('fetching');
      setCurrentStep('analyzing');
              const response = await axios.post('http://localhost:5008/api/analyze', {
        coordinates: coords,
        area,
      });
      setCurrentStep('reporting');
      setResult(response.data);
      setCurrentStep('complete');
    } catch (err) {
      setError(err.response?.data?.error || 'Request failed');
      setCurrentStep('error');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    if (!result?.analysis) return;
    try {
      const response = await axios.post('http://localhost:5008/api/analyze/download', {
        analysisData: result.analysis
      }, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `satellite_report_${new Date().toISOString().split('T')[0]}.md`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const getStepMessage = () => {
    switch (currentStep) {
      case 'fetching': return '🛰️ Fetching satellite imagery...';
      case 'analyzing': return '🔍 Running AI analysis...';
      case 'reporting': return '📝 Generating AI report...';
      case 'complete': return '✅ Analysis complete!';
      case 'error': return '❌ Analysis failed';
      default: return '';
    }
  };

  // Prepare chart data
  let chartData = [];
  if (result?.analysis?.current_detections) {
    const counts = {};
    result.analysis.current_detections.forEach(det => {
      counts[det.class] = (counts[det.class] || 0) + 1;
    });
    chartData = Object.entries(counts).map(([type, count]) => ({ type, count }));
  }

  return (
    <Card sx={{ 
      maxWidth: 1000, 
      margin: '2rem auto', 
      borderRadius: 4, 
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
          🛰️ Satellite Area Analysis
        </Typography>
        <MapSelector onAreaSelect={handleAreaSelect} />
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <Box sx={{ flex: 1, minWidth: 220 }}>
              <Typography variant="subtitle2" sx={{ color: '#34495e', fontWeight: '600' }}>
                Coordinates (comma-separated):
              </Typography>
              <input
                type="text"
                value={coordinates}
                onChange={e => setCoordinates(e.target.value)}
                placeholder="e.g. 100.0,0.0 or select from map above"
                required
                style={{ 
                  width: '100%', 
                  marginBottom: 10, 
                  padding: 12, 
                  borderRadius: 8, 
                  border: '2px solid #e0e6ed',
                  background: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                  '&:focus': {
                    outline: 'none',
                    borderColor: '#667eea',
                    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
                  }
                }}
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: 220 }}>
              <Typography variant="subtitle2" sx={{ color: '#34495e', fontWeight: '600' }}>
                Area Description:
              </Typography>
              <input
                type="text"
                value={area}
                onChange={e => setArea(e.target.value)}
                placeholder="Polygon or description"
                required
                style={{ 
                  width: '100%', 
                  marginBottom: 10, 
                  padding: 12, 
                  borderRadius: 8, 
                  border: '2px solid #e0e6ed',
                  background: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  transition: 'all 0.3s ease'
                }}
              />
            </Box>
          </Box>
          <CardActions>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading} 
              fullWidth 
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 2,
                py: 1.5,
                fontSize: '16px',
                fontWeight: 'bold',
                textTransform: 'none',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)'
                }
              }}
            >
              {loading ? <><CircularProgress size={24} sx={{ mr: 2, color: 'white' }} />{getStepMessage()}</> : '🚀 Start Analysis'}
            </Button>
          </CardActions>
        </form>
        {error && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{error}</Alert>
        )}
        {result && (
          <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
                📊 Analysis Results
              </Typography>
              <Button 
                onClick={downloadReport} 
                variant="outlined" 
                color="success" 
                startIcon={<span>📥</span>}
                sx={{
                  borderRadius: 2,
                  borderColor: '#27ae60',
                  color: '#27ae60',
                  '&:hover': {
                    borderColor: '#229954',
                    backgroundColor: 'rgba(39, 174, 96, 0.1)'
                  }
                }}
              >
                Download Report
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {/* Satellite Images */}
            {result.satelliteData && (
              <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {result.satelliteData.currentImage && (
                  <Box sx={{ flex: 1, minWidth: 300 }}>
                    <Typography variant="subtitle1" sx={{ color: '#34495e', fontWeight: '600', mb: 1 }}>
                      Current Image
                    </Typography>
                    <img 
                      src={result.satelliteData.currentImage.url} 
                      alt="Current satellite image"
                      style={{ 
                        width: '100%', 
                        maxWidth: 400, 
                        border: '2px solid #e0e6ed', 
                        borderRadius: 8,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Date: {result.satelliteData.currentImage.metadata.date}
                    </Typography>
                  </Box>
                )}
                {result.satelliteData.historicalImage && (
                  <Box sx={{ flex: 1, minWidth: 300 }}>
                    <Typography variant="subtitle1" sx={{ color: '#34495e', fontWeight: '600', mb: 1 }}>
                      Historical Image (7 days ago)
                    </Typography>
                    <img 
                      src={result.satelliteData.historicalImage.url} 
                      alt="Historical satellite image"
                      style={{ 
                        width: '100%', 
                        maxWidth: 400, 
                        border: '2px solid #e0e6ed', 
                        borderRadius: 8,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Date: {result.satelliteData.historicalImage.metadata.date}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
            {/* AI Report */}
            {result.report && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ color: '#34495e', fontWeight: '600', mb: 1 }}>
                  🤖 AI-Generated Report ({result.report.source})
                </Typography>
                <Box sx={{ 
                  background: 'rgba(248, 249, 250, 0.8)', 
                  p: 3, 
                  borderRadius: 3, 
                  border: '1px solid rgba(222, 226, 230, 0.5)', 
                  maxHeight: 400, 
                  overflowY: 'auto',
                  backdropFilter: 'blur(10px)'
                }}>
                  <pre style={{ 
                    whiteSpace: 'pre-wrap', 
                    fontFamily: 'inherit', 
                    margin: 0,
                    color: '#2c3e50',
                    lineHeight: 1.6
                  }}>
                    {result.report.report}
                  </pre>
                </Box>
              </Box>
            )}
            {/* Analysis Details */}
            {result.analysis && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ color: '#34495e', fontWeight: '600', mb: 1 }}>
                  🔍 Detailed Analysis
                </Typography>
                <Box sx={{ 
                  background: 'rgba(248, 249, 250, 0.8)', 
                  p: 3, 
                  borderRadius: 3, 
                  maxHeight: 300, 
                  overflowY: 'auto',
                  backdropFilter: 'blur(10px)'
                }}>
                  <pre style={{ 
                    whiteSpace: 'pre-wrap', 
                    fontFamily: 'inherit', 
                    margin: 0, 
                    fontSize: 12,
                    color: '#2c3e50'
                  }}>
                    {JSON.stringify(result.analysis, null, 2)}
                  </pre>
                </Box>
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyzeForm; 