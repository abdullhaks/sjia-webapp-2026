import axiosInstance from '../axios/authAxios';

export interface AppNotification {
    _id: string;
    recipient: string;
    title: string;
    message: string;
    type: string; // INFO, SUCCESS, URGENT, WARNING
    isRead: boolean;
    url?: string;
    createdAt: string;
    updatedAt: string;
}

const notificationApi = {
    async getMyNotifications(): Promise<AppNotification[]> {
        const response = await axiosInstance.get('/notifications/my');
        return Array.isArray(response.data) ? response.data : [];
    },

    async getUnreadCount(): Promise<number> {
        const response = await axiosInstance.get('/notifications/my/unread-count');
        return response.data?.count ?? 0;
    },

    async markAsRead(id: string): Promise<void> {
        await axiosInstance.patch(`/notifications/${id}/read`);
    },

    async markAllAsRead(): Promise<void> {
        await axiosInstance.patch('/notifications/mark-all-read');
    },

    async deleteNotification(id: string): Promise<void> {
        await axiosInstance.delete(`/notifications/${id}`);
    },
};

export default notificationApi;
