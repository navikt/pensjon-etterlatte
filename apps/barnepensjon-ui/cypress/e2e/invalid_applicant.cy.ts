import { basePath } from '../util/constants'

describe('Invalid Applicant', () => {
    beforeEach(() => {
        cy.intercept('GET', `${basePath}/api/person/innlogget?soeknadType=BARNEPENSJON`, {
            fixture: 'user-too-young',
        }).as('loggedInUser')

        cy.visit('http://localhost:5173/barnepensjon/soknad')

        cy.wait(['@loggedInUser'])
    })

    it('should redirect you to separate page when the user is too young to apply', function () {
        cy.url().should('include', 'ugyldig-soeker')
        cy.get('.navds-body-long').should(
            'include.text',
            'Det er forelder eller verge som søker om barnepensjon på vegne av deg.'
        )
    })
})
