import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.mjs'

// https://vitejs.dev/config/
export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            globals: true, // https://github.com/testing-library/vue-testing-library/issues/296
            environment: 'jsdom',
        },
    })
)
