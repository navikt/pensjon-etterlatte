import '@testing-library/cypress/add-commands'

Cypress.Commands.add('startInntektsjustering', (userFixure: string) => {
    cy.intercept('GET', '/selvbetjening/api/api/person/innlogget', { fixture: userFixure }).as('brukerLoggetInn')

    cy.visit('http://localhost:5173/selvbetjening/inntektsjustering')

    cy.wait(['@brukerLoggetInn'])
})
