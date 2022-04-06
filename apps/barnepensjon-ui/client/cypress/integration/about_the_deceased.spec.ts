import { basePath } from '../util/constants'

describe('About The Deceased', () => {
    before(() => {
        cy.intercept('GET', `${basePath}/api/kodeverk/alleland`, { fixture: 'alleland' }).as('getCountries')
    })

    it('Should request information about the deceased', function () {
        cy.gotoFrontPage('user').gotoScenarioSelection().gotoAboutYou('PARENT').gotoAboutTheDeceased()
        cy.wait(['@getCountries'])

        cy.get('#firstName').type('Ola')
        cy.get('#lastName').type('Nordmann')
        cy.get('#fnrDnr').type('11057523044')
        cy.get('#citizenship').get('select').select('Norge')
        cy.get('#dateOfDeath').type('010120')
        cy.get(`[value="NEI"]`).first().check({ force: true })
        cy.get('#occupationalInjury').find('[value="JA"]').check({ force: true })

        cy.get('.navds-button--primary').should('be.enabled').click()

        cy.url().should('include', 'skjema/forelder/steg/om-barn')
    })
})
