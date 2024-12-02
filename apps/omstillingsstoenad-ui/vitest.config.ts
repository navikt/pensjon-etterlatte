import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    test: {
        globals: true, // https://github.com/testing-library/vue-testing-library/issues/296
        environment: 'jsdom',
    },
})
