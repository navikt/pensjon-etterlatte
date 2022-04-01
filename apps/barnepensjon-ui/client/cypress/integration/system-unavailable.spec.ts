describe('System unavailable', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/barnepensjon/soknad')
    })

    it('should redirect you to separate page when backend services are not working as expected', function () {
        cy.get('.navds-alert__wrapper > .navds-body-long').should(
            'include',
            'Det er en feil i søknaden som gjør at den dessverre ikke fungerer som den skal.'
        )
    })
})
