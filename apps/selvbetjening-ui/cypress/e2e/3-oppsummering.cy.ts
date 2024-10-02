describe('3 - Oppsummering av utfylt inntekt', () => {
    before(() => {
        cy.lastInntetktsjusteringOppsummering()
    })

    it('Oppsummering skal ikke ha noen UU feil', () => {
        cy.testUniversellUtforming()
    })

    it('Skal laste sanity innhold som forventet', () => {
        cy.findAllByText('Oppsummering').should('exist')
        cy.findByRole('button', { name: 'Forrige steg' }).should('exist')
        cy.findByRole('button', { name: 'Send søknad' }).should('exist')
    })
})
