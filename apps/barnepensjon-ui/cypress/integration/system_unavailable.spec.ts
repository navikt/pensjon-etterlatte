import { basePath } from '../util/constants'

describe('System Unavailable', () => {
    before(() => {
        cy.intercept('GET', `${basePath}/api/person/innlogget`, { statusCode: 404 }).as('loggedInUser')
        cy.intercept('GET', `${basePath}/session`, {}).as('getExpirationTimeForLoggedInUser')

        cy.visit('http://localhost:3000/barnepensjon/soknad')

        cy.wait(['@loggedInUser', '@getExpirationTimeForLoggedInUser'])
    })

    it('should redirect you to SystemUnavailable when backend services are down', function () {
        cy.url().should('include', 'system-utilgjengelig')
        cy.get('.navds-alert__wrapper > .navds-body-long').should(
            'have.text',
            'Det er en feil i søknaden som gjør at den dessverre ikke fungerer som den skal.'
        )
    })

    it('should send you to the front page when clicking the retry button if systems are up', function () {
        cy.intercept('GET', `${basePath}/api/person/innlogget`, { fixture: 'user' }).as('loggedInUser')
        cy.intercept('GET', `${basePath}/api/api/kladd`, '10000000').as('getApplication')
        cy.intercept('GET', `${basePath}/session`, {}).as('getExpirationTimeForLoggedInUser')

        cy.get('.navds-button').should('be.enabled').should('have.text', 'Prøv igjen').click()

        cy.wait(['@loggedInUser', '@getApplication', '@getExpirationTimeForLoggedInUser'])
        cy.url().should('not.include', 'system-utilgjengelig')
    })
})
