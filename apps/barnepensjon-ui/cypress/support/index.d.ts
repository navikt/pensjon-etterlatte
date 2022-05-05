declare namespace Cypress {
    interface Chainable<Subject = any> {
        startApplication(userFixture: string): Chainable<null>
        agreeToTerms(gotoNext?: boolean): Chainable<null>
        useScenario(role: string, situation?: string, gotoNext?: boolean): Chainable<null>
        acceptInformationAboutYou(): Chainable<null>
        useSimpleLiving(gotoNext?: boolean): Chainable<null>
        useSimpleDeceased(gotoNext?: boolean): Chainable<null>
        useAdvancedDeceased(gotoNext?: boolean): Chainable<null>
        addChild(gotoNext?: boolean): Chainable<null>
        clickBtn(btn: string): Chainable<null>
    }
}
