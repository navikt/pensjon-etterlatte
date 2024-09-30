describe('"System utilgjengelig" skal fungere som forventet', () => {
    before(() => {
        cy.intercept(
            'GET',
            'http://localhost:8080/selvbetjening/api/sanity?sanityQuery=*%5B_type+%3D%3D+%22inntektsjusteringInnledning%22%5D',
            {
                statusCode: 500,
            }
        )
        cy.visit('http://localhost:5173/selvbetjening/inntektsjustering/innledning')
    })

    it('Skal kunne navigere til "system utilgjengelig" ved feil', () => {
        cy.url().should('include', '/system-utilgjengelig')

        cy.findByText(
            'En teknisk feil på våre servere gjør at siden er utilgjengelig. Dette skyldes ikke noe du gjorde.'
        )
    })
})
