import { Button } from '../util/constants'

describe('Scenario Selection', () => {
    beforeEach(() => {
        cy.startApplication('user').agreeToTerms()
        cy.url().should('include', '/velg-scenarie')
    })

    it('should not be able to continue before selecting applicant role', function () {
        cy.clickBtn(Button.Continue)
        cy.get('.navds-error-summary')
    })

    it('should route correctly when selecting the parent role', function () {
        cy.useScenario('PARENT', null, false)
        cy.clickBtn(Button.Continue)
        cy.url().should('include', 'skjema/forelder/steg/om-deg')
    })

    it('should require you to select situation when selecting the guardian role', function () {
        cy.useScenario('GUARDIAN', null, false)
        cy.clickBtn(Button.Continue)
        cy.get('.navds-error-summary')
    })

    it('should route correctly when guardian checks one parent deceased', function () {
        cy.useScenario('GUARDIAN', 'ONE_PARENT_DECEASED', false)
        cy.clickBtn(Button.Continue)
        cy.url().should('include', 'skjema/verge/steg/om-deg')
    })

    it('should route correctly when guardian checks both parent deceased', function () {
        cy.useScenario('GUARDIAN', 'BOTH_PARENTS_DECEASED', false)
        cy.clickBtn(Button.Continue)
        cy.url().should('include', 'skjema/verge/steg/om-deg')
    })

    it('should route correctly when selecting the child over 18 role', function () {
        cy.useScenario('CHILD', null, false)
        cy.get('.navds-button').should('not.be.visible')
        cy.get(':nth-child(1) > span > b').should('have.text', 'Hvis du har mistet en forelder')
    })
})
