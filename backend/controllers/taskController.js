const Task = require('../models/Task');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Validation rules
const createTaskValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title is required and must be less than 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters')
];

const taskController = {
  // GET /api/tasks - Get all incomplete tasks (max 5)
  async getTasks(req, res) {
    try {
      const tasks = await Task.find({ completed: false })
        .sort({ createdAt: -1 })
        .limit(5);
      
      res.json({
        success: true,
        data: tasks
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // POST /api/tasks - Create a new task
  async createTask(req, res) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { title, description } = req.body;
      const task = new Task({
        title: title.trim(),
        description: (description || '').trim()
      });
      
      await task.save();
      
      res.status(201).json({
        success: true,
        data: task,
        message: 'Task created successfully'
      });
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // PUT /api/tasks/:id/complete - Mark a task as completed
  async completeTask(req, res) {
    try {
      const { id } = req.params;
      
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid task ID'
        });
      }
      
      const task = await Task.findOneAndUpdate(
        { _id: id, completed: false },
        { completed: true },
        { new: true }
      );
      
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found or already completed'
        });
      }

      res.json({
        success: true,
        data: task,
        message: 'Task marked as completed'
      });
    } catch (error) {
      console.error('Error completing task:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // GET /api/tasks/:id - Get a specific task
  async getTask(req, res) {
    try {
      const { id } = req.params;
      
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid task ID'
        });
      }
      
      const task = await Task.findById(id);
      
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      res.json({
        success: true,
        data: task
      });
    } catch (error) {
      console.error('Error fetching task:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
};

module.exports = {
  taskController,
  createTaskValidation
};
