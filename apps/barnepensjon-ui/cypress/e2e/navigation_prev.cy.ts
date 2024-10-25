import { Button } from '../util/constants'

describe('Navigation: "Back" button functionality', () => {
    before(() => {
        cy.startApplication('user').useScenario('PARENT').agreeToTerms().acceptInformationAboutYou()

        cy.url().should('include', 'skjema/forelder/steg/om-avdoede')
    })

    it('Should got to previous step when clicking Back if no fields are touched', () => {
        cy.clickBtn(Button.Back)
        cy.url().should('include', 'skjema/forelder/steg/om-deg')
        cy.clickBtn(Button.Next)
    })

    it('Should open modal i clicking back after touching fields', () => {
        cy.get('#firstName').type('Ola')
        cy.clickBtn(Button.Back)
        cy.get('.navds-heading').should('contain.text', 'Gå tilbake uten å lagre')
    })

    it('Should let you keep on filling out form', () => {
        cy.clickBtn('Fortsett å fyll ut skjema')
        cy.get('#firstName').should('have.value', 'Ola')
    })

    it('Should not keep content in form if user go back without filling out everything', () => {
        cy.get('#firstName').should('have.value', 'Ola')
        cy.clickBtn(Button.Back)
        cy.clickBtn('Gå tilbake uten å lagre')
        cy.clickBtn(Button.Next)
        cy.get('#firstName').should('have.value', '')
    })
})
