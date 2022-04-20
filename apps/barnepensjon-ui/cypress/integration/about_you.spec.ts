import { Button } from '../util/constants'

describe('About You', () => {
    it('Should only display information about the user', function () {
        cy.startApplication('user').agreeToTerms().useScenario('PARENT')

        cy.url().should('include', 'skjema/forelder/steg/om-deg')

        cy.clickBtn(Button.Next)
        cy.url().should('include', 'skjema/forelder/steg/om-avdoede')
    })

    it('should ask for and validate phone number if not present on user object', function () {
        cy.startApplication('user-without-phonenumber').agreeToTerms().useScenario('PARENT')

        cy.url().should('include', 'skjema/forelder/steg/om-deg')

        // Stop user from continueing when phone number is too short
        cy.get('#phoneNumber').type('12')
        cy.clickBtn(Button.Next)
        cy.get('.navds-error-summary').should('exist')

        // When errors are fixed, the error summary should dissapear and user should be able to continue.
        cy.get('#phoneNumber').type('123456789')
        cy.get('.navds-error-summary').should('not.exist')

        cy.clickBtn(Button.Next)
        cy.url().should('include', 'skjema/forelder/steg/om-avdoede')
    })
})
