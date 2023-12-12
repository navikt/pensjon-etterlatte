import { basePath } from '../util/constants'

describe('Invalid Applicant', () => {
    beforeEach(() => {
        cy.intercept('GET', `${basePath}/api/person/innlogget`, { fixture: 'user-too-young' }).as('loggedInUser')

        cy.visit('http://localhost:3000/barnepensjon/soknad')

        cy.wait(['@loggedInUser'])
    })

    it('should redirect you to separate page when the user is too young to apply', function () {
        cy.url().should('include', 'ugyldig-soeker')
        cy.get('.navds-body-long > span').should(
            'include.text',
            'For barn under 18 år er det forelder eller verge som søker om barnepensjon.'
        )
    })
})
