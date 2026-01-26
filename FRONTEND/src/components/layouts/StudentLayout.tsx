import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import authService from '../../services/api/auth.api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaChartPie,
    FaClipboardList,
    FaUser,
    FaSignOutAlt,
    FaBars,
    FaTimes,
    FaBell,
    FaBook,
    FaClock
} from 'react-icons/fa';
import { useAuthStore } from '../../store/authStore';
import Avatar from '../common/Avatar';

// Sidebar Items
const sidebarItems = [
    { path: '/student/dashboard', label: 'Dashboard', icon: FaChartPie },
    { path: '/student/timetable', label: 'My Timetable', icon: FaClock },
    { path: '/student/syllabus', label: 'Syllabus', icon: FaBook },
    { path: '/student/exams', label: 'Exams', icon: FaClipboardList },
    { path: '/student/results', label: 'Results', icon: FaChartPie },
    { path: '/student/profile', label: 'My Profile', icon: FaUser },
];



const StudentLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { student: user } = useAuthStore();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await authService.logout();
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed:', error);
            window.location.href = '/login';
        }
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen bg-gray-50 flex overflow-hidden">
            {/* Sidebar */}
            <AnimatePresence mode="wait">
                {isSidebarOpen && (
                    <motion.aside
                        initial={{ x: -280, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -280, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="w-[280px] bg-white border-r border-gray-200 z-20 hidden md:flex flex-col h-screen fixed left-0 top-0"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <motion.div
                                    whileHover={{ scale: 1.05, rotate: 5 }}
                                    className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200"
                                >
                                    <span className="text-white font-bold text-xl">S</span>
                                </motion.div>
                                <div>
                                    <h1 className="font-bold text-gray-800 text-lg">Student Portal</h1>
                                    <p className="text-xs text-gray-500">SJIA Education</p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
                            {sidebarItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                            ? 'bg-blue-50 text-blue-600 font-medium'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <item.icon className={`text-lg ${isActive ? 'text-blue-600' : 'text-gray-400'
                                            }`} />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* User Profile Section */}
                        <div className="p-4 border-t border-gray-100">
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 mb-3">
                                <Avatar
                                    src={user?.photoUrl}
                                    alt={`${user?.firstName} ${user?.lastName}`}
                                    size="sm"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 truncate">
                                        {user?.firstName} {user?.lastName}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate capitalize">
                                        Student
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                            >
                                <FaSignOutAlt /> Sign Out
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? 'md:ml-[280px]' : ''}`}>
                {/* Topbar */}
                <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 h-16 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                            {isSidebarOpen ? <FaTimes /> : <FaBars />}
                        </button>
                        <h2 className="text-lg font-bold text-gray-800 hidden sm:block">
                            {sidebarItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
                            <FaBell />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
                        </button>
                        <div className="h-8 w-[1px] bg-gray-200 mx-2" />
                        <span className="text-sm font-medium text-gray-600 hidden sm:block">
                            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default StudentLayout;
