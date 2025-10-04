import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_URL?.replace(/\/$/, '') || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: Number(process.env.REACT_APP_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (process.env.REACT_APP_DEBUG === 'true') {
      console.log(`📡 ${config.method?.toUpperCase()} → ${config.baseURL}${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (process.env.REACT_APP_DEBUG === 'true') {
      console.error('⚠️ API Error:', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

export const taskService = {
  // Get all incomplete tasks
  async getTasks() {
    const response = await api.get('/tasks');
    return response.data;
  },

  // Create a new task
  async createTask(taskData) {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // Mark a task as completed
  async completeTask(taskId) {
    const response = await api.put(`/tasks/${taskId}/complete`);
    return response.data;
  },

  // Get a specific task
  async getTask(taskId) {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  }
};

export default api;
