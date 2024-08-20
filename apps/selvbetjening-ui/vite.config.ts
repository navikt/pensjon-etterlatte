import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/selvbetjening/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/selvbetjening\/api/, '/selvbetjening/api/api'),
            },
            '/selvbetjening/sanity': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/selvbetjening\/sanity/, '/selvbetjening/sanity'),
            },
        },
    },
})
