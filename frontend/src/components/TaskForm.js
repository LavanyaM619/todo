import React, { useState } from 'react';
import { taskService } from '../services/api';

const TaskForm = ({ onTaskCreated, loading, setLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await taskService.createTask({
        title: formData.title.trim(),
        description: formData.description.trim()
      });
      
      // Reset form
      setFormData({ title: '', description: '' });
      
      // Refresh tasks list
      onTaskCreated();
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form">
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Create New Task</h2>
      
      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Task Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title..."
            disabled={loading}
            maxLength={255}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description (optional)..."
            disabled={loading}
            maxLength={1000}
          />
        </div>

        <button 
          type="submit" 
          className="btn"
          disabled={loading || !formData.title.trim()}
        >
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
