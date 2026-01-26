import axios from 'axios';
import { useAuthStore, User } from '../../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface LoginCredentials {
    email: string;
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
        // Just hit the endpoint to clear cookies
        await axios.post(
            `${API_URL}/auth/logout`,
            {},
            {
                withCredentials: true
            }
        );
        useAuthStore.getState().clearAuth();
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
}

export default new AuthService();
