import React, { useEffect, useRef, useState } from 'react';
import { useNotificationStore } from '../../store/notificationStore';
import { FaBell, FaCheck, FaCheckDouble, FaTrash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationDropdown: React.FC = () => {
    const {
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
    } = useNotificationStore();

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fetch unread count on mount, and poll every 30 seconds
    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, [fetchUnreadCount]);

    // Fetch full list when dropdown opens
    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen, fetchNotifications]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkRead = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        await markAsRead(id);
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        await deleteNotification(id);
    };

    const formatTimeAgo = (dateString: string) => {
        const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    const getTypeColor = (type?: string) => {
        switch (type) {
            case 'URGENT': return 'bg-red-500';
            case 'SUCCESS': return 'bg-emerald-500';
            case 'WARNING': return 'bg-amber-500';
            default: return 'bg-blue-500';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 rounded-xl bg-gray-50 hover:bg-purple-50 text-gray-600 hover:text-purple-600 transition-all duration-200"
                id="notification-bell"
            >
                <FaBell className="text-lg" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 bg-red-500 rounded-full border-2 border-white text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </motion.button>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-96 max-h-[480px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white px-5 py-4 border-b border-gray-100 flex items-center justify-between z-10">
                            <div>
                                <h3 className="text-base font-bold text-gray-800">Notifications</h3>
                                {unreadCount > 0 && (
                                    <p className="text-xs text-gray-500">{unreadCount} unread</p>
                                )}
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    onClick={() => markAllAsRead()}
                                    className="text-xs text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-purple-50 transition-colors"
                                >
                                    <FaCheckDouble className="text-[10px]" />
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {/* Notification List */}
                        <div className="overflow-y-auto max-h-[380px] custom-scrollbar">
                            {loading && notifications.length === 0 ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="w-6 h-6 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 px-6">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <FaBell className="text-gray-300 text-2xl" />
                                    </div>
                                    <p className="text-gray-500 font-medium">No notifications</p>
                                    <p className="text-gray-400 text-xs mt-1">You're all caught up!</p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        className={`px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group ${!notification.isRead ? 'bg-purple-50/40' : ''
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            {/* Type indicator */}
                                            <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${getTypeColor(notification.type)}`} />

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className={`text-sm leading-tight ${!notification.isRead ? 'font-semibold text-gray-800' : 'font-medium text-gray-600'}`}>
                                                        {notification.title}
                                                    </h4>
                                                    <span className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">
                                                        {formatTimeAgo(notification.createdAt)}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notification.message}</p>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {!notification.isRead && (
                                                        <button
                                                            onClick={(e) => handleMarkRead(e, notification._id)}
                                                            className="text-[10px] text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 hover:bg-purple-100 transition-colors"
                                                        >
                                                            <FaCheck className="text-[8px]" /> Read
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={(e) => handleDelete(e, notification._id)}
                                                        className="text-[10px] text-red-500 hover:text-red-700 font-medium flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 hover:bg-red-100 transition-colors"
                                                    >
                                                        <FaTrash className="text-[8px]" /> Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationDropdown;
