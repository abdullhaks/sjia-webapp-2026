import { create } from 'zustand';
import * as syllabusApi from '../services/api/syllabus.api';

interface SyllabusState {
    syllabi: syllabusApi.Syllabus[];
    loading: boolean;
    error: string | null;
    uploadProgress: number;

    fetchSyllabi: (filters?: any) => Promise<void>;
    createSyllabus: (data: syllabusApi.CreateSyllabusDto) => Promise<void>;
    updateSyllabus: (id: string, data: syllabusApi.UpdateSyllabusDto) => Promise<void>;
    deleteSyllabus: (id: string) => Promise<void>;
    uploadFile: (file: File) => Promise<{ url: string; filename: string; originalName: string; size: number }>;
    clearError: () => void;
}

export const useSyllabusStore = create<SyllabusState>((set) => ({
    syllabi: [],
    loading: false,
    error: null,
    uploadProgress: 0,

    fetchSyllabi: async (filters) => {
        set({ loading: true, error: null });
        try {
            const syllabi = await syllabusApi.getSyllabi(filters);
            set({ syllabi, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch syllabi', loading: false });
        }
    },

    createSyllabus: async (data) => {
        set({ loading: true, error: null });
        try {
            const newSyllabus = await syllabusApi.createSyllabus(data);
            set((state) => ({ syllabi: [newSyllabus, ...state.syllabi], loading: false }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to create syllabus', loading: false });
            throw error;
        }
    },

    updateSyllabus: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const updated = await syllabusApi.updateSyllabus(id, data);
            set((state) => ({
                syllabi: state.syllabi.map((s) => (s._id === id ? updated : s)),
                loading: false,
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to update syllabus', loading: false });
            throw error;
        }
    },

    deleteSyllabus: async (id) => {
        set({ loading: true, error: null });
        try {
            await syllabusApi.deleteSyllabus(id);
            set((state) => ({
                syllabi: state.syllabi.filter((s) => s._id !== id),
                loading: false,
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to delete syllabus', loading: false });
            throw error;
        }
    },

    uploadFile: async (file) => {
        set({ uploadProgress: 0, error: null });
        try {
            const result = await syllabusApi.uploadSyllabusFile(file);
            set({ uploadProgress: 100 });
            return result;
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to upload file', uploadProgress: 0 });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
}));
