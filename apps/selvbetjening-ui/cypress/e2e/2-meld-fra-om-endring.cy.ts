describe('2 - Meld fra om endring', () => {
    before(() => {
        cy.lastMeldFraOmEndring()
    })

    it('Meld fra om endring skal ikke ha noen UU feil', () => {
        cy.testUniversellUtforming()
    })

    it('Skal vise feilmelding hvis vi ikke fyller ut noe og prøver å gå videre', () => {
        cy.findByRole('button', { name: 'Neste steg' }).click()

        cy.findByText('Du må rette disse feilene før du kan fortsette').should('exist')
        cy.findAllByRole('link', { name: 'Du må velge hva endringen gjelder' }).should('exist')

        cy.findAllByRole('radio').first().click()

        cy.findByRole('button', { name: 'Neste steg' }).click()

        cy.findByText('Du må rette disse feilene før du kan fortsette').should('exist')
        cy.findAllByRole('link', { name: 'Du må beskrive endringen din' }).should('exist')
    })

    it('Skal kunne velge hvilke type endring og skrive en begrunnelse', () => {
        cy.findAllByRole('radio').first().click()
        cy.findByRole('textbox').type('Endringen jeg ønsker å melde fra er på grunn av en aktivitet')
    })
})
