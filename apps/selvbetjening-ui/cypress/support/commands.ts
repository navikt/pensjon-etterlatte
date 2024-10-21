import '@testing-library/cypress/add-commands'

const apiUrl = 'http://localhost:8080/selvbetjening/api'

Cypress.Commands.add('testUniversellUtforming', () => {
    cy.injectAxe()
    cy.checkA11y()
})

Cypress.Commands.add('lastInntektsjusteringInnledning', () => {
    cy.intercept('GET', `${apiUrl}/sanity?` + new URLSearchParams(`sanityQuery=*[_type == "fellesKomponenter"]`), {
        fixture: 'fellesKomponenterInnhold',
    }).as('fellesKomponenterInnhold')
    cy.intercept('GET', `${apiUrl}/api/person/innlogget/forenklet`, { fixture: 'innloggetInnbygger' }).as(
        'innloggetInnbygger'
    )
    cy.intercept(
        'GET',
        `${apiUrl}/sanity?` + new URLSearchParams(`sanityQuery=*[_type == "inntektsjusteringInnledning"]`),
        { fixture: 'inntektsjusteringInnledningInnhold' }
    ).as('inntektsjusteringInnledningInnhold')

    cy.visit('http://localhost:5173/selvbetjening/inntektsjustering/innledning')

    cy.wait(['@fellesKomponenterInnhold', '@innloggetInnbygger', '@inntektsjusteringInnledningInnhold'])
})

Cypress.Commands.add('lastInntektsjusteringInntektTilNesteAar', () => {
    cy.intercept('GET', `${apiUrl}/sanity?` + new URLSearchParams(`sanityQuery=*[_type == "fellesKomponenter"]`), {
        fixture: 'fellesKomponenterInnhold',
    }).as('fellesKomponenterInnhold')
    cy.intercept('GET', `${apiUrl}/api/person/innlogget/forenklet`, { fixture: 'innloggetInnbygger' }).as(
        'innloggetInnbygger'
    )
    cy.intercept(
        'GET',
        `${apiUrl}/sanity?` + new URLSearchParams(`sanityQuery=*[_type == "inntektsjusteringInntektTilNesteAar"]`),
        { fixture: 'inntektsjusteringInntektTilNesteAarInnhold' }
    ).as('inntektsjusteringInntektTilNesteAarInnhold')

    cy.visit('http://localhost:5173/selvbetjening/inntektsjustering/inntekt-til-neste-aar')

    cy.wait(['@fellesKomponenterInnhold', '@innloggetInnbygger', '@inntektsjusteringInntektTilNesteAarInnhold'])
})

Cypress.Commands.add('lastInntetktsjusteringOppsummering', () => {
    cy.lastInntektsjusteringInntektTilNesteAar()

    cy.findByRole('radio', { name: 'Nei' }).click()
    cy.findByRole('button', { name: 'Neste steg' }).click()

    cy.intercept('GET', `${apiUrl}/sanity?` + new URLSearchParams(`sanityQuery=*[_type == "fellesKomponenter"]`), {
        fixture: 'fellesKomponenterInnhold',
    }).as('fellesKomponenterInnhold')
    cy.intercept('GET', `${apiUrl}/api/person/innlogget/forenklet`, { fixture: 'innloggetInnbygger' }).as(
        'innloggetInnbygger'
    )
    cy.intercept(
        'GET',
        `${apiUrl}/sanity?` + new URLSearchParams(`sanityQuery=*[_type == "inntektsjusteringOppsummering"]`),
        { fixture: 'inntektsjusteringOppsummeringInnhold' }
    ).as('inntektsjusteringOppsummeringInnhold')

    cy.visit('http://localhost:5173/selvbetjening/inntektsjustering/oppsummering')

    cy.wait(['@fellesKomponenterInnhold', '@innloggetInnbygger', '@inntektsjusteringOppsummeringInnhold'])
})

Cypress.Commands.add('lastInntektsjusteringKvittering', () => {
    cy.intercept('GET', `${apiUrl}/sanity?` + new URLSearchParams(`sanityQuery=*[_type == "fellesKomponenter"]`), {
        fixture: 'fellesKomponenterInnhold',
    }).as('fellesKomponenterInnhold')
    cy.intercept(
        'GET',
        `${apiUrl}/sanity?` + new URLSearchParams(`sanityQuery=*[_type == "inntektsjusteringKvittering"]`),
        { fixture: 'inntektsjusteringKvitteringInnhold' }
    ).as('inntektsjusteringKvitteringInnhold')

    cy.visit('http://localhost:5173/selvbetjening/inntektsjustering/kvittering')

    cy.wait(['@fellesKomponenterInnhold', '@inntektsjusteringKvitteringInnhold'])
})
