import { create } from 'zustand';
import * as cmsApi from '../services/api/cms.api';

interface CMSState {
    gallery: cmsApi.GalleryItem[];
    leadership: cmsApi.LeadershipMember[];
    siteContent: cmsApi.SiteContent[];
    media: any[];
    loading: boolean;
    error: string | null;
    uploadProgress: number;

    // Gallery actions
    fetchGallery: (filters?: any) => Promise<void>;
    createGalleryItem: (data: cmsApi.CreateGalleryDto) => Promise<void>;
    updateGalleryItem: (id: string, data: Partial<cmsApi.CreateGalleryDto>) => Promise<void>;
    deleteGalleryItem: (id: string) => Promise<void>;

    // Leadership actions
    fetchLeadership: () => Promise<void>;
    createLeadershipMember: (data: cmsApi.CreateLeadershipDto) => Promise<void>;
    updateLeadershipMember: (id: string, data: Partial<cmsApi.CreateLeadershipDto>) => Promise<void>;
    deleteLeadershipMember: (id: string) => Promise<void>;

    // Site Content actions
    fetchSiteContent: () => Promise<void>;
    updateSiteContent: (key: string, data: cmsApi.UpdateSiteContentDto) => Promise<void>;

    // Media raw files actions
    fetchMediaFiles: () => Promise<void>;
    deleteMediaFile: (url: string) => Promise<void>;

    // File upload
    uploadFile: (file: File) => Promise<{ url: string; filename: string; originalName: string }>;

    // Utility
    clearError: () => void;
    setUploadProgress: (progress: number) => void;
}

export const useCMSStore = create<CMSState>((set) => ({
    gallery: [],
    leadership: [],
    siteContent: [],
    media: [],
    loading: false,
    error: null,
    uploadProgress: 0,

    fetchGallery: async (filters) => {
        set({ loading: true, error: null });
        try {
            const gallery = await cmsApi.getGallery(filters);
            set({ gallery, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch gallery', loading: false });
        }
    },

    createGalleryItem: async (data) => {
        set({ loading: true, error: null });
        try {
            const newItem = await cmsApi.createGalleryItem(data);
            set((state) => ({ gallery: [...state.gallery, newItem], loading: false }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to create gallery item', loading: false });
            throw error;
        }
    },

    updateGalleryItem: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const updated = await cmsApi.updateGalleryItem(id, data);
            set((state) => ({
                gallery: state.gallery.map((item) => (item._id === id ? updated : item)),
                loading: false,
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to update gallery item', loading: false });
            throw error;
        }
    },

    deleteGalleryItem: async (id) => {
        set({ loading: true, error: null });
        try {
            await cmsApi.deleteGalleryItem(id);
            set((state) => ({
                gallery: state.gallery.filter((item) => item._id !== id),
                loading: false,
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to delete gallery item', loading: false });
            throw error;
        }
    },

    fetchLeadership: async () => {
        set({ loading: true, error: null });
        try {
            const leadership = await cmsApi.getLeadership();
            set({ leadership, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch leadership', loading: false });
        }
    },

    createLeadershipMember: async (data) => {
        set({ loading: true, error: null });
        try {
            const newMember = await cmsApi.createLeadershipMember(data);
            set((state) => ({ leadership: [...state.leadership, newMember], loading: false }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to create leadership member', loading: false });
            throw error;
        }
    },

    updateLeadershipMember: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const updated = await cmsApi.updateLeadershipMember(id, data);
            set((state) => ({
                leadership: state.leadership.map((member) => (member._id === id ? updated : member)),
                loading: false,
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to update leadership member', loading: false });
            throw error;
        }
    },

    deleteLeadershipMember: async (id) => {
        set({ loading: true, error: null });
        try {
            await cmsApi.deleteLeadershipMember(id);
            set((state) => ({
                leadership: state.leadership.filter((member) => member._id !== id),
                loading: false,
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to delete leadership member', loading: false });
            throw error;
        }
    },

    fetchSiteContent: async () => {
        set({ loading: true, error: null });
        try {
            const siteContent = await cmsApi.getSiteContent();
            set({ siteContent, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch site content', loading: false });
        }
    },

    updateSiteContent: async (key, data) => {
        set({ loading: true, error: null });
        try {
            const updated = await cmsApi.updateSiteContent(key, data);
            set((state) => ({
                siteContent: state.siteContent.map((content) => (content.key === key ? updated : content)),
                loading: false,
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to update site content', loading: false });
            throw error;
        }
    },

    fetchMediaFiles: async () => {
        set({ loading: true, error: null });
        try {
            const media = await cmsApi.getMediaFiles();
            set({ media, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch media files', loading: false });
        }
    },

    deleteMediaFile: async (url) => {
        set({ loading: true, error: null });
        try {
            await cmsApi.deleteMediaFile(url);
            set((state) => ({
                media: state.media.filter((m) => m.url !== url),
                loading: false,
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to delete media file', loading: false });
            throw error;
        }
    },

    uploadFile: async (file) => {
        set({ uploadProgress: 0, error: null });
        try {
            const result = await cmsApi.uploadFile(file);
            set({ uploadProgress: 100 });
            return result;
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to upload file', uploadProgress: 0 });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
    setUploadProgress: (progress) => set({ uploadProgress: progress }),
}));
