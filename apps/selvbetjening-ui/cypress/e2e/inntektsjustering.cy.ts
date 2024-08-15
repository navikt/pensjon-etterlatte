describe('landingsside for inntetsjustering', () => {
    beforeEach(() => {
        cy.startInntektsjustering('user')
        cy.url().should('include', '/')
    })

    it('viser informasjonen til innloged bruker', () => {
        cy.findByText('STOR SNERK')
        cy.findByText('Gift')
        cy.findByText('11057523044')
        cy.findByText('Norsk')
        cy.findByText('Testveien 12')
        cy.findByText('0539 Oslo')
        cy.findByText('12345123')
    })
})
