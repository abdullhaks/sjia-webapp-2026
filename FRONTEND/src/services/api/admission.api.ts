import axiosInstance from '../axios/authAxios';

export interface Admission {
    _id: string;
    applicationId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    program: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    guardianName: string;
    guardianPhone: string;
    guardianRelation?: string;
    previousSchooling?: {
        schoolName: string;
        lastClass: string;
        year: number;
        percentage: number;
    };
    status: 'Pending' | 'Approved' | 'Rejected';
    rejectionReason?: string;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateAdmissionDto {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    program: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    guardianName: string;
    guardianPhone: string;
    guardianRelation?: string;
    previousSchooling?: {
        schoolName: string;
        lastClass: string;
        year: number;
        percentage: number;
    };
}

export interface UpdateAdmissionStatusDto {
    status: 'Approved' | 'Rejected';
    rejectionReason?: string;
    notes?: string;
}

const admissionApi = {
    async getAdmissions(query?: any): Promise<Admission[]> {
        const response = await axiosInstance.get('/admission', { params: query });
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
