import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authAxios from '../services/axios/authAxios';

export interface User {
    id: string;
    email: string;
    role: 'superAdmin' | 'superadmin' | 'staff' | 'student';
    firstName: string;
    lastName: string;
    photoUrl?: string;
    studentId?: string;
    class?: string;
}

interface AuthState {
    superAdmin: User | null;
    staff: User | null;
    student: User | null;
    user: User | null;
    isAuthenticated: boolean;
    setAuth: (user: User) => void;
    clearAuth: () => void;
    checkAuth: () => Promise<void>;
}

// Create BroadcastChannel for cross-tab sync
const authChannel = new BroadcastChannel('auth_channel');

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => {
            // Listen for logout events from other tabs
            authChannel.onmessage = (event) => {
                if (event.data === 'logout') {
                    set({ superAdmin: null, staff: null, student: null, user: null, isAuthenticated: false });
                }
            };

            return {
                superAdmin: null,
                staff: null,
                student: null,
                user: null,
                isAuthenticated: false,
                setAuth: (user) => {
                    const role = user.role;
                    if (role === 'superAdmin' || role === 'superadmin') {
                        const normalizedUser = { ...user, role: 'superAdmin' as const };
                        set({ superAdmin: normalizedUser, staff: null, student: null, user: normalizedUser, isAuthenticated: true });
                    } else if (role === 'staff') {
                        set({ staff: user, superAdmin: null, student: null, user: user, isAuthenticated: true });
                    } else if (role === 'student') {
                        set({ student: user, superAdmin: null, staff: null, user: user, isAuthenticated: true });
                    }
                },
                clearAuth: () => {
                    // Notify other tabs
                    authChannel.postMessage('logout');
                    set({
                        superAdmin: null,
                        staff: null,
                        student: null,
                        user: null,
                        isAuthenticated: false,
                    });
                },
                checkAuth: async () => {
                    try {
                        const response = await authAxios.get('/auth/me');
                        const user = response.data;
                        if (user.role === 'superAdmin' || user.role === 'superadmin') {
                            const normalizedUser = { ...user, role: 'superAdmin' as const };
                            set({ superAdmin: normalizedUser, staff: null, student: null, user: normalizedUser, isAuthenticated: true });
                        } else if (user.role === 'staff') {
                            set({ staff: user, superAdmin: null, student: null, user: user, isAuthenticated: true });
                        } else if (user.role === 'student') {
                            set({ student: user, superAdmin: null, staff: null, user: user, isAuthenticated: true });
                        }
                    } catch (error: any) {
                        // Only clear auth if the server explicitly rejected the credentials (401)
                        if (error?.response?.status === 401) {
                            set({ superAdmin: null, staff: null, student: null, user: null, isAuthenticated: false });
                        }
                    }
                }
            };
        },
        {
            name: 'auth-storage',
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
                user: state.user,
                superAdmin: state.superAdmin,
                staff: state.staff,
                student: state.student
            }),
        }
    )
);
