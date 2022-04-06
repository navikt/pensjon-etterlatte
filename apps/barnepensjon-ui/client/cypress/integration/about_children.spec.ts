import { basePath } from '../util/constants'

describe('About Children', () => {
    before(() => {
        cy.gotoFrontPage('user')
            .gotoScenarioSelection()
            .gotoAboutYou('PARENT')
            .gotoAboutTheDeceased()
            .gotoAboutChildren()
    })

    it('should not be allowed to continue without adding a child', function () {
        cy.get('button:contains("Neste")').should('be.enabled').click()
        cy.get('.typo-feilmelding').should('have.text', 'Du må søke om barnepensjon for minst ett barn.')
    })

    it('should be able to apply for joint child under 18 years', function () {
        cy.intercept('GET', `${basePath}/api/kodeverk/alleland`, { fixture: 'alleland' }).as('getCountries')

        cy.get('button:contains("Legg til barn")').should('be.enabled').click()
        cy.wait(['@getCountries'])

        cy.get('#firstName').type('Lite')
        cy.get('#lastName').type('Barn')
        cy.get('#fnrDnr').type('09011350027')
        cy.get('#citizenship').get('select').select('Norge')
        cy.get('[type="radio"]').first().check({ force: true })
        cy.get('#staysAbroadAnswer').find('[value="NEI"]').check({ force: true })
        cy.get('#hasGuardianQuestion').find('[value="NEI"]').check({ force: true })

        cy.get('.navds-confirmation-panel').find('[type="checkbox"]').check()
        cy.get('#accountTypeSelection').get('[value="NORSK"]').check({ force: true })
        cy.get('.skjemaelement:contains("Oppgi norsk kontonummer")').find('input').type('1201.05.0101011')
        cy.get('#taxWithholdAnswer').find('[type="radio"]').check({ force: true })
        cy.get('.skjemagruppe:contains("skattetrekk")').find('input').last().type('22', { force: true })

        cy.get('.navds-button--primary').should('be.enabled').click()
    })

    it('should display saved children in the list', function () {
        cy.get('.navds-heading').should('contain.text', 'Lite Barn')
        cy.get('.navds-tag').should('have.text', 'Søkt om barnepensjon')
    })

    it('should display warning when child is above 18', function () {
        cy.intercept('GET', `${basePath}/api/kodeverk/alleland`, { fixture: 'alleland' }).as('getCountries')

        cy.get('button:contains("Legg til barn")').should('be.enabled').click()
        cy.wait(['@getCountries'])

        cy.get('#firstName').type('Stort')
        cy.get('#lastName').type('Barn')
        cy.get('#fnrDnr').type('11058019471')
        cy.get('#citizenship').get('select').select('Norge')
        cy.get('[type="radio"]').first().check({ force: true })

        cy.get('#above18Warning').should('exist')
        cy.get('.navds-confirmation-panel').should('not.exist')
        cy.get('.navds-button--primary').should('be.enabled').click()
    })

    it('should only be able to apply for joint children', function () {
        cy.get('button:contains("Legg til barn")').should('be.enabled').click()
        cy.get('#fnrDnr').type('09011350027')
        cy.get('[type="radio"]').get('[value="FIRST_PARENT"').check({ force: true })
        cy.get('.navds-confirmation-panel').should('not.exist')
        cy.get('[type="radio"]').get('[value="SECOND_PARENT"').check({ force: true })
        cy.get('.navds-confirmation-panel').should('not.exist')
        cy.get('[type="radio"]').get('[value="BOTH"').check({ force: true })
        cy.get('.navds-confirmation-panel').should('exist')
        cy.get('#cancelAddChildren').should('be.enabled').click()
    })

    it('should go to summary when pressing next', function () {
        cy.get('button:contains("Neste")').should('be.enabled').click()
        cy.url().should('include', 'skjema/forelder/steg/oppsummering')
    })

    it('should not ask for address or payment details when logged in user has code 6', function () {
        cy.gotoFrontPage('user-with-protected-address')
            .gotoScenarioSelection()
            .gotoAboutYou('PARENT')
            .gotoAboutTheDeceased()
            .gotoAboutChildren()

        cy.get('button:contains("Legg til barn")').should('be.enabled').click()
        cy.get('#firstName').type('Lite')
        cy.get('#lastName').type('Barn')
        cy.get('#fnrDnr').type('09011350027')
        cy.get('#citizenship').get('select').select('Norge')
        cy.get('[type="radio"]').first().check({ force: true })
        cy.get('#staysAbroadAnswer').should('not.exist')
        cy.get('#hasGuardianQuestion').find('[value="NEI"]').check({ force: true })
        cy.get('.navds-confirmation-panel').find('[type="checkbox"]').check()
        cy.get('#accountTypeSelection').should('not.exist')

        cy.get('.navds-button--primary').should('be.enabled').click()
        cy.get('button:contains("Neste")').should('be.enabled').click()
        cy.url().should('include', 'skjema/forelder/steg/oppsummering')
    })
})
