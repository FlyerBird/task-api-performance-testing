const database = require('../config/database');

class TaskController {
	// Get all tasks
	getAllTasks(req, res) {
		const db = database.getDatabase();

		const query = `
      SELECT t.*, 
             p.title as project_title,
             u.name as assigned_to_name
      FROM tasks t 
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN users u ON t.assigned_to = u.id 
      ORDER BY t.created_at DESC
    `;

		db.all(query, (err, tasks) => {
			if (err) {
				console.error('Error getting tasks:', err.message);
				return res.status(500).json({
					success: false,
					error: 'Failed to get tasks'
				});
			}

			res.json({
				success: true,
				data: tasks,
				count: tasks.length
			});
		});
	}

	// Create new task
	createTask(req, res) {
		const db = database.getDatabase();
		const {
			title,
			description,
			project_id,
			assigned_to = null,
			status = 'pending',
			priority = 'medium',
			due_date = null
		} = req.body;

		// Basic validation
		if (!title || !project_id) {
			return res.status(400).json({
				success: false,
				error: 'Title and project_id are required'
			});
		}

		// Check if project exists
		db.get('SELECT id FROM projects WHERE id = ?', [project_id], (err, project) => {
			if (err) {
				console.error('Error checking project:', err.message);
				return res.status(500).json({ success: false, error: 'Database error' });
			}

			if (!project) {
				return res.status(404).json({ success: false, error: 'Project not found' });
			}

			// Create task
			db.run(`INSERT INTO tasks 
              (title, description, project_id, assigned_to, status, priority, due_date) 
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
				[title, description, project_id, assigned_to, status, priority, due_date],
				function (err) {
					if (err) {
						console.error('Error creating task:', err.message);
						return res.status(500).json({
							success: false,
							error: 'Failed to create task'
						});
					}

					res.status(201).json({
						success: true,
						message: 'Task created successfully',
						taskId: this.lastID
					});
				});
		});
	}

	// Update task
	updateTask(req, res) {
		const db = database.getDatabase();
		const { id } = req.params;
		const { title, description, status, priority, assigned_to, due_date } = req.body;

		// Check if task exists
		db.get('SELECT id FROM tasks WHERE id = ?', [id], (err, task) => {
			if (err) {
				console.error('Error checking task:', err.message);
				return res.status(500).json({ success: false, error: 'Database error' });
			}

			if (!task) {
				return res.status(404).json({ success: false, error: 'Task not found' });
			}

			// Update task
			db.run(`UPDATE tasks SET 
              title = ?, description = ?, status = ?, priority = ?, assigned_to = ?, due_date = ?
              WHERE id = ?`,
				[title, description, status, priority, assigned_to, due_date, id],
				function (err) {
					if (err) {
						console.error('Error updating task:', err.message);
						return res.status(500).json({ success: false, error: 'Failed to update task' });
					}

					res.json({
						success: true,
						message: 'Task updated successfully'
					});
				});
		});
	}

	// Delete task
	deleteTask(req, res) {
		const db = database.getDatabase();
		const { id } = req.params;

		db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
			if (err) {
				console.error('Error deleting task:', err.message);
				return res.status(500).json({ success: false, error: 'Failed to delete task' });
			}

			if (this.changes === 0) {
				return res.status(404).json({ success: false, error: 'Task not found' });
			}

			res.json({
				success: true,
				message: 'Task deleted successfully'
			});
		});
	}
}

module.exports = new TaskController();