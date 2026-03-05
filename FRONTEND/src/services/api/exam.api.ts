import axiosInstance from '../axios/authAxios';

export interface Exam {
    _id: string;
    title: string;
    type: string;
    startDate: string;
    endDate: string;
    status: string;
    classes: string[];
    schedule: {
        subjectName: string;
        date: string;
        startTime: string;
        duration: string;
        maxMarks?: number;
    }[];
    description?: string;
}

export interface StudentExam extends Exam {
    daysLeft: number;
}

const examApi = {
    async getMyUpcomingExams(): Promise<StudentExam[]> {
        const response = await axiosInstance.get('/exams/public');
        return response.data;
    },

    async getAllExams(status?: string): Promise<Exam[]> {
        const params = status ? { status } : {};
        const response = await axiosInstance.get('/exams', { params });
        return response.data;
    },

    async createExam(data: any): Promise<Exam> {
        const response = await axiosInstance.post('/exams', data);
        return response.data;
    },

    async updateExamStatus(id: string, status: string): Promise<Exam> {
        const response = await axiosInstance.patch(`/exams/${id}/status`, { status });
        return response.data;
    },

    async deleteExam(id: string): Promise<void> {
        await axiosInstance.delete(`/exams/${id}`);
    }
};

export default examApi;
