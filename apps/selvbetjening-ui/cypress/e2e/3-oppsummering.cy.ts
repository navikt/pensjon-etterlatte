describe('3 - Oppsummering av utfylt inntekt', () => {
    beforeEach(() => {
        cy.lastOppsummering()
    })

    it('Oppsummering skal ikke ha noen UU feil', () => {
        cy.testUniversellUtforming()
    })

    it('Oppsummering skal vise riktig data', () => {
        cy.findByText('Aktivitet og inntekt').should('exist')
        cy.findByText('Endringen jeg ønsker å melde fra er på grunn av en aktivitet').should('exist')
    })

    it('Oppsummering skal vise knapp for å gå tilbake og endre data', () => {
        cy.findByRole('link', { name: 'Endre svar' }).click()
        cy.url().should('include', 'meld-inn-endring/meld-fra-om-endring')
    })

    it('Oppsummering skal kunne sende inn data', () => {
        cy.findByRole('button', { name: 'Send til Nav' }).click()
        cy.url().should('include', 'meld-inn-endring/kvittering')
    })
})
