describe('1 - Innledning til inntektsjustering', () => {
    before(() => {
        cy.lastInnledning()
    })

    it('Innledning skal ikke ha noen UU feil', () => {
        cy.testUniversellUtforming()
    })
})
