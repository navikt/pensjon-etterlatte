import { basePath } from '../util/constants'

Cypress.Commands.add('gotoFrontPage', (userFixture: string) => {
    cy.intercept('GET', `${basePath}/api/person/innlogget`, { fixture: userFixture }).as('loggedInUser')
    cy.intercept('GET', `${basePath}/api/api/kladd`, '10000000').as('getApplication')
    cy.intercept('GET', `${basePath}/session`, {}).as('getExpirationTimeForLoggedInUser')

    cy.visit('http://localhost:3000/barnepensjon/soknad')

    cy.wait(['@loggedInUser', '@getApplication', '@getExpirationTimeForLoggedInUser'])
})

Cypress.Commands.add('gotoScenarioSelection', () => {
    cy.get('.navds-confirmation-panel').get('[type="checkbox"]').click()
    cy.get('.navds-button').should('be.enabled').click()

    cy.url().should('include', 'velg-scenarie')
})

Cypress.Commands.add('gotoAboutYou', (role: string, situation: string = null) => {
    cy.get('[id="applicantRole"]').find(`[value="${role}"]`).check({ force: true })

    if (situation) {
        cy.get('[id="applicantSituation"]').find(`[value="${situation}"]`).check({ force: true })
    }

    cy.get('.navds-button').should('be.enabled').click()

    cy.url().should('include', 'om-deg')
})
