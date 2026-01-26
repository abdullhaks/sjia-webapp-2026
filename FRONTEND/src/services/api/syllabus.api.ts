import axiosInstance from '../axios/authAxios';

export interface Syllabus {
    _id: string;
    subject: string;
    class: string;
    program?: string;
    fileUrl: string;
    fileName: string;
    fileSize: number;
    description?: string;
    academicYear: string;
    term?: string;
    uploadedBy: {
        _id: string;
        firstName: string;
        lastName: string;
    };
    uploadDate: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateSyllabusDto {
    subject: string;
    class: string;
    program?: string;
    fileUrl: string;
    fileName: string;
    fileSize: number;
    description?: string;
    academicYear: string;
    term?: string;
    isActive?: boolean;
}

export interface UpdateSyllabusDto {
    subject?: string;
    class?: string;
    program?: string;
    description?: string;
    academicYear?: string;
    term?: string;
    isActive?: boolean;
}

// Upload syllabus file
export const uploadSyllabusFile = async (file: File): Promise<{ url: string; filename: string; originalName: string; size: number }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post('/syllabus/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

// Get all syllabi
export const getSyllabi = async (filters?: any): Promise<Syllabus[]> => {
    const response = await axiosInstance.get('/syllabus', { params: filters });
    return response.data;
};

// Get single syllabus
export const getSyllabus = async (id: string): Promise<Syllabus> => {
    const response = await axiosInstance.get(`/syllabus/${id}`);
    return response.data;
};

// Create syllabus
export const createSyllabus = async (data: CreateSyllabusDto): Promise<Syllabus> => {
    const response = await axiosInstance.post('/syllabus', data);
    return response.data;
};

// Update syllabus
export const updateSyllabus = async (id: string, data: UpdateSyllabusDto): Promise<Syllabus> => {
    const response = await axiosInstance.patch(`/syllabus/${id}`, data);
    return response.data;
};

// Delete syllabus
export const deleteSyllabus = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/syllabus/${id}`);
};
