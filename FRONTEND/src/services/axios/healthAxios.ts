import axios, { AxiosInstance } from 'axios';

// Get API URL from environment variables
import { API_URL } from '../../config/env';

// Create axios instance for health checks
const healthAxios: AxiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 30000, // 30 seconds timeout for server wake-up
    headers: {
        'Content-Type': 'application/json',
    },
});

export default healthAxios;
