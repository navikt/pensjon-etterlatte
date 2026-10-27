import { basePath, getById } from '../util/cy-functions'

describe('Utvidet omstillingsstønad', () => {
    it('starter en tom søknad og lagrer samtykke som kladd', () => {
        cy.intercept('POST', `${basePath}/api/feature`, { fixture: 'featureToggles' }).as('hentFeatureToggles')
        cy.intercept('GET', `${basePath}/api/person/innlogget?soeknadType=OMSTILLINGSSTOENAD`, {
            fixture: 'testbruker',
        }).as('hentInnloggetPerson')
        cy.intercept('GET', `${basePath}/api/api/kladd`, {}).as('hentSoeknad')
        cy.intercept('POST', `${basePath}/api/api/kladd`, {}).as('lagreSoeknad')
        cy.intercept('GET', `${basePath}/api/api/sak/oms/har_sak`, { harOMSSak: true }).as(
            'hentOmsSakStatus'
        )

        cy.visit('localhost:5173/utvidet-omstillingsstonad/soknad', {
            onBeforeLoad: (obj) => {
                Object.defineProperty(obj.navigator, 'language', { value: 'nb-NO' })
            },
        })

        cy.wait(['@hentFeatureToggles', '@hentInnloggetPerson', '@hentSoeknad', '@hentOmsSakStatus'])
        cy.get('[type="checkbox"]').check({ force: true })
        getById('start-soeknad').click()
        cy.wait('@lagreSoeknad').its('request.body.harSamtykket').should('eq', true)

        cy.url().should('include', '/skjema/steg/personopplysninger')
        getById('avbryt-btn').should('be.visible')
        cy.get('h2').contains('Personopplysninger').should('be.visible')
        getById('navigasjon-neste').should('be.visible').click()
        cy.wait('@lagreSoeknad').its('request.body.aktivtSteg').should('eq', 'situasjonen-din')
        cy.url().should('include', '/skjema/steg/situasjonen-din')
    })
})
