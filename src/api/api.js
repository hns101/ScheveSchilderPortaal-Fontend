import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

// Client for PUBLIC requests
// Use this for login, register, forgot-password, etc.
export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Client for PRIVATE/AUTHENTICATED requests
export const authApiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Use an interceptor to automatically add the token to private requests
authApiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
