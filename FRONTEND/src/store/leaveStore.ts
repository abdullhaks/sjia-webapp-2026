import { create } from 'zustand';
import leaveApi, { Leave, CreateLeaveDto } from '../services/api/leave.api';

interface LeaveState {
    leaves: Leave[];
    loading: boolean;
    error: string | null;

    fetchMyLeaves: () => Promise<void>;
    fetchAllLeaves: (status?: string) => Promise<void>;
    createLeave: (data: CreateLeaveDto) => Promise<void>;
    updateLeaveStatus: (id: string, status: string, rejectionReason?: string) => Promise<void>;
    clearError: () => void;
}

export const useLeaveStore = create<LeaveState>((set) => ({
    leaves: [],
    loading: false,
    error: null,

    fetchMyLeaves: async () => {
        set({ loading: true, error: null });
        try {
            const leaves = await leaveApi.getMyLeaves();
            set({ leaves, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch leaves', loading: false });
        }
    },

    fetchAllLeaves: async (status) => {
        set({ loading: true, error: null });
        try {
            const leaves = await leaveApi.getAllLeaves(status);
            set({ leaves, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch leaves', loading: false });
        }
    },

    createLeave: async (data) => {
        set({ loading: true, error: null });
        try {
            const newLeave = await leaveApi.createLeave(data);
            set((state) => ({ leaves: [newLeave, ...state.leaves], loading: false }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to create leave', loading: false });
            throw error;
        }
    },

    updateLeaveStatus: async (id, status, reason) => {
        set({ loading: true, error: null });
        try {
            const updated = await leaveApi.updateLeaveStatus(id, status, reason);
            set((state) => ({
                leaves: state.leaves.map((l) => (l._id === id ? updated : l)),
                loading: false,
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to update leave status', loading: false });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
}));
