declare namespace Cypress {
    interface Chainable<Subject = any> {
        startInntektsjustering(userFixture: string): Chainable<undefined>
    }
}
