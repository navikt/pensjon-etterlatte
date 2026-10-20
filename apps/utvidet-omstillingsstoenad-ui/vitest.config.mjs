import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.mjs'

// https://vitejs.dev/config/
export default defineConfig(configEnv => mergeConfig(
        viteConfig(configEnv),
        defineConfig({
            test: {
                globals: true, // https://github.com/testing-library/vue-testing-library/issues/296
                environment: 'jsdom',
            },
        })
))
