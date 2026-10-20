import { defineConfig } from 'cypress'

export default defineConfig({
  chromeWebSecurity: false,
  video: false,
  e2e: {
    testIsolation: false,
  },
})
