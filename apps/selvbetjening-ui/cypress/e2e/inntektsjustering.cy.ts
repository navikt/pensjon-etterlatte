describe('landingsside for inntetsjustering', () => {
    it('viser informasjonen til innloged bruker', () => {
        cy.visit('http://localhost:5173/selvbetjening/inntektsjustering')
        cy.findByText('STOR SNERK')
        cy.findByText('GIFT')
        cy.findByText('11057523044')
        cy.findByText('Statsborgerskap-mock')
        cy.findByText('Adresse-mock 1')
        cy.findByText('0000 Poststed-mock')
        cy.findByText('+47 11111111')
    })
})
