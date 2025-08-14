const database = require('../config/database');

class UserController {
	// Get all users
	getAllUsers(req, res) {
		const db = database.getDatabase();

		db.all('SELECT * FROM users ORDER BY created_at DESC', (err, users) => {
			if (err) {
				console.error('Error getting users:', err.message);
				return res.status(500).json({
					success: false,
					error: 'Failed to get users'
				});
			}

			res.json({
				success: true,
				data: users,
				count: users.length
			});
		});
	}

	// Create new user
	createUser(req, res) {
		const db = database.getDatabase();
		const { name, email } = req.body;

		// Basic validation
		if (!name || !email) {
			return res.status(400).json({
				success: false,
				error: 'Name and email are required'
			});
		}

		db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], function (err) {
			if (err) {
				console.error('Error creating user:', err.message);
				return res.status(500).json({
					success: false,
					error: 'Failed to create user'
				});
			}

			res.status(201).json({
				success: true,
				message: 'User created successfully',
				userId: this.lastID
			});
		});
	}

	// Update user
	updateUser(req, res) {
		const db = database.getDatabase();
		const { id } = req.params;
		const { name, email } = req.body;

		// Check if user exists
		db.get('SELECT id FROM users WHERE id = ?', [id], (err, user) => {
			if (err) {
				console.error('Error checking user:', err.message);
				return res.status(500).json({ success: false, error: 'Database error' });
			}

			if (!user) {
				return res.status(404).json({ success: false, error: 'User not found' });
			}

			// Update user
			db.run('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id], function (err) {
				if (err) {
					console.error('Error updating user:', err.message);
					return res.status(500).json({ success: false, error: 'Failed to update user' });
				}

				res.json({
					success: true,
					message: 'User updated successfully'
				});
			});
		});
	}

	// Delete user
	deleteUser(req, res) {
		const db = database.getDatabase();
		const { id } = req.params;

		db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
			if (err) {
				console.error('Error deleting user:', err.message);
				return res.status(500).json({ success: false, error: 'Failed to delete user' });
			}

			if (this.changes === 0) {
				return res.status(404).json({ success: false, error: 'User not found' });
			}

			res.json({
				success: true,
				message: 'User deleted successfully'
			});
		});
	}
}



module.exports = new UserController();