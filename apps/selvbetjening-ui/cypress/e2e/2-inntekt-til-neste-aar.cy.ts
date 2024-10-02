describe('2 - Utfylling av inntekt til neste år', () => {
    before(() => {
        cy.lastInntektsjusteringInntektTilNesteAar()
    })

    it('Inntekt neste år skal ikke ha noen UU feil', () => {
        cy.testUniversellUtforming()
    })

    it('Skal laste sanity innhold som forventet', () => {
        cy.findAllByText('Inntekt til neste år').should('exist')
        cy.findByRole('button', { name: 'Forrige steg' }).should('exist')
        cy.findByRole('button', { name: 'Neste steg' }).should('exist')
    })

    // TODO: når skjema er mer spikra må vi få inn noen tester her
})
