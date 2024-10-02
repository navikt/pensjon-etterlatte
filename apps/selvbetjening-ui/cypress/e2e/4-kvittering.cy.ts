describe('4 - Kvittering etter inntekt er sendt inn', () => {
    before(() => {
        cy.lastInntektsjusteringKvittering()
    })

    it('Kvittering skal ikke ha noen UU feil', () => {
        cy.testUniversellUtforming()
    })

    it('Skal laste sanity innhold som forventet', () => {
        cy.findAllByText('Kvittering').should('exist')
        cy.findByRole('button', { name: 'Gå til nav.no' })
    })
})
