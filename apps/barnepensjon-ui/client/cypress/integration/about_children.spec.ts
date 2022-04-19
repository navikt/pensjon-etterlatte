import { basePath, Button } from '../util/constants'

describe('About Children', () => {
    before(() => {
        cy.startApplication('user')
            .agreeToTerms()
            .useScenario('PARENT')
            .acceptInformationAboutYou()
            .useSimpleDeceased(true)

        cy.url().should('include', 'skjema/forelder/steg/om-barn')
    })

    it('should not be allowed to continue without adding a child', function () {
        cy.clickBtn(Button.Next)
        cy.get('.typo-feilmelding').should('have.text', 'Du må søke om barnepensjon for minst ett barn.')
    })

    it('should be able to apply for joint child under 18 years', function () {
        cy.addChild()
    })

    it('should display saved children in the list', function () {
        cy.get('.navds-heading').should('contain.text', 'Lite Barn')
        cy.get('.navds-tag').should('have.text', 'Søkt om barnepensjon')
    })

    it('should display warning when adding child above 18', function () {
        cy.intercept('GET', `${basePath}/api/kodeverk/alleland`, { fixture: 'alleland' }).as('getCountries')

        cy.clickBtn(Button.AddChild)
        cy.wait(['@getCountries'])

        cy.get('#firstName').type('Stort')
        cy.get('#lastName').type('Barn')
        cy.get('#fnrDnr').type('11058019471')
        cy.get('#citizenship').get('select').select('Norge')
        cy.get('[type="radio"]').first().check({ force: true })

        cy.get('#above18Warning').should('exist')
        cy.get('.navds-confirmation-panel').should('not.exist')
        cy.clickBtn(Button.Save)
    })

    it('should only be able to apply for joint children', function () {
        cy.clickBtn(Button.AddChild)
        cy.get('#fnrDnr').type('09011350027')
        cy.get('[type="radio"]').get('[value="FIRST_PARENT"').check({ force: true })
        cy.get('.navds-confirmation-panel').should('not.exist')
        cy.get('[type="radio"]').get('[value="SECOND_PARENT"').check({ force: true })
        cy.get('.navds-confirmation-panel').should('not.exist')
        cy.get('[type="radio"]').get('[value="BOTH"').check({ force: true })
        cy.get('.navds-confirmation-panel').should('exist')
        cy.clickBtn(Button.Cancel)
    })

    it('should go to summary when pressing next', function () {
        cy.clickBtn(Button.Next)
        cy.url().should('include', 'skjema/forelder/steg/oppsummering')
    })

    it('should not ask for address or payment details when logged in user has code 6', function () {
        cy.startApplication('user-with-protected-address')
            .agreeToTerms()
            .useScenario('PARENT')
            .acceptInformationAboutYou()
            .useSimpleDeceased(true)

        cy.clickBtn(Button.AddChild)

        cy.get('#firstName').type('Lite')
        cy.get('#lastName').type('Barn')
        cy.get('#fnrDnr').type('09011350027')
        cy.get('#citizenship').get('select').select('Norge')
        cy.get('[type="radio"]').first().check({ force: true })
        cy.get('#staysAbroadAnswer').should('not.exist')
        cy.get('#hasGuardianQuestion').find('[value="NEI"]').check({ force: true })
        cy.get('.navds-confirmation-panel').find('[type="checkbox"]').check()
        cy.get('#accountTypeSelection').should('not.exist')
        cy.clickBtn(Button.Save)

        cy.clickBtn(Button.Next)
        cy.url().should('include', 'skjema/forelder/steg/oppsummering')
    })
})
