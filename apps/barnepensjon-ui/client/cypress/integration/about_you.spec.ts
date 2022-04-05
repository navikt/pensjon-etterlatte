describe('About You', () => {
    it('Should only display information about the user', function () {
        cy.gotoFrontPage('user').gotoScenarioSelection().gotoAboutYou('PARENT')
        cy.get('.navds-button--primary').should('be.enabled').click()
        cy.url().should('include', 'skjema/forelder/steg/om-avdoede')
    })

    it('should ask for and validate phone number if not present on user object', function () {
        cy.gotoFrontPage('user-without-phonenumber').gotoScenarioSelection().gotoAboutYou('PARENT')

        // Stop user from continueing when phone number is too short
        cy.get('#phoneNumber').type('12')
        cy.get('.navds-button--primary').should('be.enabled').click()
        cy.get('.navds-error-summary').should('exist')

        // When errors are fixed, the error summary should dissapear and user should be able to continue.
        cy.get('#phoneNumber').type('123456789')
        cy.get('.navds-error-summary').should('not.exist')
        cy.get('.navds-button--primary').should('be.enabled').click()

        cy.url().should('include', 'skjema/forelder/steg/om-avdoede')
    })
})
