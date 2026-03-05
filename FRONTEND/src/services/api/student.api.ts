import axiosInstance from '../axios/authAxios';

export interface Student {
    _id: string;
    admissionNumber: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    bloodGroup?: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    email: string;
    guardianName: string;
    guardianPhone: string;
    guardianRelation?: string;
    program: string;
    batch: string;
    currentClass: string; // Added
    dateOfAdmission: string; // Added (Response comes as string/ISO)
    status?: string;
    photoUrl?: string;
    councilPosition?: string; // Added
    folder?: { _id: string; title: string; type: 'file' | 'link'; url: string; addedAt: string }[];
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateStudentDto {
    admissionNumber: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    dateOfAdmission: string; // Added
    currentClass: string; // Added
    gender: string;
    bloodGroup?: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    email: string;
    guardianName: string;
    guardianPhone: string;
    guardianRelation?: string;
    program: string;
    batch: string;
    status?: string;
    photoUrl?: string;
    councilPosition?: string; // Added
}

export interface UpdateStudentDto extends Partial<CreateStudentDto> { }

const studentApi = {
    async getStudents(query?: any): Promise<Student[]> {
        const response = await axiosInstance.get('/student', { params: query });
        return response.data;
    },

    // Public endpoint for council members
    async getCouncilMembers(): Promise<Student[]> {
        const response = await axiosInstance.get('/public/student/council');
        return response.data;
    },

    async getStudent(id: string): Promise<Student> {
        const response = await axiosInstance.get(`/student/${id}`);
        return response.data;
    },

    async getCurrentStudent(): Promise<Student> {
        const response = await axiosInstance.get('/student/me');
        return response.data;
    },

    async createStudent(data: CreateStudentDto | FormData): Promise<Student> {
        const response = await axiosInstance.post('/student', data);
        return response.data;
    },

    async updateStudent(id: string, data: UpdateStudentDto | FormData): Promise<Student> {
        const response = await axiosInstance.patch(`/student/${id}`, data);
        return response.data;
    },

    async deleteStudent(id: string): Promise<void> {
        await axiosInstance.delete(`/student/${id}`);
    },

    async addFolderItemMe(data: any | FormData): Promise<Student> {
        const response = await axiosInstance.post('/student/me/folder', data);
        return response.data;
    },

    async removeFolderItemMe(itemId: string): Promise<Student> {
        const response = await axiosInstance.delete(`/student/me/folder/${itemId}`);
        return response.data;
    },

    async addFolderItem(id: string, data: any | FormData): Promise<Student> {
        const response = await axiosInstance.post(`/student/${id}/folder`, data);
        return response.data;
    },

    async removeFolderItem(id: string, itemId: string): Promise<Student> {
        const response = await axiosInstance.delete(`/student/${id}/folder/${itemId}`);
        return response.data;
    }
};

export default studentApi;
