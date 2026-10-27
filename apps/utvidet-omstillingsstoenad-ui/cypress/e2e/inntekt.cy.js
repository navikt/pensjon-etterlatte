import { basePath, getById } from '../util/cy-functions'

describe('Inntekt', () => {
    for (const [bredde, hoyde] of [
        [1440, 1000],
        [375, 812],
    ]) {
        it(`viser begge Figma-tilstandene med stegteller ved ${bredde}px`, () => {
            cy.viewport(bredde, hoyde)
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
            cy.get('h2').should('have.text', 'Inntekt').and('have.css', 'text-align', 'center')
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
            cy.contains('1000 tegn igjen').should('be.visible')
            getById('andreInntekter.beskrivelse').type('Utleie')
            cy.contains('994 tegn igjen').should('be.visible')
            cy.get('form').then(($form) => {
                const form = $form[0].getBoundingClientRect()
                for (const id of [
                    'arbeidsinntekt',
                    'naeringsinntekt',
                    'inntektFraUtland',
                    'andreInntekter.inntekt',
                    'andreInntekter.beskrivelse',
                    'noeSomKanPaavirkeInntekten.grunnTilPaavirkelseAvInntekt',
                ]) {
                    const felt = $form.find(`[id="${id}"]`)[0]
                    const rect = felt.getBoundingClientRect()
                    expect(rect.width).to.be.greaterThan(0)
                    expect(rect.left).to.be.at.least(form.left)
                    expect(rect.right).to.be.at.most(form.right)
                }
            })
            cy.document().then((doc) => {
                expect(doc.documentElement.scrollWidth).to.be.at.most(bredde)
            })
            cy.injectAxe()
            cy.checkA11y('[role="main"]')
        })
    }
})
