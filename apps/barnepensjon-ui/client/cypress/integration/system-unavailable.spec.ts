import { basePath } from '../util/constants'

describe('System unavailable', () => {
    beforeEach(() => {
        cy.intercept('GET', `${basePath}/api/person/innlogget`, { statusCode: 404 }).as('loggedInUser')
        cy.intercept('GET', `${basePath}/session`, {}).as('getExpirationTimeForLoggedInUser')

        cy.visit('http://localhost:3000/barnepensjon/soknad')

        cy.wait(['@loggedInUser', '@getExpirationTimeForLoggedInUser'])
    })

    it('should redirect you to separate page when backend services are not working as expected', function () {
        cy.url().should('include', 'system-utilgjengelig')
        cy.get('.navds-alert__wrapper > .navds-body-long').should(
            'have.text',
            'Det er en feil i søknaden som gjør at den dessverre ikke fungerer som den skal.'
        )
    })
})
