const express = require('express');
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');

const app = express();

// Basic middleware
app.use(express.json());

// API routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Root endpoint
app.get('/', (req, res) => {
	res.json({
		message: 'Task Management API is running!',
		version: '1.0.0',
		endpoints: {
			users: '/api/users',
			projects: '/api/projects',
			tasks: '/api/tasks'
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