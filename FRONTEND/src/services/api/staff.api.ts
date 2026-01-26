import axiosInstance from '../axios/authAxios';

export interface Staff {
    _id: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    designation: string;
    department?: string;
    joiningDate: string;
    qualification?: string;
    experience?: string;
    salary?: number;
    address: string;
    city: string;
    state: string;
    pincode: string;
    status?: string;
    photoUrl?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateStaffDto {
    employeeId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    designation: string;
    department?: string;
    joiningDate: string;
    qualification?: string;
    experience?: string;
    salary?: number;
    address: string;
    city: string;
    state: string;
    pincode: string;
    status?: string;
    photoUrl?: string;
}

export interface UpdateStaffDto extends Partial<CreateStaffDto> { }

const staffApi = {
    async getStaff(query?: any): Promise<Staff[]> {
        const response = await axiosInstance.get('/staff', { params: query });
        return response.data;
    },

    async getStaffMember(id: string): Promise<Staff> {
        const response = await axiosInstance.get(`/staff/${id}`);
        return response.data;
    },

    async getCurrentStaff(): Promise<Staff> {
        const response = await axiosInstance.get('/staff/me');
        return response.data;
    },

    async createStaff(data: CreateStaffDto | FormData): Promise<Staff> {
        const response = await axiosInstance.post('/staff', data);
        return response.data;
    },

    async updateStaff(id: string, data: UpdateStaffDto | FormData): Promise<Staff> {
        const response = await axiosInstance.patch(`/staff/${id}`, data);
        return response.data;
    },

    async deleteStaff(id: string): Promise<void> {
        await axiosInstance.delete(`/staff/${id}`);
    },
};

export default staffApi;
