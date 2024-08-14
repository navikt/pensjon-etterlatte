describe('landingsside for inntetsjustering', () => {
    it('viser informasjonen til innloged bruker', () => {
        cy.visit('http://localhost:5173/selvbetjening/inntektsjustering')
        cy.findByText('STOR SNERK')
        cy.findByText('GIFT')
        cy.findByText('11057523044')
        cy.findByText('Norge')
        cy.findByText('Humlegården 1')
        cy.findByText('0000 Humla')
        cy.findByText('+47 11111111')
    })
})
