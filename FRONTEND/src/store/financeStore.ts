
import { create } from 'zustand';
import financeApi, { FeeStructure, FeePayment, CreateFeeDto, RecordPaymentDto, FinanceStats } from '../services/api/finance.api';

interface FinanceState {
    fees: FeeStructure[];
    studentPayments: FeePayment[];
    stats: FinanceStats | null;
    loading: boolean;
    error: string | null;

    fetchFees: () => Promise<void>;
    createFee: (data: CreateFeeDto) => Promise<void>;
    fetchStudentPayments: (studentId: string) => Promise<void>;
    recordPayment: (data: RecordPaymentDto) => Promise<void>;
    fetchStats: () => Promise<void>;
    clearError: () => void;
}

export const useFinanceStore = create<FinanceState>((set) => ({
    fees: [],
    studentPayments: [],
    stats: null,
    loading: false,
    error: null,

    fetchFees: async () => {
        set({ loading: true, error: null });
        try {
            const fees = await financeApi.getFees();
            set({ fees, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch fees', loading: false });
        }
    },

    createFee: async (data) => {
        set({ loading: true, error: null });
        try {
            const newFee = await financeApi.createFee(data);
            set((state) => ({ fees: [...state.fees, newFee], loading: false }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to create fee', loading: false });
            throw error;
        }
    },

    fetchStudentPayments: async (studentId) => {
        set({ loading: true, error: null });
        try {
            const studentPayments = await financeApi.getStudentPayments(studentId);
            set({ studentPayments, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch payments', loading: false });
        }
    },

    recordPayment: async (data) => {
        set({ loading: true, error: null });
        try {
            const newPayment = await financeApi.recordPayment(data);
            set((state) => ({
                studentPayments: [newPayment, ...state.studentPayments],
                loading: false
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to record payment', loading: false });
            throw error;
        }
    },

    fetchStats: async () => {
        set({ loading: true, error: null });
        try {
            const stats = await financeApi.getStats();
            set({ stats, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch stats', loading: false });
        }
    },

    clearError: () => set({ error: null }),
}));
