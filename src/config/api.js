// API Configuration for split deployment
// Backend on Render, Frontend on Vercel

const API_CONFIG = {
    // Set this to your Render backend URL after deployment
    // Example: 'https://repair-iq-backend.onrender.com'
    BASE_URL: window.location.hostname === 'localhost' 
        ? '' // Use relative paths for local development
        : 'https://repair-iq-backend-production.up.railway.app',
    
    // WebSocket URL (same host for local, full URL for production)
    WS_URL: window.location.hostname === 'localhost'
        ? `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`
        : 'wss://repair-iq-backend-production.up.railway.app'
};

export default API_CONFIG;