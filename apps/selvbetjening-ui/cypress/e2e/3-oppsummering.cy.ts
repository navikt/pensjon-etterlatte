describe('3 - Oppsummering av utfylt inntekt', () => {
    before(() => {
        cy.lastInntetktsjusteringOppsummering()
    })

    it('Oppsummering skal ikke ha noen UU feil', () => {
        cy.testUniversellUtforming()
    })
})
