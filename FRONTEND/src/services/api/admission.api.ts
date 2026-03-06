import axiosInstance from '../axios/authAxios';
import axios from 'axios';

export interface Admission {
    _id: string;
    applicationId: string;
    studentName: string;
    parentName: string;
    phone: string;
    email: string;
    age: number;
    preferredClass: string;
    place: string;
    status: 'Pending' | 'InterviewScheduled' | 'Approved' | 'Rejected';
    interviewDate?: string;
    rejectionReason?: string;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateAdmissionDto {
    studentName: string;
    parentName: string;
    phone: string;
    email: string;
    age: number;
    preferredClass: string;
    place: string;
}

export interface UpdateAdmissionStatusDto {
    status: 'InterviewScheduled' | 'Approved' | 'Rejected';
    interviewDate?: string;
    rejectionReason?: string;
    notes?: string;
}

import { API_URL } from '../../config/env';

const admissionApi = {
    // Public: submit application (no auth needed)
    async submitPublicApplication(data: CreateAdmissionDto): Promise<Admission> {
        const baseUrl = axiosInstance.defaults.baseURL || API_URL || '';
        const response = await axios.post(`${baseUrl}/admission/apply`, data);
        return response.data;
    },

    // Admin: get all applications
    async getAdmissions(query?: any): Promise<Admission[]> {
        const response = await axiosInstance.get('/admission', { params: query });
        return response.data;
    },

    async createAdmission(data: CreateAdmissionDto): Promise<Admission> {
        const response = await axiosInstance.post('/admission/apply', data);
        return response.data;
    },

    async getAdmission(id: string): Promise<Admission> {
        const response = await axiosInstance.get(`/admission/${id}`);
        return response.data;
    },

    async updateStatus(id: string, data: UpdateAdmissionStatusDto): Promise<Admission> {
        const response = await axiosInstance.patch(`/admission/${id}/status`, data);
        return response.data;
    },

    async deleteAdmission(id: string): Promise<void> {
        await axiosInstance.delete(`/admission/${id}`);
    },
};

export default admissionApi;
