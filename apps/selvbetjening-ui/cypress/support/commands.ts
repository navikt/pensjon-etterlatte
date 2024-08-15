import '@testing-library/cypress/add-commands'

Cypress.Commands.add('startInntektsjustering', (userFixure: string) => {
    cy.visit('http://localhost:5173/selvbetjening/inntektsjustering')
    cy.intercept('GET', '/api/person/innlogget', { fixture: userFixure }).as('brukerLoggetInn')

    cy.wait(['@brukerLoggetInn'])
})
