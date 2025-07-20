require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 6;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running!' });
});

const analyzeRouter = require('./routes/analyze');

app.use('/api/analyze', analyzeRouter);

// TODO: Add routes/controllers here

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 