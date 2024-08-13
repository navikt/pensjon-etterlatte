import { defineConfig } from 'cypress'

export default defineConfig({
    chromeWebSecurity: false,
    video: false,
    screenshotOnRunFailure: false,
    e2e: {
        testIsolation: false,
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
})
