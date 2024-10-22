describe('1 - Innledning til inntektsjustering', () => {
    before(() => {
        cy.lastInntektsjusteringInnledning()
    })

    it('Innledning skal ikke ha noen UU feil', () => {
        cy.testUniversellUtforming()
    })

    it('Skal vise oppsummering av allerede oppgitt inntekt', () => {
        cy.findAllByText('juli 2025').should('exist')
        cy.findAllByText('123123 kr').should('exist')
    })
})
