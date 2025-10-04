const request = require('supertest');
const app = require('../../server');
const testPool = require('../setup');

describe('Task Controller', () => {
  beforeEach(async () => {
    await testPool.query('DELETE FROM task');
  });

  describe('GET /api/tasks', () => {
    it('should return empty array when no tasks exist', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it('should return incomplete tasks only', async () => {
      // Create some test data
      await testPool.query(
        'INSERT INTO task (title, description, completed) VALUES ($1, $2, $3)',
        ['Incomplete Task', 'Description', false]
      );
      await testPool.query(
        'INSERT INTO task (title, description, completed) VALUES ($1, $2, $3)',
        ['Completed Task', 'Description', true]
      );

      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toBe('Incomplete Task');
      expect(response.body.data[0].completed).toBe(false);
    });

    it('should return at most 5 tasks', async () => {
      // Create 7 incomplete tasks
      for (let i = 1; i <= 7; i++) {
        await testPool.query(
          'INSERT INTO task (title, description, completed) VALUES ($1, $2, $3)',
          [`Task ${i}`, `Description ${i}`, false]
        );
      }

      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(5);
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task with valid data', async () => {
      const taskData = {
        title: 'New Task',
        description: 'New Description'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(taskData.title);
      expect(response.body.data.description).toBe(taskData.description);
      expect(response.body.data.completed).toBe(false);
      expect(response.body.message).toBe('Task created successfully');
    });

    it('should create a task without description', async () => {
      const taskData = {
        title: 'New Task'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(taskData.title);
      expect(response.body.data.description).toBe('');
    });

    it('should return 400 for missing title', async () => {
      const taskData = {
        description: 'Description without title'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
      expect(response.body.errors).toBeDefined();
    });

    it('should return 400 for title too long', async () => {
      const taskData = {
        title: 'a'.repeat(256), // Exceeds 255 character limit
        description: 'Description'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('should return 400 for description too long', async () => {
      const taskData = {
        title: 'Valid Title',
        description: 'a'.repeat(1001) // Exceeds 1000 character limit
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });
  });

  describe('PUT /api/tasks/:id/complete', () => {
    it('should mark a task as completed', async () => {
      // Create a task
      const result = await testPool.query(
        'INSERT INTO task (title, description, completed) VALUES ($1, $2, $3) RETURNING id',
        ['Test Task', 'Test Description', false]
      );
      const taskId = result.rows[0].id;

      const response = await request(app)
        .put(`/api/tasks/${taskId}/complete`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.completed).toBe(true);
      expect(response.body.message).toBe('Task marked as completed');
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .put('/api/tasks/999/complete')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found or already completed');
    });

    it('should return 404 for already completed task', async () => {
      // Create a completed task
      const result = await testPool.query(
        'INSERT INTO task (title, description, completed) VALUES ($1, $2, $3) RETURNING id',
        ['Completed Task', 'Description', true]
      );
      const taskId = result.rows[0].id;

      const response = await request(app)
        .put(`/api/tasks/${taskId}/complete`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found or already completed');
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return a specific task', async () => {
      // Create a task
      const result = await testPool.query(
        'INSERT INTO task (title, description, completed) VALUES ($1, $2, $3) RETURNING *',
        ['Test Task', 'Test Description', false]
      );
      const task = result.rows[0];

      const response = await request(app)
        .get(`/api/tasks/${task.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(task.id);
      expect(response.body.data.title).toBe(task.title);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .get('/api/tasks/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found');
    });
  });
});
