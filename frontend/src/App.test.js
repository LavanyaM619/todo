import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { taskService } from './services/api';

// Mock the API service
jest.mock('./services/api');
const mockedTaskService = taskService;

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders todo app title', async () => {
    // Mock successful API response
    mockedTaskService.getTasks.mockResolvedValue({
      data: []
    });

    render(<App />);
    
    expect(screen.getByText('Todo App')).toBeInTheDocument();
    expect(screen.getByText('Manage your tasks efficiently')).toBeInTheDocument();
  });

  test('displays loading state initially', () => {
    mockedTaskService.getTasks.mockImplementation(() => new Promise(() => {}));
    
    render(<App />);
    
    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
  });

  test('displays tasks when loaded successfully', async () => {
    const mockTasks = [
      {
        id: 1,
        title: 'Test Task 1',
        description: 'Test Description 1',
        completed: false,
        created_at: '2023-12-01T10:00:00Z'
      },
      {
        id: 2,
        title: 'Test Task 2',
        description: 'Test Description 2',
        completed: false,
        created_at: '2023-12-01T11:00:00Z'
      }
    ];

    mockedTaskService.getTasks.mockResolvedValue({
      data: mockTasks
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
      expect(screen.getByText('Test Description 1')).toBeInTheDocument();
      expect(screen.getByText('Test Description 2')).toBeInTheDocument();
    });
  });

  test('displays empty state when no tasks', async () => {
    mockedTaskService.getTasks.mockResolvedValue({
      data: []
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('No tasks yet!')).toBeInTheDocument();
      expect(screen.getByText('Create your first task to get started.')).toBeInTheDocument();
    });
  });

  test('displays error message when API fails', async () => {
    mockedTaskService.getTasks.mockRejectedValue(new Error('API Error'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
  });
});
