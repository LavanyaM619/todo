import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { taskService } from './services/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await taskService.getTasks();
      setTasks(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleTaskCompleted = async (taskId) => {
    setLoading(true);
    setError('');
    
    try {
      await taskService.completeTask(taskId);
      setSuccess('Task completed successfully!');
      
      await fetchTasks();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = async () => {
    setSuccess('Task created successfully!');
    await fetchTasks();
    
    setTimeout(() => setSuccess(''), 3000);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1>Todo App</h1>
        <p>Manage your tasks efficiently</p>
      </header>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {success && (
        <div className="success">
          {success}
        </div>
      )}

      <TaskForm 
        onTaskCreated={handleTaskCreated}
        loading={loading}
        setLoading={setLoading}
      />

      {loading && tasks.length === 0 ? (
        <div className="loading">
          Loading tasks...
        </div>
      ) : (
        <TaskList 
          tasks={tasks}
          onTaskCompleted={handleTaskCompleted}
          loading={loading}
        />
      )}
    </div>
  );
}

export default App;
