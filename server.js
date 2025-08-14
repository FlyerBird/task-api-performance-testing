const app = require('./src/app');
const database = require('./src/config/database');

const PORT = process.env.PORT || 3000;

// Initialize database and start server
database.connect()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`🚀 Server running on port ${PORT}`);
			console.log(`📖 Health check: http://localhost:${PORT}/health`);
		});
	})
	.catch((error) => {
		console.error('Failed to initialize database:', error);
		process.exit(1);
	});