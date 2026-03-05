import { create } from 'zustand';
import notificationApi, { AppNotification } from '../services/api/notification.api';

interface NotificationState {
    notifications: AppNotification[];
    unreadCount: number;
    loading: boolean;
    error: string | null;

    fetchNotifications: () => Promise<void>;
    fetchUnreadCount: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
    clearError: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,

    fetchNotifications: async () => {
        set({ loading: true, error: null });
        try {
            const notifications = await notificationApi.getMyNotifications();
            const unreadCount = notifications.filter((n) => !n.isRead).length;
            set({ notifications, unreadCount, loading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch notifications',
                loading: false,
            });
        }
    },

    fetchUnreadCount: async () => {
        try {
            const count = await notificationApi.getUnreadCount();
            set({ unreadCount: count });
        } catch {
            // Silently fail for badge count
        }
    },

    markAsRead: async (id: string) => {
        try {
            await notificationApi.markAsRead(id);
            set((state) => ({
                notifications: state.notifications.map((n) =>
                    n._id === id ? { ...n, isRead: true } : n,
                ),
                unreadCount: Math.max(0, state.unreadCount - 1),
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to mark notification as read' });
        }
    },

    markAllAsRead: async () => {
        try {
            await notificationApi.markAllAsRead();
            set((state) => ({
                notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
                unreadCount: 0,
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to mark all as read' });
        }
    },

    deleteNotification: async (id: string) => {
        try {
            await notificationApi.deleteNotification(id);
            set((state) => ({
                notifications: state.notifications.filter((n) => n._id !== id),
                unreadCount: state.notifications.find((n) => n._id === id && !n.isRead)
                    ? Math.max(0, state.unreadCount - 1)
                    : state.unreadCount,
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to delete notification' });
        }
    },

    clearError: () => set({ error: null }),
}));
