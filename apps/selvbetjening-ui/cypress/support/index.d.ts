declare namespace Cypress {
    interface Chainable<T> {
        testUniversellUtforming(): Chainable<T>
        lastInnledning(): Chainable<T>
        lastMeldFraOmEndring(): Chainable<T>
        lastOppsummering(): Chainable<T>
        lastKvittering(): Chainable<T>
    }
}
