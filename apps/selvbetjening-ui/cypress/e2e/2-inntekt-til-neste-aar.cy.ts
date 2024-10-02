import { testAccesibility } from '../support/accessibility.ts'

describe('2 - Utfylling av inntekt til neste år', () => {
    before(() => {
        cy.lastInntektsjusteringInntektTilNesteAar()
    })

    it('Inntekt neste år skal ikke ha noen UU feil', () => {
        testAccesibility()
    })
})
