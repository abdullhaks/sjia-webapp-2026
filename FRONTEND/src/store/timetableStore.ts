import { create } from 'zustand';
import * as timetableApi from '../services/api/timetable.api';

interface TimetableState {
    timetables: timetableApi.Timetable[];
    mySchedule: any[]; // Using any[] for now as it's a flattened structure
    loading: boolean;
    error: string | null;
    uploadProgress: number;

    fetchTimetables: (filters?: any) => Promise<void>;
    fetchMySchedule: () => Promise<void>;
    createTimetable: (data: timetableApi.CreateTimetableDto) => Promise<void>;
    updateTimetable: (id: string, data: timetableApi.UpdateTimetableDto) => Promise<void>;
    deleteTimetable: (id: string) => Promise<void>;
    uploadFile: (file: File) => Promise<{ url: string; filename: string; originalName: string; size: number }>;

    swapRequests: { sent: any[], received: any[] };
    fetchSwapRequests: () => Promise<void>;
    sendSwapRequest: (data: any) => Promise<void>;
    respondSwapRequest: (id: string, action: 'approve' | 'reject') => Promise<void>;

    clearError: () => void;
}

export const useTimetableStore = create<TimetableState>((set) => ({
    timetables: [],
    mySchedule: [],
    loading: false,
    error: null,
    uploadProgress: 0,

    fetchTimetables: async (filters) => {
        set({ loading: true, error: null });
        try {
            const timetables = await timetableApi.getTimetables(filters);
            set({ timetables, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch timetables', loading: false });
        }
    },

    fetchMySchedule: async () => {
        set({ loading: true, error: null });
        try {
            const mySchedule = await timetableApi.getMySchedule();
            set({ mySchedule, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch schedule', loading: false });
        }
    },

    createTimetable: async (data) => {
        set({ loading: true, error: null });
        try {
            const newTimetable = await timetableApi.createTimetable(data);
            set((state) => ({ timetables: [newTimetable, ...state.timetables], loading: false }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to create timetable', loading: false });
            throw error;
        }
    },

    updateTimetable: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const updated = await timetableApi.updateTimetable(id, data);
            set((state) => ({
                timetables: state.timetables.map((t) => (t._id === id ? updated : t)),
                loading: false,
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to update timetable', loading: false });
            throw error;
        }
    },

    deleteTimetable: async (id) => {
        set({ loading: true, error: null });
        try {
            await timetableApi.deleteTimetable(id);
            set((state) => ({
                timetables: state.timetables.filter((t) => t._id !== id),
                loading: false,
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to delete timetable', loading: false });
            throw error;
        }
    },

    uploadFile: async (file) => {
        set({ uploadProgress: 0, error: null });
        try {
            const result = await timetableApi.uploadTimetableFile(file);
            set({ uploadProgress: 100 });
            return result;
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to upload file', uploadProgress: 0 });
            throw error;
        }
    },

    swapRequests: { sent: [], received: [] },
    fetchSwapRequests: async () => {
        set({ loading: true, error: null });
        try {
            const data = await timetableApi.getMySwapRequests();
            set({ swapRequests: data, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch swap requests', loading: false });
        }
    },
    sendSwapRequest: async (data: any) => {
        set({ loading: true, error: null });
        try {
            await timetableApi.requestSwap(data);
            const swapData = await timetableApi.getMySwapRequests();
            set({ swapRequests: swapData, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to send request', loading: false });
            throw error;
        }
    },
    respondSwapRequest: async (id: string, action: 'approve' | 'reject') => {
        set({ loading: true, error: null });
        try {
            await timetableApi.respondToSwap(id, action);
            const swapData = await timetableApi.getMySwapRequests();
            const mySchedule = await timetableApi.getMySchedule(); // Refresh schedule alongside
            set({ swapRequests: swapData, mySchedule, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to respond', loading: false });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
}));
