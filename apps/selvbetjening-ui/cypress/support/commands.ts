import '@testing-library/cypress/add-commands'

const apiUrl = 'http://localhost:8080/selvbetjening/api'

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

Cypress.Commands.add('lastInntektsjusteringInntektTilNesteAar', () => {
    cy.intercept('GET', `${apiUrl}/sanity?` + new URLSearchParams(`sanityQuery=*[_type == "fellesKomponenter"]`), {
        fixture: 'fellesKomponenterInnhold',
    }).as('fellesKomponenterInnhold')
    cy.intercept(
        'GET',
        `${apiUrl}/sanity?` + new URLSearchParams(`sanityQuery=*[_type == "inntektsjusteringInntektTilNesteAar"]`),
        { fixture: 'inntektsjusteringInntektTilNesteAar' }
    ).as('inntektsjusteringInntektTilNesteAarInnhold')

    cy.visit('http://localhost:5173/selvbetjening/inntektsjustering/inntekt-til-neste-aar')

    cy.wait(['@fellesKomponenterInnhold', '@inntektsjusteringInntektTilNesteAarInnhold'])
})
