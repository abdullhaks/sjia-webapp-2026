import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

import { API_URL } from '../../config/env';

// Create axios instance for authenticated requests
const authAxios = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor - No need to attach token manually with cookies
authAxios.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
authAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't retried yet and it's not a public endpoint
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Optional: Skip refresh for specific public endpoints if needed, but backend allow-list should handle it.
            // If we are getting 401 on a public endpoint (after backend fix), it means the token was sent and invalid?
            // Or the backend fix hasn't propagated.
            // But to be safe, if refresh fails, we should NOT redirect if we are on a public page?
            // Actually, if refresh fails, we just clear auth.

            try {
                // Refresh the access token (cookies handled automatically)
                await axios.post(`${API_URL}/auth/refresh`, {}, {
                    withCredentials: true
                });

                // Retry the original request
                return authAxios(originalRequest);
            } catch (refreshError) {
                useAuthStore.getState().clearAuth();
                // Do NOT redirect window.location here as it causes loops on public pages
                // Just reject the promise so the component handles the error (e.g. shows login button state)
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default authAxios;
