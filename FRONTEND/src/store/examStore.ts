import { create } from 'zustand';
import examApi, { Exam, StudentExam } from '../services/api/exam.api';

interface ExamState {
    exams: Exam[];
    upcomingExams: StudentExam[];
    loading: boolean;
    error: string | null;

    fetchUpcomingExams: () => Promise<void>;
    fetchAllExams: (status?: string) => Promise<void>;
    createExam: (data: any) => Promise<void>;
    deleteExam: (id: string) => Promise<void>;
    clearError: () => void;
}

export const useExamStore = create<ExamState>((set) => ({
    exams: [],
    upcomingExams: [],
    loading: false,
    error: null,

    fetchUpcomingExams: async () => {
        set({ loading: true, error: null });
        try {
            const upcomingExams = await examApi.getMyUpcomingExams();
            set({ upcomingExams, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch upcoming exams', loading: false });
        }
    },

    fetchAllExams: async (status) => {
        set({ loading: true, error: null });
        try {
            const exams = await examApi.getAllExams(status);
            set({ exams, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch exams', loading: false });
        }
    },

    createExam: async (data: any) => {
        set({ loading: true, error: null });
        try {
            const newExam = await examApi.createExam(data);
            set((state) => ({ exams: [...state.exams, newExam], loading: false }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to create exam', loading: false });
            throw error;
        }
    },

    deleteExam: async (id: string) => {
        set({ loading: true, error: null });
        try {
            await examApi.deleteExam(id);
            set((state) => ({
                exams: state.exams.filter((e) => e._id !== id),
                loading: false,
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to delete exam', loading: false });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
}));
