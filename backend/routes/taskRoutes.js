const express = require('express');
const router = express.Router();
const { taskController, createTaskValidation } = require('../controllers/taskController');

// GET /api/tasks - Get all incomplete tasks (max 5)
router.get('/', taskController.getTasks);

// POST /api/tasks - Create a new task
router.post('/', createTaskValidation, taskController.createTask);

// GET /api/tasks/:id - Get a specific task
router.get('/:id', taskController.getTask);

// PUT /api/tasks/:id/complete - Mark a task as completed
router.put('/:id/complete', taskController.completeTask);

module.exports = router;
