import axiosInstance from '../axios/authAxios';

export interface DashboardStat {
    title: string;
    value: number;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    bgGradient?: string;
    gradient?: string;
    icon?: any;
    suffix?: string;
}

export interface Activity {
    id: string;
    user: string;
    action: string;
    time: string;
    type: 'admission' | 'leave' | 'system' | 'finance';
}

export interface ChartData {
    name: string;
    students?: number;
    present?: number;
}

export interface DashboardResponse {
    stats: DashboardStat[];
    admissionTrend: ChartData[];
    weeklyAttendance: ChartData[];
    recentActivities: Activity[];
}

const dashboardApi = {
    async getStats(): Promise<DashboardResponse> {
        const response = await axiosInstance.get('/dashboard/stats');
        return response.data;
    },
};

export default dashboardApi;
