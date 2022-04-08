import { Button } from '../util/constants'

describe('Front Page', () => {
    before(() => {
        cy.startApplication('user')
    })

    it('should require user to agree with the terms in order to continue', function () {
        cy.get('.navds-confirmation-panel').get('[type="checkbox"]').should('not.be.checked')
        cy.get('.navds-button').should('be.disabled')
    })

    it('should let the user start the application after agreeing with the terms', function () {
        cy.agreeToTerms(false)

        cy.get('.navds-confirmation-panel').get('[type="checkbox"]').should('be.checked')
        cy.clickBtn(Button.StartApplication)

        cy.url().should('include', 'velg-scenarie')
    })
})
