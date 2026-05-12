import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        plugins: [react()],
        server: {
            host: true,
        },
        build: {
            sourcemap: true,
        },
        resolve: {
            tsconfigPaths: true,
        },
    }
})
