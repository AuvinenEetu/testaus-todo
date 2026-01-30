describe('Todo app', () => {
  beforeEach(() => {
    cy.visit('/');
    // Clear localStorage before each test for isolation
    cy.clearLocalStorage();
  });

  it('creates a new task and displays it in the list', () => {
    // Fill in the form
    cy.get('#topic').type('Testitaski').should('have.value', 'Testitaski');
    cy.get('#description')
      .type('Testitaskin kuvaus')
      .should('have.value', 'Testitaskin kuvaus');

    // Submit the form
    cy.get('#save-btn').click();

    // Verify the task appears in the list
    cy.get('#task-list').should('be.visible');
    cy.get('#task-list .task').should('have.length', 1);

    // Check the task contains correct content
    cy.get('#task-list .task')
      .first()
      .within(() => {
        cy.get('.title').should('contain', 'Testitaski');
        cy.get('.desc').should('contain', 'Testitaskin kuvaus');
      });

    // Verify empty state is hidden
    cy.get('#empty-state').should('not.be.visible');

    // Verify task is persisted in localStorage
    cy.window().then((win) => {
      const tasks = JSON.parse(win.localStorage.getItem('todo_tasks_v1'));
      expect(tasks).to.have.length(1);
      expect(tasks[0].topic).to.equal('Testitaski');
      expect(tasks[0].description).to.equal('Testitaskin kuvaus');
      expect(tasks[0].priority).to.equal('medium'); // default value
      expect(tasks[0].status).to.equal('todo'); // default value
      expect(tasks[0].completed).to.be.false;
    });
  });

  it('checks the fields for text after adding a task and verifies they are empty', () => {
    // Fill in the form
    cy.get('#topic').type('Testitaski').should('have.value', 'Testitaski');
    cy.get('#description')
      .type('Testitaskin kuvaus')
      .should('have.value', 'Testitaskin kuvaus');
    // Submit the form
    cy.get('#save-btn').click();
    cy.get('#topic').should('be.empty');
    cy.get('#description').should('be.empty');
  });

  it('edits a tasks topic, description, priority, status, marks the task as complete and verifies the changes were saved', () => {
    // Fill in the form
    cy.get('#topic').type('Testitaski').should('have.value', 'Testitaski');
    cy.get('#description')
      .type('Testitaskin kuvaus')
      .should('have.value', 'Testitaskin kuvaus');
    // Submit the form
    cy.get('#save-btn').click();
    // Edit the task
    cy.get('.controls > .secondary').click();
    cy.get('#topic').should('have.value', 'Testitaski').type(' 2');
    cy.get('#description')
      .should('have.value', 'Testitaskin kuvaus')
      .type(' editoinnin jälkeen');
    cy.get('#priority').select('High');
    cy.get('#status').select('In progress');
    // submit the edits
    cy.get('#save-btn').should('have.text', 'Update Task').click();
    cy.get('#topic').should('be.empty');
    cy.get('#description').should('be.empty');
    // marks the task as complete
    cy.get('[data-action="complete"]').click();
    // verifies that the task is correctly displayed in the tasks list
    cy.window().then((win) => {
      const tasks = JSON.parse(win.localStorage.getItem('todo_tasks_v1'));
      expect(tasks).to.have.length(1);
      expect(tasks[0].topic).to.equal('Testitaski 2');
      expect(tasks[0].description).to.equal(
        'Testitaskin kuvaus editoinnin jälkeen',
      );
      expect(tasks[0].priority).to.equal('high'); // default value
      expect(tasks[0].status).to.equal('done'); // default value
      expect(tasks[0].completed).to.be.true;
    });
  });

  it('verifies the forms reset button works', () => {
    // Fill in the form
    cy.get('#topic').type('Testitaski').should('have.value', 'Testitaski');
    cy.get('#description')
      .type('Testitaskin kuvaus')
      .should('have.value', 'Testitaskin kuvaus');
    cy.get('#priority').select('High');
    cy.get('#status').select('In progress');
    // reset the form
    cy.get('#reset-btn').click();
    // verify that the form is empty
    cy.get('#topic').should('be.empty');
    cy.get('#description').should('be.empty');
    cy.get('#priority').should('have.value', 'medium');
    cy.get('#status').should('have.value', 'todo');
  });

  it('deletes a task and verifies it is removed', () => {
    // First, create a task
    cy.get('#topic').type('Poistettava taski');
    cy.get('#description').type('Tämä poistetaan');
    cy.get('#save-btn').click();

    // Verify task was created
    cy.get('#task-list .task').should('have.length', 1);
    cy.get('#task-list .task .title').should('contain', 'Poistettava taski');

    // Delete the task
    cy.get('#task-list .task')
      .first()
      .within(() => {
        cy.get('button[data-action="delete"]').click();
      });

    // Verify task is removed from the list
    cy.get('#task-list .task').should('have.length', 0);

    // Verify empty state is displayed
    cy.get('#empty-state').should('be.visible');

    // Verify task is removed from localStorage
    cy.window().then((win) => {
      const tasks = JSON.parse(win.localStorage.getItem('todo_tasks_v1'));
      expect(tasks).to.have.length(0);
    });
  });
  it('tests the priority filtering feature and verifies all the options work', () => {
    // create three tasks
    // first task
    cy.get('#topic').type('Poistettava taski');
    cy.get('#description').type('Tämä poistetaan');
    cy.get('#priority').select('High');
    cy.get('#save-btn').click();
    // second task
    cy.get('#topic').type('Poistettava taski numero 2');
    cy.get('#description').type('Tämä poistetaan myös');
    cy.get('#priority').select('Low');
    cy.get('#save-btn').click();
    // third task
    cy.get('#topic').type('Poistettava taski numero 3');
    cy.get('#description').type('Tämä poistetaan myös');
    cy.get('#priority').select('Medium');
    cy.get('#save-btn').click();
    // Verify tasks were created
    cy.get('#task-list .task').should('have.length', 3);
    // select priority high and verify that only 1 task is showing
    cy.get('.high').click();
    cy.get('#task-list .task').should('have.length', 1);
    // select priority low and verify that only 1 task is showing
    cy.get('.low').click();
    cy.get('#task-list .task').should('have.length', 1);
    // select priority medium and verify that only 1 task is showing
    cy.get('.medium').click();
    cy.get('#task-list .task').should('have.length', 1);
    // select All priorities and verify all tasks are showing
    cy.get('.all').click();
    cy.get('#task-list .task').should('have.length', 3);
  });
});
