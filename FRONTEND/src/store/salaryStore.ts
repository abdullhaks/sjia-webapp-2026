import { create } from 'zustand';
import api from '../services/axios/authAxios';

export interface Salary {
    _id: string;
    staffId: any;
    month: string;
    baseSalary: number;
    deductions: number;
    bonuses: number;
    netSalary: number;
    status: string;
    paymentDate?: string;
    paymentMethod?: string;
}

interface SalaryState {
    salaries: Salary[];
    loading: boolean;
    error: string | null;
    fetchSalaries: () => Promise<void>;
    fetchStaffSalaries: (staffId: string) => Promise<void>;
    createSalary: (data: any) => Promise<void>;
    updateSalary: (id: string, data: any) => Promise<void>;
    deleteSalary: (id: string) => Promise<void>;
}

export const useSalaryStore = create<SalaryState>((set, get) => ({
    salaries: [],
    loading: false,
    error: null,

    fetchSalaries: async () => {
        set({ loading: true, error: null });
        try {
            const response = await api.get('/salary');
            set({ salaries: response.data, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch salaries', loading: false });
        }
    },

    fetchStaffSalaries: async (staffId: string) => {
        set({ loading: true, error: null });
        try {
            const response = await api.get(`/salary/staff/${staffId}`);
            set({ salaries: response.data, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch staff salaries', loading: false });
        }
    },

    createSalary: async (data: any) => {
        set({ loading: true, error: null });
        try {
            await api.post('/salary', data);
            await get().fetchSalaries();
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to create salary', loading: false });
            throw error;
        }
    },

    updateSalary: async (id: string, data: any) => {
        set({ loading: true, error: null });
        try {
            await api.put(`/salary/${id}`, data);
            await get().fetchSalaries();
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to update salary', loading: false });
            throw error;
        }
    },

    deleteSalary: async (id: string) => {
        set({ loading: true, error: null });
        try {
            await api.delete(`/salary/${id}`);
            await get().fetchSalaries();
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to delete salary', loading: false });
            throw error;
        }
    }
}));
