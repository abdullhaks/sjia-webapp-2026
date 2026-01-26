import axiosInstance from '../axios/authAxios';

export interface Leave {
    _id: string;
    applicantId: any;
    firstName: string;
    lastName: string;
    role: string;
    type: string;
    startDate: string;
    endDate: string;
    reason: string;
    status: string;
    rejectionReason?: string;
    createdAt?: string;
}

export interface CreateLeaveDto {
    type: string;
    startDate: string;
    endDate: string;
    reason: string;
    role?: string;
}

const leaveApi = {
    async createLeave(data: CreateLeaveDto): Promise<Leave> {
        const response = await axiosInstance.post('/leave/apply', data);
        return response.data;
    },

    async getMyLeaves(): Promise<Leave[]> {
        const response = await axiosInstance.get('/leave/my-leaves');
        return response.data;
    },

    async getAllLeaves(status?: string): Promise<Leave[]> {
        const params = status ? { status } : {};
        const response = await axiosInstance.get('/leave/requests', { params });
        return response.data;
    },

    async updateLeaveStatus(id: string, status: string, rejectionReason?: string): Promise<Leave> {
        const response = await axiosInstance.patch(`/leave/${id}/status`, { status, rejectionReason });
        return response.data;
    }
};

export default leaveApi;
