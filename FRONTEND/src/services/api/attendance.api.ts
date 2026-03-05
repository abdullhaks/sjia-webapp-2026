import axiosInstance from '../axios/authAxios';

export interface Attendance {
    _id: string;
    studentId: string;
    date: string;
    status: 'Present' | 'Absent' | 'Late' | 'Excused';
    class: string;
    markedBy: string;
}

export interface AttendanceStats {
    percentage: number;
    present: number;
    total: number;
}

export interface CreateAttendanceDto {
    studentId: string;
    date: string;
    status: string;
    class: string;
}

const attendanceApi = {
    async markAttendance(data: CreateAttendanceDto): Promise<Attendance> {
        const response = await axiosInstance.post('/attendance', data);
        return response.data;
    },

    async markBulkAttendance(data: CreateAttendanceDto[]): Promise<void> {
        await axiosInstance.post('/attendance/bulk', data);
    },

    async getStudentAttendance(studentId: string, month?: number, year?: number): Promise<Attendance[]> {
        const params: any = {};
        if (month) params.month = month;
        if (year) params.year = year;

        const response = await axiosInstance.get(`/attendance/student/${studentId}`, { params });
        return response.data;
    },

    async getAttendanceStats(studentId: string): Promise<AttendanceStats> {
        const response = await axiosInstance.get(`/attendance/stats/${studentId}`);
        return response.data;
    }
};

export default attendanceApi;
