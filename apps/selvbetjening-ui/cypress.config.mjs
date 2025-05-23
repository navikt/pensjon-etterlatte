import { defineConfig } from 'cypress'

export default defineConfig({
    chromeWebSecurity: false,
    video: false,
    screenshotOnRunFailure: false,
    e2e: {
        testIsolation: false,
        excludeSpecPattern: ['**/*.cy.ts'],
    },
    trashAssetsBeforeRuns: true,
})
