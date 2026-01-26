import axiosInstance from '../axios/authAxios';

export interface Notice {
    _id: string;
    title: string;
    content: string;
    date: string;
    priority: 'high' | 'medium' | 'low';
    audience: 'all' | 'student' | 'staff';
    isActive: boolean;
    createdBy?: string;
}

export interface CreateNoticeDto {
    title: string;
    content: string;
    date: string;
    priority?: string;
    audience?: string;
}

const noticeApi = {
    async getAllNotices(audience?: string): Promise<Notice[]> {
        const params = audience ? { audience } : {};
        const response = await axiosInstance.get('/notice', { params });
        return response.data;
    },

    async createNotice(data: CreateNoticeDto): Promise<Notice> {
        const response = await axiosInstance.post('/notice', data);
        return response.data;
    },

    async deleteNotice(id: string): Promise<void> {
        await axiosInstance.delete(`/notice/${id}`);
    }
};

export default noticeApi;
