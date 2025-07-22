import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const backendUrl = 'https://urbaneatsdelivery.online/';
console.log('backendUrl:', backendUrl, process.env.GOOGLE_MAPS_API_KEY);

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    define: {
        'process.env': {
            BACKEND_URL: backendUrl,
            GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
            API_KEY: process.env.API_KEY,
            AUTH_DOMAIN: process.env.AUTH_DOMAIN || 'urbaneats-6ba52.firebaseapp.com',
            PROJECT_ID: process.env.PROJECT_ID || 'urbaneats-6ba52',
            STORAGE_BUCKET: process.env.STORAGE_BUCKET || 'urbaneats-6ba52.firebasestorage.app',
            MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
            APP_ID: process.env.APP_ID,
            MEASUREMENT_ID: process.env.MEASUREMENT_ID,
            RAZORPAY_KEY: process.env.RAZORPAY_KEY,
        }
    }
})
