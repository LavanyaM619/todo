const Task = require('../../models/Task');
const testPool = require('../setup');

describe('Task Model', () => {
  beforeEach(async () => {
    await testPool.query('DELETE FROM task');
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const title = 'Test Task';
      const description = 'Test Description';
      
      const task = await Task.create(title, description);
      
      expect(task).toBeDefined();
      expect(task.title).toBe(title);
      expect(task.description).toBe(description);
      expect(task.completed).toBe(false);
      expect(task.id).toBeDefined();
    });

    it('should create a task with empty description', async () => {
      const title = 'Test Task';
      
      const task = await Task.create(title, '');
      
      expect(task.title).toBe(title);
      expect(task.description).toBe('');
      expect(task.completed).toBe(false);
    });
  });

  describe('findAllIncomplete', () => {
    it('should return only incomplete tasks', async () => {
      // Create some tasks
      await Task.create('Task 1', 'Description 1');
      await Task.create('Task 2', 'Description 2');
      const completedTask = await Task.create('Task 3', 'Description 3');
      await Task.markAsCompleted(completedTask.id);

      const tasks = await Task.findAllIncomplete();
      
      expect(tasks).toHaveLength(2);
      expect(tasks.every(task => !task.completed)).toBe(true);
    });

    it('should return tasks ordered by created_at DESC', async () => {
      const task1 = await Task.create('Task 1', 'Description 1');
      await new Promise(resolve => setTimeout(resolve, 10)); // Small delay
      const task2 = await Task.create('Task 2', 'Description 2');

      const tasks = await Task.findAllIncomplete();
      
      expect(tasks[0].id).toBe(task2.id);
      expect(tasks[1].id).toBe(task1.id);
    });

    it('should respect limit parameter', async () => {
      // Create 7 tasks
      for (let i = 1; i <= 7; i++) {
        await Task.create(`Task ${i}`, `Description ${i}`);
      }

      const tasks = await Task.findAllIncomplete(3);
      
      expect(tasks).toHaveLength(3);
    });
  });

  describe('markAsCompleted', () => {
    it('should mark a task as completed', async () => {
      const task = await Task.create('Test Task', 'Test Description');
      
      const completedTask = await Task.markAsCompleted(task.id);
      
      expect(completedTask).toBeDefined();
      expect(completedTask.completed).toBe(true);
      expect(completedTask.id).toBe(task.id);
    });

    it('should return null for non-existent task', async () => {
      const result = await Task.markAsCompleted(999);
      
      expect(result).toBeUndefined();
    });

    it('should return null for already completed task', async () => {
      const task = await Task.create('Test Task', 'Test Description');
      await Task.markAsCompleted(task.id);
      
      const result = await Task.markAsCompleted(task.id);
      
      expect(result).toBeUndefined();
    });
  });

  describe('findById', () => {
    it('should find a task by id', async () => {
      const task = await Task.create('Test Task', 'Test Description');
      
      const foundTask = await Task.findById(task.id);
      
      expect(foundTask).toBeDefined();
      expect(foundTask.id).toBe(task.id);
      expect(foundTask.title).toBe(task.title);
    });

    it('should return undefined for non-existent task', async () => {
      const result = await Task.findById(999);
      
      expect(result).toBeUndefined();
    });
  });
});
