import React from 'react';

const TaskCard = ({ task, onTaskCompleted, loading }) => {
  const handleComplete = async () => {
    if (loading) return;
    
    try {
      await onTaskCompleted(task._id);
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
      </div>
      
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      
      <div style={{ 
        fontSize: '0.9rem', 
        color: '#888', 
        marginBottom: '15px' 
      }}>
        Created: {formatDate(task.createdAt)}
      </div>

      <div className="task-actions">
        <button
          onClick={handleComplete}
          className="btn btn-complete"
          disabled={loading}
        >
          {loading ? 'Completing...' : 'Done'}
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
