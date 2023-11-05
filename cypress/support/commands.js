Cypress.Commands.add('filMandatoryFieldsAndSubmit', function(){
    cy.get('#firstName').type('Bruno')
    cy.get('#lastName').type('Nogueira Andrade')
    cy.get('#email').type('dincson@gmail.com')
    cy.get('#open-text-area').type('teste')
    cy.contains('button', 'Enviar').click()
})