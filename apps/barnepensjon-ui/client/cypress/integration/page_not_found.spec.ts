import { basePath } from '../util/constants'

describe('Page Not Found', () => {
    before(() => {
        cy.intercept('GET', `${basePath}/api/person/innlogget`, { fixture: 'user' }).as('loggedInUser')
        cy.intercept('GET', `${basePath}/api/api/kladd`, '10000000').as('getApplication')
        cy.intercept('GET', `${basePath}/session`, {}).as('getExpirationTimeForLoggedInUser')

        cy.visit('http://localhost:3000/barnepensjon/soknad/side-som-ikke-finnes')

        cy.wait(['@loggedInUser', '@getApplication', '@getExpirationTimeForLoggedInUser'])
    })

    it('should redirect you to PageNotFound when path is invalid', function () {
        cy.contains('Denne siden finnes ikke.')
        cy.get('.navds-button').should('have.text', 'Tilbake').should('be.enabled')
    })
})
