describe('1 - Innledning til inntektsjustering', () => {
    before(() => {
        cy.lastInnledning()
    })

    it('Innledning skal ikke ha noen UU feil', () => {
        cy.testUniversellUtforming()
    })

    it('Innledning skal kunne gå videre til start utfyllingen', () => {
        cy.findByRole('button', { name: 'Start utfyllingen' }).click()

        cy.url().should('include', 'meld-inn-endring/meld-fra-om-endring')
    })
})
