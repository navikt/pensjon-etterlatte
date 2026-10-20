import { basePath, getById } from '../util/cy-functions'

describe('Utvidet omstillingsstønad', () => {
    it('starter en tom søknad og lagrer samtykke som kladd', () => {
        cy.intercept('POST', `${basePath}/api/feature`, { fixture: 'featureToggles' }).as('hentFeatureToggles')
        cy.intercept('GET', `${basePath}/api/person/innlogget?soeknadType=OMSTILLINGSSTOENAD`, {
            fixture: 'testbruker',
        }).as('hentInnloggetPerson')
        cy.intercept('GET', `${basePath}/api/api/kladd`, {}).as('hentSoeknad')
        cy.intercept('POST', `${basePath}/api/api/kladd`, {}).as('lagreSoeknad')
        cy.intercept('GET', `${basePath}/api/api/sak/oms/har-loepende-sak`, { harOMSSak: false }).as('hentLoependeSak')

        cy.visit('localhost:5173/utvidet-omstillingsstonad/soknad', {
            onBeforeLoad: (obj) => {
                Object.defineProperty(obj.navigator, 'language', { value: 'nb-NO' })
            },
        })

        cy.wait(['@hentFeatureToggles', '@hentInnloggetPerson', '@hentSoeknad', '@hentLoependeSak'])
        cy.get('[type="checkbox"]').check({ force: true })
        cy.wait('@lagreSoeknad')
        getById('start-soeknad').click()

        cy.url().should('include', '/skjema/steg')
        getById('avbryt-btn').should('be.visible')
        cy.contains('Personopplysninger').should('not.exist')
        cy.contains('Neste steg').should('not.exist')
    })
})
