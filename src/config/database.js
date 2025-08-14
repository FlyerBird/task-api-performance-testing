const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../../database/tasks.db');

class Database {
	constructor() {
		this.db = null;
	}

	connect() {
		return new Promise((resolve, reject) => {
			this.db = new sqlite3.Database(DB_PATH, (err) => {
				if (err) {
					console.error('Error connecting to database:', err.message);
					reject(err);
				} else {
					console.log('✅ Connected to SQLite database');
					this.createTables().then(resolve).catch(reject);
				}
			});
		});
	}

	createTables() {
		return new Promise((resolve, reject) => {
			const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

			this.db.run(createUsersTable, (err) => {
				if (err) {
					console.error('Error creating users table:', err.message);
					reject(err);
				} else {
					console.log('📋 Users table ready');
					resolve();
				}
			});
		});
	}

	getDatabase() {
		return this.db;
	}
}

module.exports = new Database();