// API Configuration
// In development: uses localhost
// In production: uses the environment variable VITE_API_URL

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default API_URL;
