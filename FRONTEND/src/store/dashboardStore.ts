import { create } from 'zustand';
import dashboardApi, { DashboardStat, Activity, ChartData } from '../services/api/dashboard.api';

interface DashboardState {
    stats: DashboardStat[];
    admissionTrend: ChartData[];
    weeklyAttendance: ChartData[];
    recentActivities: Activity[];
    loading: boolean;
    error: string | null;
    fetchStats: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
    stats: [],
    admissionTrend: [],
    weeklyAttendance: [],
    recentActivities: [],
    loading: false,
    error: null,

    fetchStats: async () => {
        set({ loading: true, error: null });
        try {
            const data = await dashboardApi.getStats();
            set({
                stats: data.stats,
                admissionTrend: data.admissionTrend,
                weeklyAttendance: data.weeklyAttendance,
                recentActivities: data.recentActivities,
                loading: false
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch dashboard stats',
                loading: false,
            });
        }
    },
}));
