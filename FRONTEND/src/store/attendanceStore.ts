import { create } from 'zustand';
import attendanceApi, { Attendance, AttendanceStats, CreateAttendanceDto } from '../services/api/attendance.api';

interface AttendanceState {
    attendanceHistory: Attendance[];
    stats: AttendanceStats | null;
    loading: boolean;
    error: string | null;

    fetchStudentAttendance: (studentId: string, month?: number, year?: number) => Promise<void>;
    fetchAttendanceStats: (studentId: string) => Promise<void>;
    markAttendance: (data: CreateAttendanceDto) => Promise<void>;
    clearError: () => void;
}

export const useAttendanceStore = create<AttendanceState>((set) => ({
    attendanceHistory: [],
    stats: null,
    loading: false,
    error: null,

    fetchStudentAttendance: async (studentId, month, year) => {
        set({ loading: true, error: null });
        try {
            const attendanceHistory = await attendanceApi.getStudentAttendance(studentId, month, year);
            set({ attendanceHistory, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch attendance', loading: false });
        }
    },

    fetchAttendanceStats: async (studentId) => {
        set({ loading: true, error: null });
        try {
            const stats = await attendanceApi.getAttendanceStats(studentId);
            set({ stats, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch attendance stats', loading: false });
        }
    },

    markAttendance: async (data) => {
        set({ loading: true, error: null });
        try {
            await attendanceApi.markAttendance(data);
            set({ loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to mark attendance', loading: false });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
}));
