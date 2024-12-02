import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
    test: {
        globals: true, // https://github.com/testing-library/vue-testing-library/issues/296
        environment: 'jsdom',
    },
})
