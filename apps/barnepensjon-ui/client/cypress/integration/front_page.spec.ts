describe('Front Page', () => {
    before(() => {
        cy.gotoFrontPage('user')
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
