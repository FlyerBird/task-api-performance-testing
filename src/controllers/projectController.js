const database = require('../config/database');

class ProjectController {
	// Get all projects
	getAllProjects(req, res) {
		const db = database.getDatabase();

		const query = `
      SELECT p.*, u.name as owner_name 
      FROM projects p 
      LEFT JOIN users u ON p.user_id = u.id 
      ORDER BY p.created_at DESC
    `;

		db.all(query, (err, projects) => {
			if (err) {
				console.error('Error getting projects:', err.message);
				return res.status(500).json({
					success: false,
					error: 'Failed to get projects'
				});
			}

			res.json({
				success: true,
				data: projects,
				count: projects.length
			});
		});
	}

	// Create new project
	createProject(req, res) {
		const db = database.getDatabase();
		const { title, description, user_id, status = 'active' } = req.body;

		// Basic validation
		if (!title || !user_id) {
			return res.status(400).json({
				success: false,
				error: 'Title and user_id are required'
			});
		}

		// Check if user exists
		db.get('SELECT id FROM users WHERE id = ?', [user_id], (err, user) => {
			if (err) {
				console.error('Error checking user:', err.message);
				return res.status(500).json({ success: false, error: 'Database error' });
			}

			if (!user) {
				return res.status(404).json({ success: false, error: 'User not found' });
			}

			// Create project
			db.run('INSERT INTO projects (title, description, user_id, status) VALUES (?, ?, ?, ?)',
				[title, description, user_id, status], function (err) {
					if (err) {
						console.error('Error creating project:', err.message);
						return res.status(500).json({
							success: false,
							error: 'Failed to create project'
						});
					}

					res.status(201).json({
						success: true,
						message: 'Project created successfully',
						projectId: this.lastID
					});
				});
		});
	}

	// Update project
	updateProject(req, res) {
		const db = database.getDatabase();
		const { id } = req.params;
		const { title, description, status } = req.body;

		// Check if project exists
		db.get('SELECT id FROM projects WHERE id = ?', [id], (err, project) => {
			if (err) {
				console.error('Error checking project:', err.message);
				return res.status(500).json({ success: false, error: 'Database error' });
			}

			if (!project) {
				return res.status(404).json({ success: false, error: 'Project not found' });
			}

			// Update project
			db.run('UPDATE projects SET title = ?, description = ?, status = ? WHERE id = ?',
				[title, description, status, id], function (err) {
					if (err) {
						console.error('Error updating project:', err.message);
						return res.status(500).json({ success: false, error: 'Failed to update project' });
					}

					res.json({
						success: true,
						message: 'Project updated successfully'
					});
				});
		});
	}

	// Delete project
	deleteProject(req, res) {
		const db = database.getDatabase();
		const { id } = req.params;

		db.run('DELETE FROM projects WHERE id = ?', [id], function (err) {
			if (err) {
				console.error('Error deleting project:', err.message);
				return res.status(500).json({ success: false, error: 'Failed to delete project' });
			}

			if (this.changes === 0) {
				return res.status(404).json({ success: false, error: 'Project not found' });
			}

			res.json({
				success: true,
				message: 'Project deleted successfully'
			});
		});
	}
}

module.exports = new ProjectController();