import { Button } from '../util/constants'

describe('Navigation: "Cancel" button functionality', () => {
    beforeEach(() => {
        cy.startApplication('user').useScenario('PARENT').agreeToTerms()

        cy.clickBtn(Button.Cancel)

        cy.get('#avbryt-nei-btn').should('be.visible')
        cy.get('#avbryt-ja-btn').should('be.visible')
    })

    it('Should resume application when clicking No', () => {
        cy.get('#avbryt-nei-btn').click()

        cy.get('#avbryt-nei-btn').should('not.be.visible')
    })

    it('Should redirect to nav.no when clicking Yes, continue later', () => {
        cy.get('#avbryt-ja-btn').click()

        cy.url().should('include', 'https://www.nav.no/')
    })
})
