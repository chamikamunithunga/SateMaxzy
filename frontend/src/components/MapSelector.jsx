import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onMapClick([lng, lat]); // Leaflet uses [lat, lng], but we want [lng, lat] for consistency
    },
  });
  return null;
};

const MapSelector = ({ onAreaSelect }) => {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [isDrawingPolygon, setIsDrawingPolygon] = useState(false);

  const handleMapClick = (coords) => {
    if (isDrawingPolygon) {
      setPolygonPoints([...polygonPoints, coords]);
    } else {
      setSelectedPoint(coords);
      if (onAreaSelect) {
        onAreaSelect({ coordinates: coords, area: `Point at ${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}` });
      }
    }
  };

  const startDrawingPolygon = () => {
    setIsDrawingPolygon(true);
    setPolygonPoints([]);
    setSelectedPoint(null);
  };

  const finishDrawingPolygon = () => {
    if (polygonPoints.length >= 3) {
      setIsDrawingPolygon(false);
      if (onAreaSelect) {
        onAreaSelect({ 
          coordinates: polygonPoints[0], 
          area: `Polygon with ${polygonPoints.length} points` 
        });
      }
    }
  };

  const clearSelection = () => {
    setSelectedPoint(null);
    setPolygonPoints([]);
    setIsDrawingPolygon(false);
    if (onAreaSelect) {
      onAreaSelect(null);
    }
  };

  return (
    <Paper sx={{ 
      p: 2, 
      mb: 3, 
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: 3
    }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#2c3e50', fontWeight: 'bold' }}>
        🗺️ Select Area of Interest
      </Typography>
      
      <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button 
          onClick={startDrawingPolygon} 
          disabled={isDrawingPolygon} 
          variant="outlined"
          size="small"
          sx={{
            borderColor: '#667eea',
            color: '#667eea',
            '&:hover': {
              borderColor: '#5a6fd8',
              backgroundColor: 'rgba(102, 126, 234, 0.1)'
            }
          }}
        >
          Draw Polygon
        </Button>
        <Button 
          onClick={finishDrawingPolygon} 
          disabled={!isDrawingPolygon || polygonPoints.length < 3}
          variant="contained"
          size="small"
          sx={{
            background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #229954 0%, #27ae60 100%)'
            }
          }}
        >
          Finish Polygon
        </Button>
        <Button 
          onClick={clearSelection} 
          variant="outlined"
          size="small"
          sx={{
            borderColor: '#e74c3c',
            color: '#e74c3c',
            '&:hover': {
              borderColor: '#c0392b',
              backgroundColor: 'rgba(231, 76, 60, 0.1)'
            }
          }}
        >
          Clear
        </Button>
      </Box>
      
      <Box sx={{ 
        borderRadius: 2, 
        overflow: 'hidden', 
        border: '2px solid #e0e6ed',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}>
        <MapContainer
          center={[0, 0]}
          zoom={2}
          style={{ height: 400, width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapClickHandler onMapClick={handleMapClick} />
          {selectedPoint && (
            <Marker position={[selectedPoint[1], selectedPoint[0]]} />
          )}
          {polygonPoints.length > 0 && (
            <Polygon 
              positions={polygonPoints.map(point => [point[1], point[0]])}
              color={isDrawingPolygon ? "#e74c3c" : "#667eea"}
              weight={3}
              fillOpacity={0.2}
            />
          )}
        </MapContainer>
      </Box>
      
      <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {selectedPoint && (
          <Typography variant="body2" sx={{ 
            color: '#34495e', 
            background: 'rgba(102, 126, 234, 0.1)', 
            p: 1, 
            borderRadius: 1,
            fontWeight: '500'
          }}>
            📍 Selected: {selectedPoint[0].toFixed(4)}, {selectedPoint[1].toFixed(4)}
          </Typography>
        )}
        {polygonPoints.length > 0 && (
          <Typography variant="body2" sx={{ 
            color: '#34495e', 
            background: 'rgba(39, 174, 96, 0.1)', 
            p: 1, 
            borderRadius: 1,
            fontWeight: '500'
          }}>
            🔷 Polygon points: {polygonPoints.length}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default MapSelector; 