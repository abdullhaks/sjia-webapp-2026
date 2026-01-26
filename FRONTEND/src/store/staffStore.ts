import { create } from 'zustand';
import staffApi, { Staff, CreateStaffDto, UpdateStaffDto } from '../services/api/staff.api';

interface StaffState {
    staff: Staff[];
    currentStaff: Staff | null;
    loading: boolean;
    error: string | null;
    fetchStaff: (query?: any) => Promise<void>;
    fetchCurrentStaff: () => Promise<Staff>;
    createStaff: (data: CreateStaffDto | FormData) => Promise<Staff>;
    updateStaff: (id: string, data: UpdateStaffDto | FormData) => Promise<Staff>;
    deleteStaff: (id: string) => Promise<void>;
    clearError: () => void;
}

export const useStaffStore = create<StaffState>((set) => ({
    staff: [],
    currentStaff: null,
    loading: false,
    error: null,

    fetchStaff: async (query?: any) => {
        set({ loading: true, error: null });
        try {
            const staff = await staffApi.getStaff(query);
            set({ staff, loading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch staff',
                loading: false,
            });
        }
    },

    fetchCurrentStaff: async () => {
        set({ loading: true, error: null });
        try {
            const currentStaff = await staffApi.getCurrentStaff();
            set({ currentStaff, loading: false });
            return currentStaff;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch staff profile',
                loading: false,
            });
            throw error;
        }
    },

    createStaff: async (data: CreateStaffDto | FormData) => {
        set({ loading: true, error: null });
        try {
            const newStaff = await staffApi.createStaff(data);
            set((state) => ({
                staff: [...state.staff, newStaff],
                loading: false,
            }));
            return newStaff;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to create staff',
                loading: false,
            });
            throw error;
        }
    },

    updateStaff: async (id: string, data: UpdateStaffDto | FormData) => {
        set({ loading: true, error: null });
        try {
            const updatedStaff = await staffApi.updateStaff(id, data);
            set((state) => ({
                staff: state.staff.map((s) =>
                    s._id === id ? updatedStaff : s
                ),
                loading: false,
            }));
            return updatedStaff;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to update staff',
                loading: false,
            });
            throw error;
        }
    },

    deleteStaff: async (id: string) => {
        set({ loading: true, error: null });
        try {
            await staffApi.deleteStaff(id);
            set((state) => ({
                staff: state.staff.filter((s) => s._id !== id),
                loading: false,
            }));
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to delete staff',
                loading: false,
            });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
}));
