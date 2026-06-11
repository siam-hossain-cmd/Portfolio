import axios from 'axios';
import API_URL from './api';

const axiosInstance = axios.create({
    baseURL: API_URL
});

// Request interceptor to inject JWT token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
