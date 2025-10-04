import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskCard from './TaskCard';

describe('TaskCard Component', () => {
  const mockTask = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    created_at: '2023-12-01T10:00:00Z'
  };

  const mockOnTaskCompleted = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders task information', () => {
    render(
      <TaskCard 
        task={mockTask}
        onTaskCompleted={mockOnTaskCompleted}
        loading={false}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText(/Created:/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument();
  });

  test('renders task without description', () => {
    const taskWithoutDescription = {
      ...mockTask,
      description: ''
    };

    render(
      <TaskCard 
        task={taskWithoutDescription}
        onTaskCompleted={mockOnTaskCompleted}
        loading={false}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  test('calls onTaskCompleted when Done button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <TaskCard 
        task={mockTask}
        onTaskCompleted={mockOnTaskCompleted}
        loading={false}
      />
    );

    const doneButton = screen.getByRole('button', { name: 'Done' });
    await user.click(doneButton);

    expect(mockOnTaskCompleted).toHaveBeenCalledWith(mockTask.id);
  });

  test('disables Done button when loading', () => {
    render(
      <TaskCard 
        task={mockTask}
        onTaskCompleted={mockOnTaskCompleted}
        loading={true}
      />
    );

    expect(screen.getByRole('button', { name: 'Completing...' })).toBeDisabled();
  });

  test('does not call onTaskCompleted when loading', async () => {
    const user = userEvent.setup();
    
    render(
      <TaskCard 
        task={mockTask}
        onTaskCompleted={mockOnTaskCompleted}
        loading={true}
      />
    );

    const doneButton = screen.getByRole('button', { name: 'Completing...' });
    await user.click(doneButton);

    expect(mockOnTaskCompleted).not.toHaveBeenCalled();
  });

  test('formats date correctly', () => {
    render(
      <TaskCard 
        task={mockTask}
        onTaskCompleted={mockOnTaskCompleted}
        loading={false}
      />
    );

    // Check if the formatted date contains expected parts
    expect(screen.getByText(/Dec 1, 2023/)).toBeInTheDocument();
  });
});
