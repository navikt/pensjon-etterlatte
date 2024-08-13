describe('tester for inntektsjustering', () => {
    it('skal ikke vise inntektsjustering når ingen er opprettet', () => {
        cy.visit('http://localhost:5173/selvbetjening/inntektsjustering')
        cy.findByText('Fant ingen inntektsjustering')
    })
})
