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
			const tables = [
				// Users table
				`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

				// Projects table
				`CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    user_id INTEGER NOT NULL,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )` ,

				// Tasks table
				`CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  project_id INTEGER NOT NULL,
  assigned_to INTEGER,
  due_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects (id),
  FOREIGN KEY (assigned_to) REFERENCES users (id)
)`
			];

			let completed = 0;
			tables.forEach((sql, index) => {
				this.db.run(sql, (err) => {
					if (err) {
						console.error(`Error creating table ${index}:`, err.message);
						reject(err);
					} else {
						completed++;
						if (completed === tables.length) {
							console.log('📋 Users, Projects and Tasks tables ready');
							resolve();
						}
					}
				});
			});
		});
	}

	getDatabase() {
		return this.db;
	}
}

module.exports = new Database();