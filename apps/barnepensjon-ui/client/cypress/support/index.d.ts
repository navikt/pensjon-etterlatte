declare namespace Cypress {
    interface Chainable<Subject = any> {
        gotoScenarioSelection(): Chainable<null>
        gotoFrontPage(userFixture: string): Chainable<null>
        gotoAboutYou(role: string, situation?: string): Chainable<null>
    }
}
