describe('Scenario Selection', () => {
    beforeEach(() => {
        cy.gotoFrontPage('user').gotoScenarioSelection()
    })

    it('should not be able to continue before selecting applicant role', function () {
        continueApplication()
        cy.get('.navds-error-summary')
    })

    it('should route correctly when selecting the parent role', function () {
        selectRole('PARENT')
        continueApplication()
        cy.url().should('include', 'skjema/forelder/steg/om-deg')
    })

    it('should require you to select situation when selecting the guardian role', function () {
        selectRole('GUARDIAN')
        continueApplication()
        cy.get('.navds-error-summary')
    })

    it('should route correctly when guardian checks one parent deceased', function () {
        selectRole('GUARDIAN')
        cy.get('[id="applicantSituation"]').find(`[value="ONE_PARENT_DECEASED"]`).check({ force: true })
        continueApplication()
        cy.url().should('include', 'skjema/verge/steg/om-deg')
    })

    it('should route correctly when guardian checks both parent deceased', function () {
        selectRole('GUARDIAN')
        cy.get('[id="applicantSituation"]').find(`[value="BOTH_PARENTS_DECEASED"]`).check({ force: true })
        continueApplication()
        cy.url().should('include', 'skjema/verge/steg/om-deg')
    })

    it('should route correctly when selecting the child over 18 role', function () {
        selectRole('CHILD')
        cy.get('.navds-button').should('not.exist')
        cy.get(':nth-child(1) > span > b').should('have.text', 'Hvis du har mistet en forelder')
    })
})

const continueApplication = () => cy.get('.navds-button').should('be.enabled').click()
const selectRole = (role: string) => cy.get('[id="applicantRole"]').find(`[value="${role}"]`).check({ force: true })
