import { create } from 'zustand';
import admissionApi, { Admission, UpdateAdmissionStatusDto } from '../services/api/admission.api';

interface AdmissionState {
    admissions: Admission[];
    currentAdmission: Admission | null;
    loading: boolean;
    error: string | null;
    fetchAdmissions: (query?: any) => Promise<void>;
    fetchAdmission: (id: string) => Promise<Admission>;
    updateAdmissionStatus: (id: string, data: UpdateAdmissionStatusDto) => Promise<Admission>;
    deleteAdmission: (id: string) => Promise<void>;
    clearError: () => void;
}

export const useAdmissionStore = create<AdmissionState>((set) => ({
    admissions: [],
    currentAdmission: null,
    loading: false,
    error: null,

    fetchAdmissions: async (query?: any) => {
        set({ loading: true, error: null });
        try {
            const admissions = await admissionApi.getAdmissions(query);
            set({ admissions, loading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch admissions',
                loading: false,
            });
        }
    },

    fetchAdmission: async (id: string) => {
        set({ loading: true, error: null });
        try {
            const currentAdmission = await admissionApi.getAdmission(id);
            set({ currentAdmission, loading: false });
            return currentAdmission;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch admission details',
                loading: false,
            });
            throw error;
        }
    },

    updateAdmissionStatus: async (id: string, data: UpdateAdmissionStatusDto) => {
        set({ loading: true, error: null });
        try {
            const updatedAdmission = await admissionApi.updateStatus(id, data);
            set((state) => ({
                admissions: state.admissions.map((a) =>
                    a._id === id ? updatedAdmission : a
                ),
                currentAdmission:
                    state.currentAdmission?._id === id ? updatedAdmission : state.currentAdmission,
                loading: false,
            }));
            return updatedAdmission;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to update status',
                loading: false,
            });
            throw error;
        }
    },

    deleteAdmission: async (id: string) => {
        set({ loading: true, error: null });
        try {
            await admissionApi.deleteAdmission(id);
            set((state) => ({
                admissions: state.admissions.filter((a) => a._id !== id),
                loading: false,
            }));
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to delete admission',
                loading: false,
            });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
}));
