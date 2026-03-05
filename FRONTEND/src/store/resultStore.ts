import { create } from 'zustand';
import resultApi, { Result } from '../services/api/result.api';

interface ResultState {
    results: Result[];
    toppers: Result[];
    loading: boolean;
    error: string | null;

    fetchMyResults: () => Promise<void>;
    fetchAllResults: () => Promise<void>;
    fetchToppers: () => Promise<void>;
    createResult: (data: any) => Promise<any>;
    searchPublicResults: (query: string) => Promise<Result[]>;
    clearError: () => void;
}

export const useResultStore = create<ResultState>((set) => ({
    results: [],
    toppers: [],
    loading: false,
    error: null,

    fetchMyResults: async () => {
        set({ loading: true, error: null });
        try {
            const results = await resultApi.getMyResults();
            set({ results: Array.isArray(results) ? results : [], loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch results', loading: false });
        }
    },

    fetchAllResults: async () => {
        set({ loading: true, error: null });
        try {
            const results = await resultApi.getAllResults();
            set({ results: Array.isArray(results) ? results : [], loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch results', loading: false });
        }
    },

    fetchToppers: async () => {
        set({ loading: true, error: null });
        try {
            const toppers = await resultApi.getTopPerformers();
            set({ toppers: Array.isArray(toppers) ? toppers : [], loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch toppers', loading: false });
        }
    },

    createResult: async (data: any) => {
        set({ loading: true, error: null });
        try {
            const newResult = await resultApi.createResult(data);
            set({ loading: false });
            return newResult;
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to save result', loading: false });
            throw error;
        }
    },

    searchPublicResults: async (query: string) => {
        set({ loading: true, error: null });
        try {
            const results = await resultApi.searchPublicResults(query);
            set({ loading: false });
            return results;
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to search results', loading: false });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
}));
