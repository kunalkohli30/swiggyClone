import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {
        BACKEND_URL: 'http://localhost:9000/',
        GOOGLE_MAPS_API_KEY: 'AIzaSyBuccx-DCWnOr0ww2kqWvsgxaDdpj9avxA'
    }
}
})
