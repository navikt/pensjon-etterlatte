describe('1 - Innledning til inntektsjustering', () => {
    before(() => {
        cy.lastInntektsjusteringInnledning()
    })

    it('Innledning skal ikke ha noen UU feil', () => {
        cy.testUniversellUtforming()
    })

    it('Sanity innhold skal lastes som forventet', () => {
        cy.findAllByText('Innledning').should('exist')
        cy.findByRole('button', { name: 'Start utfyllingen' }).should('exist')
    })
})
