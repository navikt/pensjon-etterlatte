declare namespace Cypress {
    interface Chainable<T> {
        startApplication(userFixture: string): Chainable<T>
        agreeToTerms(gotoNext?: boolean): Chainable<T>
        useScenario(role: string, situation?: string, gotoNext?: boolean): Chainable<T>
        acceptInformationAboutYou(): Chainable<T>
        useSimpleLiving(gotoNext?: boolean): Chainable<T>
        useSimpleDeceased(gotoNext?: boolean): Chainable<T>
        useAdvancedDeceased(gotoNext?: boolean): Chainable<T>
        addChild(gotoNext?: boolean): Chainable<T>
        clickBtn(btn: string, index?: number): Chainable<T>
    }
}
