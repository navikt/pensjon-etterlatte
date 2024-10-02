import { testAccesibility } from '../support/accessibility.ts'

describe('1 - Innledning til inntektsjustering', () => {
    beforeEach(() => {
        cy.lastInntektsjusteringInnledning()
    })

    it('Innledning skal ikke ha noen UU feil', () => {
        testAccesibility()
    })
})
