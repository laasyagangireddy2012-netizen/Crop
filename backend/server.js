// CROPXAI Backend Server
// Node.js + Express API Server

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Import routes
const authRoutes = require('./routes/auth');
const cropRoutes = require('./routes/crops');
const soilRoutes = require('./routes/soil');
const recommendationRoutes = require('./routes/recommendations');
const diseaseRoutes = require('./routes/disease');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/soil', soilRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/disease', diseaseRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'CROPXAI Backend Server is running',
        timestamp: new Date().toISOString()
    });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: err.message 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🌾 CROPXAI Backend Server running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
    console.log(`🌐 Frontend available at http://localhost:${PORT}`);
});

module.exports = app;
