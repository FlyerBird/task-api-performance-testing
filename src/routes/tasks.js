const express = require('express');
const taskController = require('../controllers/taskController');

const router = express.Router();

// GET /api/tasks - Get all tasks
router.get('/', taskController.getAllTasks);

// POST /api/tasks - Create new task
router.post('/', taskController.createTask);

// PUT /api/tasks/:id - Update task
router.put('/:id', taskController.updateTask);

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', taskController.deleteTask);

module.exports = router;