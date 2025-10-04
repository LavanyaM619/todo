const { Pool } = require('pg');

// Test database configuration
const testPool = new Pool({
  connectionString: process.env.TEST_DATABASE_URL || 'postgresql://todoapp:todoapp123@localhost:5432/todoapp_test',
  ssl: false
});

// Clean up test database before each test
beforeEach(async () => {
  await testPool.query('DELETE FROM task');
});

// Close connection after all tests
afterAll(async () => {
  await testPool.end();
});

module.exports = testPool;
