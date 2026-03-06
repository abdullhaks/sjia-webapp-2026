import axios from 'axios';
import authAxios from '../axios/authAxios';
import { useAuthStore, User } from '../../store/authStore';

import { API_URL } from '../../config/env';

export interface LoginCredentials {
    identifier: string;
    password: string;
}

// Backend now returns just the user object, tokens are in cookies
export type LoginResponse = User;

class AuthService {
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        const response = await axios.post<LoginResponse>(
            `${API_URL}/auth/login`,
            credentials,
            { withCredentials: true }
        );
        return response.data;
    }

    async logout(): Promise<void> {
        try {
            await authAxios.post('/auth/logout');
        } catch (error) {
            console.warn('Logout API call failed, but clearing local state.', error);
        } finally {
            useAuthStore.getState().clearAuth();
        }
    }

    async refreshToken(): Promise<void> {
        // We probably don't need this method exposed directly anymore as axios interceptor handles it,
        // but if we do, it shouldn't take args.
        await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
    }

    async getCurrentUser() {
        // No manual token attachment needed
        const response = await axios.get(`${API_URL}/auth/me`, {
            withCredentials: true
            // headers: { Authorization... } // Not needed
        });
        return response.data;
    }

    async forgotPassword(email: string): Promise<{ message: string }> {
        const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
        return response.data;
    }

    async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
        const response = await axios.post(`${API_URL}/auth/reset-password`, { token, newPassword });
        return response.data;
    }

    async changePassword(data: any): Promise<{ message: string }> {
        const response = await axios.post(`${API_URL}/auth/change-password`, data, { withCredentials: true });
        return response.data;
    }

    async updateProfile(formData: FormData): Promise<User> {
        const response = await axios.patch(`${API_URL}/users/profile`, formData, {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    }
}

export default new AuthService();
