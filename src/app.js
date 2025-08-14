const express = require('express');
const userRoutes = require('./routes/users');

const app = express();

// Basic middleware
app.use(express.json());

// API routes
app.use('/api/users', userRoutes);

// Root endpoint
app.get('/', (req, res) => {
	res.json({
		message: 'Task Management API is running!',
		version: '1.0.0',
		endpoints: {
			users: '/api/users'
		},
		timestamp: new Date().toISOString()
	});
});

// Health check endpoint
app.get('/health', (req, res) => {
	res.json({
		status: 'OK',
		uptime: process.uptime(),
		timestamp: new Date().toISOString()
	});
});

module.exports = app;