import { Button } from '../util/constants'

describe('Navigation: "Back" button functionality', () => {
    before(() => {
        cy.startApplication('user').useScenario('PARENT').agreeToTerms().acceptInformationAboutYou()

        cy.url().should('include', 'skjema/forelder/steg/om-avdoede')
    })

    it('Should keep content in form if user go back without filling out everything', () => {
        cy.get('#firstName').type('Ola')
        cy.clickBtn(Button.Back)
        cy.url().should('include', 'skjema/forelder/steg/om-deg')
        cy.clickBtn(Button.Next)
        cy.url().should('include', 'skjema/forelder/steg/om-avdoede')
        cy.get('#firstName').should('have.value', 'Ola')
    })
})
