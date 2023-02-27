import { basePath, Button } from '../util/constants'

describe('About The Deceased - PARENT', () => {
    before(() => {
        cy.startApplication('user').agreeToTerms().useScenario('PARENT').acceptInformationAboutYou()

        cy.url().should('include', 'skjema/forelder/steg/om-avdoede')
    })

    it('Should request information about the deceased', function () {
        // todo: Test more scenarios and stays abroad
        cy.useSimpleDeceased(false)

        cy.get('#avbryt-btn').should('exist')
        cy.clickBtn(Button.Next)

        cy.url().should('include', 'skjema/forelder/steg/om-barn')
    })
})

describe('About The Deceased - GUARDIAN - ONE PARENT', { testIsolation: false }, () => {
    before(() => {
        cy.startApplication('user')
            .agreeToTerms()
            .useScenario('GUARDIAN', 'ONE_PARENT_DECEASED')
            .acceptInformationAboutYou()

        cy.url().should('include', 'skjema/verge/steg/om-foreldrene')
    })

    it('Should request information about the living parent', function () {
        cy.clickBtn('Legg til')
        cy.useSimpleLiving(false)

        cy.get(`button:contains(${Button.Back})`).should('exist')
        cy.clickBtn(Button.Save)

        cy.url().should('include', 'skjema/verge/steg/om-foreldrene')
    })

    it('Should request information about the deceased parent', function () {
        cy.intercept('GET', `${basePath}/api/kodeverk/alleland`, { fixture: 'alleland' }).as('getCountries')

        cy.clickBtn('Legg til')
        cy.useSimpleDeceased(false)
        cy.clickBtn(Button.Save)

        cy.url().should('include', 'skjema/verge/steg/om-foreldrene')
        cy.clickBtn(Button.Next)
        cy.url().should('include', 'skjema/verge/steg/om-barn')
    })
})

describe('About The Deceased - GUARDIAN - BOTH PARENTS', { testIsolation: false }, () => {
    before(() => {
        cy.startApplication('user')
            .agreeToTerms()
            .useScenario('GUARDIAN', 'BOTH_PARENTS_DECEASED')
            .acceptInformationAboutYou()

        cy.url().should('include', 'skjema/verge/steg/om-foreldrene')
    })

    it('Should request information about the deceased parent 1', function () {
        cy.clickBtn('Legg til')
        cy.useAdvancedDeceased(false)

        cy.get(`button:contains(${Button.Back})`).should('exist')
        cy.clickBtn(Button.Save)

        cy.url().should('include', 'skjema/verge/steg/om-foreldrene')
    })

    it('Should request information about the deceased parent 2', function () {
        cy.intercept('GET', `${basePath}/api/kodeverk/alleland`, { fixture: 'alleland' }).as('getCountries')

        cy.clickBtn('Legg til')
        cy.useAdvancedDeceased(false)

        cy.clickBtn(Button.Save)

        cy.get('.navds-error-summary__item').should('contain', 'Duplikat fødselsnummer / d-nummer')
        cy.get('#fnrDnr').clear().type('26104500284')
        cy.clickBtn(Button.Save)

        cy.url().should('include', 'skjema/verge/steg/om-foreldrene')

        cy.clickBtn(Button.Next)

        cy.url().should('include', 'skjema/verge/steg/om-barn')
    })
})
