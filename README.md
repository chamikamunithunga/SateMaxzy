# 🛰️ Satellite Data Summarizer

An AI-powered application that generates human-readable environmental reports from satellite imagery using advanced machine learning and natural language processing.

## 🌟 Features

- **Real Satellite Data Integration**: Fetch satellite imagery from NASA APIs, Sentinel Hub, and Google Earth Engine
- **AI-Powered Analysis**: YOLOv8 object detection for identifying environmental features
- **Intelligent Report Generation**: GPT-4/Gemini AI for creating comprehensive environmental reports
- **Time Series Analysis**: Compare before/after images for change detection
- **Interactive Map Selection**: Leaflet.js map interface for area selection
- **Export Functionality**: Download reports in PDF/Markdown format
- **Modern UI**: Glass-morphism design with responsive layout

## 🏗️ Architecture

```
space/
├── frontend/                 # React.js frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   └── App.jsx         # Main application
├── backend/                 # Node.js API server
│   ├── controllers/        # API controllers
│   ├── services/          # Business logic services
│   ├── routes/            # API routes
│   └── ml/               # Python ML scripts
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd space
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Set up Python Environment**
   ```bash
   cd ../backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install ultralytics opencv-python numpy pillow
   ```

5. **Configure Environment Variables**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your API keys
   ```

## 🔑 API Configuration

Create a `.env` file in the `backend/` directory:

```env
# Satellite Data APIs
SENTINEL_HUB_CLIENT_ID=your_sentinel_hub_client_id_here
SENTINEL_HUB_CLIENT_SECRET=your_sentinel_hub_client_secret_here
GOOGLE_EARTH_ENGINE_PRIVATE_KEY=your_google_earth_engine_private_key_here
NASA_API_KEY=your_nasa_api_key_here

# AI Report Generation APIs
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_GEMINI_API_KEY=your_google_gemini_api_key_here

# Optional: Google Maps API for enhanced mapping
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Server Configuration
PORT=5005
NODE_ENV=development
```

### Getting API Keys

1. **NASA API**: [NASA API Portal](https://api.nasa.gov/)
   - Free tier available
   - Perfect for educational/research projects

2. **OpenAI API**: [OpenAI Platform](https://platform.openai.com/api-keys)
   - For GPT-4 report generation
   - Requires account and billing setup

3. **Google Gemini API**: [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Alternative to OpenAI
   - Free tier available

4. **Sentinel Hub**: [Sentinel Hub](https://apps.sentinel-hub.com/)
   - High-quality satellite imagery
   - Free tier available

## 🏃‍♂️ Running the Application

### Start Backend Server
```bash
cd backend
node index.js
```
Server will start on `http://localhost:5005`

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend will start on `http://localhost:5173`

### Access the Application
Open your browser and navigate to `http://localhost:5173`

## 📖 Usage Guide

1. **Select Area**: Use the interactive map to draw a polygon or click to select coordinates
2. **Enter Details**: Add area description and verify coordinates
3. **Start Analysis**: Click "Start Analysis" to begin processing
4. **View Results**: See satellite images, AI analysis, and generated report
5. **Download Report**: Export the analysis as a downloadable report

## 🔧 Technical Stack

### Frontend
- **React.js** - UI framework
- **Material-UI** - Component library
- **Leaflet.js** - Interactive maps
- **Axios** - HTTP client
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Python** - ML processing
- **YOLOv8** - Object detection
- **OpenAI/Gemini** - AI report generation

### APIs & Services
- **NASA EPIC/GIBS** - Satellite imagery
- **Sentinel Hub** - High-resolution satellite data
- **Google Earth Engine** - Advanced satellite analysis
- **OpenAI GPT-4** - Natural language generation
- **Google Gemini** - Alternative AI service

## 🧪 Testing

### Test Backend API
```bash
curl -X POST http://localhost:5005/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"coordinates":[100,0],"area":"test area"}'
```

### Health Check
```bash
curl http://localhost:5005/api/health
```

## 📊 Features in Detail

### Satellite Data Processing
- Multi-source satellite imagery fetching
- Time series analysis for change detection
- NDVI (Normalized Difference Vegetation Index) calculation
- Historical image comparison

### AI Analysis
- YOLOv8 object detection for environmental features
- Change detection between time periods
- Environmental impact assessment
- Automated report generation

### User Interface
- Responsive glass-morphism design
- Interactive map with polygon drawing
- Real-time analysis progress tracking
- Export functionality for reports

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- NASA for providing satellite imagery APIs
- OpenAI for AI report generation capabilities
- Ultralytics for YOLOv8 object detection
- The open-source community for various libraries and tools

## 📞 Support

For support, email [your-email] or create an issue in the repository.

---

**Built with ❤️ for environmental research and education**
