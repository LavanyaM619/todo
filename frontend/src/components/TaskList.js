import React from 'react';
import TaskCard from './TaskCard';

const TaskList = ({ tasks, onTaskCompleted, loading }) => {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <h3>No tasks yet!</h3>
        <p>Create your first task to get started.</p>
      </div>
    );
  }

  return (
    <div className="tasks-container">
      <h2 style={{ 
        color: 'white', 
        marginBottom: '20px', 
        textAlign: 'center',
        fontSize: '1.8rem',
        fontWeight: '300'
      }}>
        Recent Tasks
      </h2>
      
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onTaskCompleted={onTaskCompleted}
          loading={loading}
        />
      ))}
      
      {tasks.length === 5 && (
        <div style={{ 
          textAlign: 'center', 
          color: 'white', 
          opacity: 0.8,
          fontSize: '0.9rem',
          marginTop: '20px'
        }}>
          Showing the 5 most recent incomplete tasks
        </div>
      )}
    </div>
  );
};

export default TaskList;
