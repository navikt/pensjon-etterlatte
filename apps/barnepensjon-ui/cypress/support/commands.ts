import { basePath, Button } from '../util/constants'

Cypress.Commands.add('startApplication', (userFixture: string) => {
    cy.intercept('GET', `${basePath}/api/person/innlogget?soeknadType=BARNEPENSJON`, { fixture: userFixture }).as(
        'loggedInUser'
    )
    cy.intercept('GET', `${basePath}/api/api/kladd`, '10000000').as('getApplication')
    cy.intercept('GET', `${basePath}/api/kodeverk/alleland`, { fixture: 'alleland' }).as('getCountries')

    cy.visit('http://localhost:5173/barnepensjon/soknad')

    cy.wait(['@loggedInUser', '@getApplication'])
})

Cypress.Commands.add('clickBtn', (btn: string, index: number = 0) => {
    cy.get(`button:contains(${btn.valueOf()})`).eq(index).should('be.enabled').click()
})

Cypress.Commands.add('agreeToTerms', (gotoNext: boolean = true) => {
    cy.get('.navds-confirmation-panel').get('[type="checkbox"]').click()
    if (gotoNext) cy.clickBtn(Button.StartApplication)
})

Cypress.Commands.add('acceptInformationAboutYou', () => {
    cy.clickBtn(Button.Next)
})

Cypress.Commands.add('useScenario', (role: string, situation: string | undefined) => {
    cy.get('[id="applicantRole"]').find(`[value="${role}"]`).check({ force: true })

    if (situation) {
        cy.get('[id="applicantSituation"]').find(`[value="${situation}"]`).check({ force: true })
    }
})

Cypress.Commands.add('useSimpleLiving', (gotoNext: boolean = true) => {
    cy.wait(['@getCountries'])

    cy.get('#firstName').type('Ola')
    cy.get('#lastName').type('Nordmann')
    cy.get('#fnrDnr').type('26104500284')
    cy.get('#citizenship').get('select').select(1)

    if (gotoNext) cy.clickBtn(Button.Next)
})

Cypress.Commands.add('useSimpleDeceased', (gotoNext: boolean = true) => {
    cy.wait(['@getCountries'])

    cy.get('#firstName').type('Ola')
    cy.get('#lastName').type('Nordmann')
    cy.get('#fnrDnr').type('11057523044')
    cy.get('#citizenship').type('{downArrow}').type('{enter}')
    cy.get('#dateOfDeath').type('010120')
    cy.get('#occupationalInjury').find('[value="JA"]').check({ force: true })
    cy.get('#staysAbroad\\.hasStaysAbroad').find(`[value="NEI"]`).check({ force: true })

    if (gotoNext) cy.clickBtn(Button.Next)
})

Cypress.Commands.add('useAdvancedDeceased', (gotoNext: boolean = true) => {
    cy.wait(['@getCountries'])

    cy.get('#firstName').type('Ola')
    cy.get('#lastName').type('Nordmann')
    cy.get('#fnrDnr').type('11057523044')
    cy.get('#citizenship').type('{downArrow}').type('{enter}')
    cy.get('#dateOfDeath').type('010120')
    cy.get('#occupationalInjury').find('[value="JA"]').check({ force: true })
    cy.get('#staysAbroad\\.hasStaysAbroad').find(`[value="NEI"]`).check({ force: true })

    if (gotoNext) cy.clickBtn(Button.Next)
})

Cypress.Commands.add('addChild', (gotoNext: boolean = false) => {
    cy.intercept('GET', `${basePath}/api/kodeverk/alleland`, { fixture: 'alleland' }).as('getCountries')
    cy.clickBtn(Button.AddChild)

    cy.wait(['@getCountries'])

    cy.get('#firstName').type('Lite')
    cy.get('#lastName').type('Barn')
    cy.get('#fnrDnr').type('09011350027')
    cy.get('#citizenship').type('{downArrow}').type('{enter}')
    cy.get('[type="radio"]').first().check({ force: true })
    cy.get('#staysAbroadAnswer').find('[value="NEI"]').check({ force: true })
    cy.get('#hasGuardianQuestion').find('[value="NEI"]').check({ force: true })

    cy.get('.navds-confirmation-panel').find('[type="checkbox"]').check()
    cy.get('#accountTypeSelection').get('[value="NORSK"]').check({ force: true })
    cy.get('.navds-form-field:contains("Oppgi norsk kontonummer")').find('input').type('1201.05.0101011')

    cy.clickBtn(Button.Add)

    if (gotoNext) cy.clickBtn(Button.Next)
})
