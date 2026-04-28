import '@testing-library/cypress/add-commands'

export const apiUrl = 'http://localhost:8080/omstillingsstonad/skjema/api'

Cypress.Commands.add('testUniversellUtforming', () => {
    cy.injectAxe()
    cy.checkA11y()
})

Cypress.Commands.add('lastInnledning', () => {
    cy.intercept('GET', `${apiUrl}/api/sak/oms/har_sak`, {
        statusCode: 200,
        body: { harOMSSak: true },
    }).as('harSakIGjenny')

    cy.intercept('GET', `${apiUrl}/sanity?sanityQuery=*%5B_type+%3D%3D+%22meldInnEndringInnledning%22%5D`).as(
        'fellesKomponenterInnhold'
    )

    cy.intercept(
        'GET',
        `${apiUrl}/sanity?sanityQuery=*%5B_type+%3D%3D+%22skjemaHeader%22+%26%26+dokumentTittel+%3D%3D+%22meld-inn-endring%22%5D`
    ).as('skjemaHeader')

    cy.intercept('GET', `${apiUrl}/sanity?sanityQuery=*%5B_type+%3D%3D+%22behandlingAvInformasjonAccordion%22%5D`).as(
        'behandlingAvInformasjonAccordion'
    )

    cy.intercept('GET', `${apiUrl}/sanity?sanityQuery=*%5B_type+%3D%3D+%22spraakVelger%22%5D`).as('spraakVelger')

    cy.visit('http://localhost:5173/omstillingsstonad/skjema/meld-inn-endring/innledning')

    cy.wait([
        '@fellesKomponenterInnhold',
        '@harSakIGjenny',
        '@skjemaHeader',
        '@behandlingAvInformasjonAccordion',
        '@spraakVelger',
    ])
})

Cypress.Commands.add('lastMeldFraOmEndring', () => {
    cy.lastInnledning()

    cy.intercept('GET', `${apiUrl}/sanity?sanityQuery=*%5B_type+%3D%3D+%22meldInnEndringMeldFra%22%5D`).as(
        'meldInnEndringMeldFra'
    )

    cy.intercept('GET', `${apiUrl}/sanity?sanityQuery=*%5B_type+%3D%3D+%22sammendragAvSkjemaFeil%22%5D`).as(
        'sammendragAvSkjemafeil'
    )
    cy.intercept('GET', `${apiUrl}/sanity?sanityQuery=*%5B_type+%3D%3D+%22navigasjonMeny%22%5D`).as('navigasjonsMeny')

    cy.visit('http://localhost:5173/omstillingsstonad/skjema/meld-inn-endring/meld-fra-om-endring')

    cy.wait(['@meldInnEndringMeldFra', '@sammendragAvSkjemafeil', '@navigasjonsMeny'])
})

Cypress.Commands.add('lastOppsummering', () => {
    cy.intercept('POST', `${apiUrl}/api/oms/meld_inn_endringer`, { statusCode: 200 })
    cy.intercept('GET', `${apiUrl}/sanity?sanityQuery=*%5B_type+%3D%3D+%22meldInnEndringOppsummering%22%5D`).as(
        'meldInnEndringOppsummering'
    )

    cy.lastInnledning()
    cy.lastMeldFraOmEndring()
    cy.findAllByRole('radio').first().click()
    cy.findByRole('textbox').type('Endringen jeg ønsker å melde fra er på grunn av en aktivitet')

    cy.findByRole('button', { name: 'Neste steg' }).click()

    cy.wait(['@meldInnEndringOppsummering'])
})

Cypress.Commands.add('lastKvittering', () => {
    cy.intercept('GET', `${apiUrl}/sanity?sanityQuery=*%5B_type+%3D%3D+%22meldInnEndringKvittering%22%5D`).as(
        'meldInnEndringKvittering'
    )

    cy.lastOppsummering()
    cy.findByRole('button', { name: 'Send til Nav' }).click()

    cy.url().should('include', 'meld-inn-endring/kvittering')

    cy.wait(['@meldInnEndringKvittering'])
})
