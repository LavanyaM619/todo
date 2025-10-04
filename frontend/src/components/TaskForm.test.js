import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from './TaskForm';
import { taskService } from '../services/api';

// Mock the API service
jest.mock('../services/api');
const mockedTaskService = taskService;

describe('TaskForm Component', () => {
  const mockOnTaskCreated = jest.fn();
  const mockSetLoading = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form elements', () => {
    render(
      <TaskForm 
        onTaskCreated={mockOnTaskCreated}
        loading={false}
        setLoading={mockSetLoading}
      />
    );

    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.getByLabelText('Task Title *')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Task' })).toBeInTheDocument();
  });

  test('handles form input changes', async () => {
    const user = userEvent.setup();
    
    render(
      <TaskForm 
        onTaskCreated={mockOnTaskCreated}
        loading={false}
        setLoading={mockSetLoading}
      />
    );

    const titleInput = screen.getByLabelText('Task Title *');
    const descriptionInput = screen.getByLabelText('Description');

    await user.type(titleInput, 'Test Task');
    await user.type(descriptionInput, 'Test Description');

    expect(titleInput).toHaveValue('Test Task');
    expect(descriptionInput).toHaveValue('Test Description');
  });

  test('validates required title field', async () => {
    const user = userEvent.setup();
    
    render(
      <TaskForm 
        onTaskCreated={mockOnTaskCreated}
        loading={false}
        setLoading={mockSetLoading}
      />
    );

    const submitButton = screen.getByRole('button', { name: 'Create Task' });
    await user.click(submitButton);

    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(mockOnTaskCreated).not.toHaveBeenCalled();
  });

  test('submits form with valid data', async () => {
    const user = userEvent.setup();
    
    mockedTaskService.createTask.mockResolvedValue({
      data: { id: 1, title: 'Test Task', description: 'Test Description' }
    });

    render(
      <TaskForm 
        onTaskCreated={mockOnTaskCreated}
        loading={false}
        setLoading={mockSetLoading}
      />
    );

    const titleInput = screen.getByLabelText('Task Title *');
    const descriptionInput = screen.getByLabelText('Description');
    const submitButton = screen.getByRole('button', { name: 'Create Task' });

    await user.type(titleInput, 'Test Task');
    await user.type(descriptionInput, 'Test Description');
    await user.click(submitButton);

    expect(mockSetLoading).toHaveBeenCalledWith(true);
    expect(mockedTaskService.createTask).toHaveBeenCalledWith({
      title: 'Test Task',
      description: 'Test Description'
    });

    await waitFor(() => {
      expect(mockOnTaskCreated).toHaveBeenCalled();
    });
  });

  test('handles API error on submit', async () => {
    const user = userEvent.setup();
    
    mockedTaskService.createTask.mockRejectedValue(new Error('API Error'));

    render(
      <TaskForm 
        onTaskCreated={mockOnTaskCreated}
        loading={false}
        setLoading={mockSetLoading}
      />
    );

    const titleInput = screen.getByLabelText('Task Title *');
    const submitButton = screen.getByRole('button', { name: 'Create Task' });

    await user.type(titleInput, 'Test Task');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });

    expect(mockOnTaskCreated).not.toHaveBeenCalled();
  });

  test('disables form when loading', () => {
    render(
      <TaskForm 
        onTaskCreated={mockOnTaskCreated}
        loading={true}
        setLoading={mockSetLoading}
      />
    );

    expect(screen.getByLabelText('Task Title *')).toBeDisabled();
    expect(screen.getByLabelText('Description')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Creating...' })).toBeDisabled();
  });

  test('clears error when user starts typing', async () => {
    const user = userEvent.setup();
    
    mockedTaskService.createTask.mockRejectedValue(new Error('API Error'));

    render(
      <TaskForm 
        onTaskCreated={mockOnTaskCreated}
        loading={false}
        setLoading={mockSetLoading}
      />
    );

    const titleInput = screen.getByLabelText('Task Title *');
    const submitButton = screen.getByRole('button', { name: 'Create Task' });

    // Trigger error
    await user.type(titleInput, 'Test Task');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });

    // Clear error by typing
    await user.clear(titleInput);
    await user.type(titleInput, 'New Task');

    expect(screen.queryByText('API Error')).not.toBeInTheDocument();
  });
});
