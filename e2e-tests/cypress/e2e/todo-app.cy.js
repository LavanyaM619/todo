describe('Todo App E2E Tests', () => {
  beforeEach(() => {
    // Visit the app before each test
    cy.visit('/');
  });

  it('should display the main page elements', () => {
    // Check if main elements are visible
    cy.contains('Todo App').should('be.visible');
    cy.contains('Manage your tasks efficiently').should('be.visible');
    cy.contains('Create New Task').should('be.visible');
  });

  it('should create a new task successfully', () => {
    // Fill in the task form
    cy.get('input[name="title"]').type('E2E Test Task');
    cy.get('textarea[name="description"]').type('This is an end-to-end test task');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Check if success message appears
    cy.contains('Task created successfully!').should('be.visible');
    
    // Check if the task appears in the list
    cy.contains('E2E Test Task').should('be.visible');
    cy.contains('This is an end-to-end test task').should('be.visible');
  });

  it('should validate required title field', () => {
    // Try to submit form without title
    cy.get('button[type="submit"]').click();
    
    // Check if error message appears
    cy.contains('Title is required').should('be.visible');
  });

  it('should complete a task successfully', () => {
    // First create a task
    cy.get('input[name="title"]').type('Task to Complete');
    cy.get('textarea[name="description"]').type('This task will be completed');
    cy.get('button[type="submit"]').click();
    
    // Wait for task to appear
    cy.contains('Task to Complete').should('be.visible');
    
    // Click the Done button
    cy.contains('Done').click();
    
    // Check if success message appears
    cy.contains('Task completed successfully!').should('be.visible');
    
    // Check if task disappears from the list
    cy.contains('Task to Complete').should('not.exist');
  });

  it('should handle API errors gracefully', () => {
    // Mock API error
    cy.intercept('POST', '/api/tasks', {
      statusCode: 500,
      body: { message: 'Internal server error' }
    }).as('createTaskError');
    
    // Try to create a task
    cy.get('input[name="title"]').type('Error Test Task');
    cy.get('button[type="submit"]').click();
    
    // Check if error message appears
    cy.contains('Failed to create task').should('be.visible');
  });

  it('should display empty state when no tasks exist', () => {
    // Mock empty response
    cy.intercept('GET', '/api/tasks', {
      statusCode: 200,
      body: { success: true, data: [] }
    }).as('getEmptyTasks');
    
    // Reload the page
    cy.reload();
    
    // Check if empty state is displayed
    cy.contains('No tasks yet!').should('be.visible');
    cy.contains('Create your first task to get started.').should('be.visible');
  });

  it('should be responsive on mobile devices', () => {
    // Set mobile viewport
    cy.viewport(375, 667);
    
    // Check if elements are still visible and properly styled
    cy.contains('Todo App').should('be.visible');
    cy.get('input[name="title"]').should('be.visible');
    cy.get('textarea[name="description"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should show loading states during operations', () => {
    // Mock slow API response
    cy.intercept('POST', '/api/tasks', (req) => {
      req.reply((res) => {
        res.delay(1000);
      });
    }).as('slowCreateTask');
    
    // Create a task
    cy.get('input[name="title"]').type('Loading Test Task');
    cy.get('button[type="submit"]').click();
    
    // Check if loading state is shown
    cy.contains('Creating...').should('be.visible');
    cy.get('button[type="submit"]').should('be.disabled');
  });
});
