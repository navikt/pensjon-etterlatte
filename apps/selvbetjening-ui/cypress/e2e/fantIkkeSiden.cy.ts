import { testAccesibility } from '../support/accessibility.ts'

describe('"Side ikke funnet" skal fungere som forventet', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/selvbetjening/inntektsjustering/hei-dette-er-meg-route')
    })

    it('Skal ikke ha noen UU feil', () => {
        testAccesibility()
    })

    it('Skal vise "side ikke funnet" ved route som ikke eksisterer', () => {
        cy.findByText('Beklager, vi fant ikke siden').should('exist')
    })

    it('Skal ikke navigere til "side ikke funnet" hvis routen faktisk finnes', () => {
        cy.visit('http://localhost:5173/selvbetjening/inntektsjustering/innledning')

        cy.findByText('Meld fra om inntekt til neste år').should('exist')
    })

    it('Skal kunne navigere seg til nav.no hvis siden ikke finnes', () => {
        cy.findByRole('link', { name: 'Gå til forsiden' }).click()

        cy.url().should('eq', 'https://www.nav.no/')
    })
})
