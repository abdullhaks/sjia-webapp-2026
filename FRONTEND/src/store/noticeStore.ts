import { create } from 'zustand';
import noticeApi, { Notice, CreateNoticeDto } from '../services/api/notice.api';

interface NoticeState {
    notices: Notice[];
    loading: boolean;
    error: string | null;

    fetchNotices: (audience?: string) => Promise<void>;
    createNotice: (data: CreateNoticeDto) => Promise<void>;
    deleteNotice: (id: string) => Promise<void>;
    clearError: () => void;
}

export const useNoticeStore = create<NoticeState>((set) => ({
    notices: [],
    loading: false,
    error: null,

    fetchNotices: async (audience) => {
        set({ loading: true, error: null });
        try {
            const notices = await noticeApi.getAllNotices(audience);
            set({ notices, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch notices', loading: false });
        }
    },

    createNotice: async (data) => {
        set({ loading: true, error: null });
        try {
            const newNotice = await noticeApi.createNotice(data);
            set((state) => ({ notices: [newNotice, ...state.notices], loading: false }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to create notice', loading: false });
            throw error;
        }
    },

    deleteNotice: async (id) => {
        set({ loading: true, error: null });
        try {
            await noticeApi.deleteNotice(id);
            set((state) => ({
                notices: state.notices.filter((n) => n._id !== id),
                loading: false,
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to delete notice', loading: false });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
}));
