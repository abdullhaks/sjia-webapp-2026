import axios, { AxiosInstance } from 'axios';

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance for health checks
const healthAxios: AxiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 30000, // 30 seconds timeout for server wake-up
    headers: {
        'Content-Type': 'application/json',
    },
});

export default healthAxios;
