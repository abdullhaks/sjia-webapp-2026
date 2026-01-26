import axiosInstance from '../axios/authAxios';

export interface GalleryItem {
    _id: string;
    title: string;
    description?: string;
    imageUrl: string;
    category: 'campus' | 'events' | 'achievements' | 'other';
    order: number;
    isActive: boolean;
    uploadedBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface LeadershipMember {
    _id: string;
    name: string;
    position: string;
    photoUrl: string;
    bio?: string;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface SiteContent {
    _id: string;
    key: string;
    value: string;
    type: 'text' | 'html' | 'json' | 'url';
    section: string;
    description?: string;
    updatedBy?: string;
    updatedAt: string;
}

export interface CreateGalleryDto {
    title: string;
    description?: string;
    imageUrl: string;
    category: 'campus' | 'events' | 'achievements' | 'other';
    order?: number;
    isActive?: boolean;
}

export interface CreateLeadershipDto {
    name: string;
    position: string;
    photoUrl: string;
    bio?: string;
    order?: number;
    isActive?: boolean;
}

export interface UpdateSiteContentDto {
    value: string;
    type?: 'text' | 'html' | 'json' | 'url';
    description?: string;
}

// File Upload
export const uploadFile = async (file: File): Promise<{ url: string; filename: string; originalName: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post('/content/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

// Gallery API
export const getGallery = async (filters?: any): Promise<GalleryItem[]> => {
    const response = await axiosInstance.get('/content/gallery', { params: filters });
    return response.data;
};

export const createGalleryItem = async (data: CreateGalleryDto): Promise<GalleryItem> => {
    const response = await axiosInstance.post('/content/gallery', data);
    return response.data;
};

export const updateGalleryItem = async (id: string, data: Partial<CreateGalleryDto>): Promise<GalleryItem> => {
    const response = await axiosInstance.patch(`/content/gallery/${id}`, data);
    return response.data;
};

export const deleteGalleryItem = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/content/gallery/${id}`);
};

// Leadership API
export const getLeadership = async (): Promise<LeadershipMember[]> => {
    const response = await axiosInstance.get('/content/leadership');
    return response.data;
};

export const createLeadershipMember = async (data: CreateLeadershipDto): Promise<LeadershipMember> => {
    const response = await axiosInstance.post('/content/leadership', data);
    return response.data;
};

export const updateLeadershipMember = async (id: string, data: Partial<CreateLeadershipDto>): Promise<LeadershipMember> => {
    const response = await axiosInstance.patch(`/content/leadership/${id}`, data);
    return response.data;
};

export const deleteLeadershipMember = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/content/leadership/${id}`);
};

// Site Content API
export const getSiteContent = async (): Promise<SiteContent[]> => {
    const response = await axiosInstance.get('/content/site-content');
    return response.data;
};

export const getSiteContentByKey = async (key: string): Promise<SiteContent> => {
    const response = await axiosInstance.get(`/content/site-content/${key}`);
    return response.data;
};

export const updateSiteContent = async (key: string, data: UpdateSiteContentDto): Promise<SiteContent> => {
    const response = await axiosInstance.patch(`/content/site-content/${key}`, data);
    return response.data;
};
