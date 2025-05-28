describe('Messages Page', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage();
  });

  it('should login and display messages', () => {
    // Login with test credentials
    cy.login('test@email.com', 'test');

    // Check if redirected to messages page
    cy.url().should('include', '/messages');

    // Wait for messages to load
    cy.get('ul').should('exist');

    // Check for messages with specific content
    cy.contains('user2@email.com').should('exist');
    
    // Check for first message
    cy.contains('Hello').should('exist');
    
    // Check for second message
    cy.contains('World').should('exist');

  });

  it('should handle logout', () => {
    // Login first
    cy.login('test@email.com', 'test');

    // Click logout button
    cy.contains('button', 'Logout').click();

    // Should be redirected to login page
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
}); 