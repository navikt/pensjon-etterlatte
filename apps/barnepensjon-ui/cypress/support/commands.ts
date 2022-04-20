import { basePath, Button } from '../util/constants'

Cypress.Commands.add('startApplication', (userFixture: string) => {
    cy.intercept('GET', `${basePath}/api/person/innlogget`, { fixture: userFixture }).as('loggedInUser')
    cy.intercept('GET', `${basePath}/api/api/kladd`, '10000000').as('getApplication')
    cy.intercept('GET', `${basePath}/session`, {}).as('getExpirationTimeForLoggedInUser')
    cy.intercept('GET', `${basePath}/api/kodeverk/alleland`, { fixture: 'alleland' }).as('getCountries')

    cy.visit('http://localhost:3000/barnepensjon/soknad')

    cy.wait(['@loggedInUser', '@getApplication', '@getExpirationTimeForLoggedInUser'])
})

Cypress.Commands.add('clickBtn', (btn: string) => {
    cy.get(`button:contains(${btn.valueOf()})`).should('be.enabled').click()
})

Cypress.Commands.add('agreeToTerms', (gotoNext: boolean = true) => {
    cy.get('.navds-confirmation-panel').get('[type="checkbox"]').click()
    if (gotoNext) cy.clickBtn(Button.StartApplication)
})

Cypress.Commands.add('acceptInformationAboutYou', () => {
    cy.clickBtn(Button.Next)
})

Cypress.Commands.add('useScenario', (role: string, situation: string = null, gotoNext: boolean = true) => {
    cy.get('[id="applicantRole"]').find(`[value="${role}"]`).check({ force: true })

    if (situation) {
        cy.get('[id="applicantSituation"]').find(`[value="${situation}"]`).check({ force: true })
    }

    if (gotoNext) cy.clickBtn(Button.Continue)
})

Cypress.Commands.add('useSimpleDeceased', (gotoNext: boolean = true) => {
    cy.wait(['@getCountries'])

    cy.get('#firstName').type('Ola')
    cy.get('#lastName').type('Nordmann')
    cy.get('#fnrDnr').type('11057523044')
    cy.get('#citizenship').get('select').select('Norge')
    cy.get('#dateOfDeath').type('010120')
    cy.get(`[value="NEI"]`).first().check({ force: true })
    cy.get('#occupationalInjury').find('[value="JA"]').check({ force: true })

    if (gotoNext) cy.clickBtn(Button.Save)
})

Cypress.Commands.add('addChild', (gotoNext: boolean = false) => {
    cy.intercept('GET', `${basePath}/api/kodeverk/alleland`, { fixture: 'alleland' }).as('getCountries')
    cy.clickBtn(Button.AddChild)

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

    cy.clickBtn(Button.Save)

    if (gotoNext) cy.clickBtn(Button.Next)
})
