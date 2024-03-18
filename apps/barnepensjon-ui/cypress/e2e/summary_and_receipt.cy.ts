import { basePath, Button } from '../util/constants'

describe('Summary and Receipt', { testIsolation: false }, () => {
    before(() => {
        cy.startApplication('user')
            .useScenario('PARENT')
            .agreeToTerms()
            .acceptInformationAboutYou()
            .useSimpleDeceased(true)
            .addChild(true)

        cy.url().should('include', 'skjema/forelder/steg/oppsummering')
    })

    it('should present summary of application', function () {
        cy.get('.navds-content-container')
            .should('include.text', 'Om deg')
            .should('include.text', 'Om den avdøde')
            .should('include.text', 'Om barn')
    })

    it('should close the send application modal', function () {
        cy.clickBtn(Button.Send)
        cy.clickBtn(Button.No)

        cy.get('.navds-heading').should('not.contain.text', 'Send inn søknad')
    })

    it('should show error message if application cannot be sent', function () {
        cy.clickBtn(Button.Send)
        cy.clickBtn(Button.Yes)
        cy.get('.navds-alert').should('include.text', 'En feil oppsto ved sending.')
    })

    it('should send application', function () {
        cy.intercept('POST', `${basePath}/api/api/soeknad`, {}).as('application')
        cy.clickBtn(Button.Send)
        cy.clickBtn(Button.Yes)

        cy.wait(['@application'])
        cy.url().should('include', '/kvittering')
    })

    it('should close the application', function () {
        cy.clickBtn(Button.Exit)
        cy.url().should('include', 'https://www.nav.no')
    })
})
