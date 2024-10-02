import { testAccesibility } from '../support/accessibility.ts'

describe('1 - Innledning til inntektsjustering', () => {
    beforeEach(() => {
        cy.lastInntektsjusteringInnledning()
    })

    it('Innledning skal ikke ha noen UU feil', () => {
        testAccesibility()
    })
    it('Sanity innhold skal lastes som forventet', () => {
        cy.findByText('Meld fra om inntekt til neste år').should('exist')
        cy.findByRole('button', { name: 'Start utfyllingen' }).should('exist')
    })
})
