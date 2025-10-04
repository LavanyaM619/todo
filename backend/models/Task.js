const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [255, 'Title cannot exceed 255 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    default: ''
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true 
});


taskSchema.index({ completed: 1, createdAt: -1 });
taskSchema.index({ createdAt: -1 });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
