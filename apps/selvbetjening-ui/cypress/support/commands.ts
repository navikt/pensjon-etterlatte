import '@testing-library/cypress/add-commands'

const apiUrl = 'http://localhost:8080/selvbetjening/api'

// Cypress.Commands.add('startInntektsjustering', (userFixure: string) => {
//     cy.visit('http://localhost:5173/selvbetjening/inntektsjustering')
//     cy.intercept('GET', '/api/person/innlogget', { fixture: userFixure }).as('brukerLoggetInn')
//
//     cy.wait(['@brukerLoggetInn'])
// })

Cypress.Commands.add('lastInntektsjusteringInnledning', () => {
    cy.intercept('GET', `${apiUrl}/sanity?` + new URLSearchParams(`sanityQuery=*[_type == "fellesKomponenter"]`), {
        fixture: 'fellesKomponenterInnhold',
    }).as('fellesKomponenterInnhold')
    cy.intercept(
        'GET',
        `${apiUrl}/sanity?` + new URLSearchParams(`sanityQuery=*[_type == "inntektsjusteringInnledning"]`),
        { fixture: 'inntektsjusteringInnledningInnhold' }
    ).as('inntektsjusteringInnledningInnhold')

    cy.visit('http://localhost:5173/selvbetjening/inntektsjustering/innledning')

    cy.wait(['@fellesKomponenterInnhold', '@inntektsjusteringInnledningInnhold'])
})
