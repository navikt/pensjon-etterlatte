import { basePath, getById } from '../util/cy-functions'

describe('Inntekt', () => {
    it(`Går igjennom inntektsteget med stegteller`, () => {
        cy.intercept('POST', `${basePath}/api/feature`, { fixture: 'featureToggles' })
        cy.intercept('GET', `${basePath}/api/person/innlogget?soeknadType=OMSTILLINGSSTOENAD`, {
            fixture: 'testbruker',
        })
        cy.intercept('GET', `${basePath}/api/api/kladd`, {
            payload: JSON.stringify({
                harSamtykket: true,
                spraak: 'nb',
                aktivtSteg: 'inntekt',
                skjema: {},
            }),
        })
        cy.visit(`${Cypress.config('baseUrl') || 'http://localhost:5173'}${basePath}/skjema/steg/inntekt`, {
            onBeforeLoad: (win) => {
                Object.defineProperty(win.navigator, 'language', { value: 'nb-NO' })
            },
        })
        getById('fortsett_soeknad').click()
        cy.get('h2').should('have.text', 'Inntekt')
        cy.get('[role="main"]').should('contain.text', 'Steg 4 av 6')
        cy.contains('button', 'Vis alle steg').should('be.visible')
        getById('arbeidsinntekt').type('0')
        getById('andreInntekter.inntekt').should('not.exist')
        getById('noeSomKanPaavirkeInntekten.grunnTilPaavirkelseAvInntekt').should('not.exist')
        getById('andreInntekter.valg').check()
        getById('noeSomKanPaavirkeInntekten.valg').check()
        getById('andreInntekter.inntekt').should('be.visible')
        getById('andreInntekter.beskrivelse').should('be.visible')
        getById('noeSomKanPaavirkeInntekten.grunnTilPaavirkelseAvInntekt').should('be.visible')
        getById('andreInntekter.beskrivelse').type('Utleie')
        cy.injectAxe()
        cy.checkA11y('[role="main"]')
    })
})
