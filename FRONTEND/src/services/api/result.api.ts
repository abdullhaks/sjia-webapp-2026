import axiosInstance from '../axios/authAxios';

export interface Result {
    _id: string;
    examId: any;
    studentId: any;
    marks: { subjectName: string; obtainedMarks: number; maxMarks: number; grade?: string }[];
    totalObtainedMarks: number;
    totalMaxMarks: number;
    percentage: number;
    status: string;
}

const resultApi = {
    async getAllResults(): Promise<Result[]> {
        const response = await axiosInstance.get('/results');
        return response.data;
    },
    async getMyResults(): Promise<Result[]> {
        const response = await axiosInstance.get('/result/my/history');
        return response.data;
    },

    async createResult(data: any): Promise<Result> {
        const response = await axiosInstance.post('/results', data);
        return response.data;
    },

    async getTopPerformers(limit: number = 5): Promise<Result[]> {
        const response = await axiosInstance.get('/public/result/toppers', { params: { limit } });
        return response.data;
    },

    async searchPublicResults(query: string): Promise<Result[]> {
        const response = await axiosInstance.get('/public/result/search', { params: { q: query } });
        return response.data;
    }
};

export default resultApi;
