import { Button } from '../util/constants'

describe('Front Page', { testIsolation: false }, () => {
    beforeEach(() => {
        cy.startApplication('user')
        cy.url().should('include', '/')
    })

    it('should require user to agree with the terms in order to continue', function () {
        cy.get('.navds-confirmation-panel').get('[type="checkbox"]').should('not.be.checked')
        cy.clickBtn(Button.StartApplication)
        cy.get('.navds-error-summary')
    })

    it('should not be able to continue before selecting applicant role', function () {
        cy.clickBtn(Button.StartApplication)
        cy.get('.navds-error-summary')
    })

    it('should route correctly when selecting the parent role', function () {
        cy.useScenario('PARENT')
        cy.agreeToTerms()
        cy.url().should('include', 'skjema/forelder/steg/om-deg')
    })

    it('should require you to select situation when selecting the guardian role', function () {
        cy.useScenario('GUARDIAN')
        cy.agreeToTerms()
        cy.get('.navds-error-summary')
    })

    it('should route correctly when guardian checks one parent deceased', function () {
        cy.useScenario('GUARDIAN', 'ONE_PARENT_DECEASED')
        cy.agreeToTerms()
        cy.url().should('include', 'skjema/verge/steg/om-deg')
    })

    it('should route correctly when guardian checks both parent deceased', function () {
        cy.useScenario('GUARDIAN', 'BOTH_PARENTS_DECEASED')
        cy.agreeToTerms()
        cy.url().should('include', 'skjema/verge/steg/om-deg')
    })

    it('should route correctly when selecting the child over 18 role', function () {
        cy.useScenario('CHILD', 'ONE_PARENT_DECEASED')
        cy.agreeToTerms()
        cy.url().should('include', 'skjema/barn/steg/om-deg')
    })

})
