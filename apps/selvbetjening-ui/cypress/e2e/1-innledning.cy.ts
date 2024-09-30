import { testAccesibility } from '../support/accessibility.ts'

describe('1 - Innledning til inntektsjustering', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/selvbetjening/inntektsjustering/innledning')
    })

    it('Innledning skal ikke ha noen UU feil', () => {
        testAccesibility()
    })
})
