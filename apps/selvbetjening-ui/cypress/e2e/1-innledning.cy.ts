describe('1 - Innledning til inntektsjustering', () => {
    before(() => {
        cy.lastInntektsjusteringInnledning()
    })

    it('Innledning skal ikke ha noen UU feil', () => {
        cy.testUniversellUtforming()
    })
})
