import { basePath, getById } from '../util/cy-functions'

describe('Fortsetter og sletter kladd', () => {
    it('Gå til søknad med eksisterende kladd', () => {
        cy.intercept('POST', `${basePath}/api/feature`, { fixture: 'featureToggles' }).as('hentFeatureToggles')
        cy.intercept('GET', `${basePath}/api/person/innlogget?soeknadType=OMSTILLINGSSTOENAD`, {
            fixture: 'testbruker',
        }).as('hentInnloggetPerson')
        cy.intercept('GET', `${basePath}/api/api/kladd`, { fixture: 'kladd' }).as('hentSoeknad')
        cy.visit('localhost:5173/utvidet-omstillingsstonad/soknad', {
            onBeforeLoad: (obj) => {
                Object.defineProperty(obj.navigator, 'language', { value: 'nb-NO' })
            },
        })
        cy.injectAxe()
        cy.wait(['@hentFeatureToggles'])
        cy.wait(['@hentInnloggetPerson'])
        cy.wait(['@hentSoeknad'])

        cy.get('h1').contains('påbegynt søknad?')
    })

    it('Fortsett søknad skal åpne det tomme søknadsskjemaet', () => {
        getById('fortsett_soeknad').click()
        cy.url().should('include', 'skjema/steg')
    })

    it('Start på nytt skal sende deg til startsiden og slette state', () => {
        cy.intercept('GET', `${basePath}/api/person/innlogget?soeknadType=OMSTILLINGSSTOENAD`, {
            fixture: 'testbruker',
        }).as('hentInnloggetPerson')
        cy.intercept('GET', `${basePath}/api/api/kladd`, { fixture: 'kladd' }).as('hentSoeknad')
        cy.intercept('DELETE', `${basePath}/api/api/kladd`, {}).as('slettSoeknad')

        cy.reload()

        getById('start_paa_nytt').click()
        cy.get(':checkbox').should('not.be.checked')
    })
})
