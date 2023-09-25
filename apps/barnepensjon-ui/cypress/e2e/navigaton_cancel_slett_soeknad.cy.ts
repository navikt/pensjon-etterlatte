import { basePath, Button } from '../util/constants'

describe('Navigation: "Cancel" button functionality', () => {
    beforeEach(() => {
        cy.startApplication('user').agreeToTerms().useScenario('PARENT')

        cy.clickBtn(Button.Cancel)

        cy.get('#slett-soeknad').should('be.visible')
    })

    it('Should delete application and redirect to nav.no when clicking Yes, delete application', () => {
        cy.intercept('DELETE', `${basePath}/api/api/kladd`, {}).as('deleteApplication')

        cy.get('#slett-soeknad').click()
        cy.wait('@deleteApplication')

        cy.url().should('include', 'https://www.nav.no/')
    })
})
