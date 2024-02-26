import { basePath, Button } from '../util/constants'

describe('System Unavailable', { testIsolation: false }, () => {
    before(() => {
        cy.intercept('GET', `${basePath}/api/person/innlogget`, { statusCode: 404 }).as('loggedInUser')

        cy.visit('http://localhost:3000/barnepensjon/soknad')

        cy.wait(['@loggedInUser'])
    })

    it('should redirect you to SystemUnavailable when backend services are down', function () {
        cy.url().should('include', 'system-utilgjengelig')
        cy.get('.navds-box').should('have.text', 'Har mistet noen i nær familie')
    })

    it('should send you to the front page when clicking the retry button if systems are up', function () {
        cy.intercept('GET', `${basePath}/api/person/innlogget`, { fixture: 'user' }).as('loggedInUser')
        cy.intercept('GET', `${basePath}/api/api/kladd`, '10000000').as('getApplication')

        cy.clickBtn(Button.TryAgain)
        cy.on('uncaught:exception', () => false)

        cy.wait(['@loggedInUser', '@getApplication'])
        cy.url().should('not.include', 'system-utilgjengelig')
    })
})
