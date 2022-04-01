import { basePath } from '../util/constants'

describe('Front Page', () => {
    beforeEach(() => {
        cy.intercept('GET', `${basePath}/api/person/innlogget`, { fixture: 'user' }).as('loggedInUser')
        cy.intercept('GET', `${basePath}/api/api/kladd`, '10000000').as('getApplication')
        cy.intercept('GET', `${basePath}/session`, {}).as('getExpirationTimeForLoggedInUser')

        cy.visit('http://localhost:3000/barnepensjon/soknad')

        cy.wait(['@loggedInUser', '@getApplication', '@getExpirationTimeForLoggedInUser'])
    })

    it('should require user to agree with the terms in order to continue', function () {
        cy.get('.navds-confirmation-panel').get('[type="checkbox"]').should('not.be.checked')
        cy.get('.navds-button').should('be.disabled')
    })

    it('should let the user start the application after agreeing with the terms', function () {
        cy.get('.navds-confirmation-panel').get('[type="checkbox"]').click()
        cy.get('.navds-button').should('be.enabled').click()

        cy.url().should('include', 'velg-scenarie')
    })
})
