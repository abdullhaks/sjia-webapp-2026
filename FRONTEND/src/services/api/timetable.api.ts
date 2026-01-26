import axiosInstance from '../axios/authAxios';

export interface TimetableSlot {
    day: string;
    period: number;
    subject: string;
    teacher: string;
    room?: string;
    startTime: string;
    endTime: string;
}

export interface Timetable {
    _id: string;
    title: string;
    class: string;
    program?: string;
    type: 'pdf' | 'grid';
    fileUrl?: string;
    fileName?: string;
    gridData?: TimetableSlot[];
    academicYear: string;
    term?: string;
    effectiveFrom: string;
    effectiveTo?: string;
    createdBy: {
        _id: string;
        firstName: string;
        lastName: string;
    };
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTimetableDto {
    title: string;
    class: string;
    program?: string;
    type: 'pdf' | 'grid';
    fileUrl?: string;
    fileName?: string;
    gridData?: TimetableSlot[];
    academicYear: string;
    term?: string;
    effectiveFrom: string;
    effectiveTo?: string;
    isActive?: boolean;
}

export interface UpdateTimetableDto {
    title?: string;
    class?: string;
    program?: string;
    gridData?: TimetableSlot[];
    academicYear?: string;
    term?: string;
    effectiveFrom?: string;
    effectiveTo?: string;
    isActive?: boolean;
}

// Upload timetable file
export const uploadTimetableFile = async (file: File): Promise<{ url: string; filename: string; originalName: string; size: number }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post('/timetable/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

// Get all timetables
export const getTimetables = async (filters?: any): Promise<Timetable[]> => {
    const response = await axiosInstance.get('/timetable', { params: filters });
    return response.data;
};

// Get teacher's own schedule
export const getMySchedule = async (): Promise<any[]> => {
    const response = await axiosInstance.get('/timetable/teacher/my-schedule');
    return response.data;
};

// Get single timetable
export const getTimetable = async (id: string): Promise<Timetable> => {
    const response = await axiosInstance.get(`/timetable/${id}`);
    return response.data;
};

// Create timetable
export const createTimetable = async (data: CreateTimetableDto): Promise<Timetable> => {
    const response = await axiosInstance.post('/timetable', data);
    return response.data;
};

// Update timetable
export const updateTimetable = async (id: string, data: UpdateTimetableDto): Promise<Timetable> => {
    const response = await axiosInstance.patch(`/timetable/${id}`, data);
    return response.data;
};

// Delete timetable
export const deleteTimetable = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/timetable/${id}`);
};
