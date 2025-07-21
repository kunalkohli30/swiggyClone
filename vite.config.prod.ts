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
            GOOGLE_MAPS_API_KEY: JSON.stringify(process.env.GOOGLE_MAPS_API_KEY),
            API_KEY: JSON.stringify(process.env.API_KEY),
            AUTH_DOMAIN: JSON.stringify(process.env.AUTH_DOMAIN || 'urbaneats-6ba52.firebaseapp.com'),
            PROJECT_ID: JSON.stringify(process.env.PROJECT_ID || 'urbaneats-6ba52'),
            STORAGE_BUCKET: JSON.stringify(process.env.STORAGE_BUCKET || 'urbaneats-6ba52.firebasestorage.app'),
            MESSAGING_SENDER_ID: JSON.stringify(process.env.MESSAGING_SENDER_ID),
            APP_ID: JSON.stringify(process.env.APP_ID),
            MEASUREMENT_ID: JSON.stringify(process.env.MEASUREMENT_ID),
            RAZORPAY_KEY: JSON.stringify(process.env.RAZORPAY_KEY),
        }
    }
})
