import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import authService from '../../services/api/auth.api';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import {
    FaUserGraduate,
    FaChalkboardTeacher,
    FaUserCog,
    FaChartPie,
    FaCalendarAlt,
    FaClipboardList,
    FaCog,
    FaSignOutAlt,
    FaBars,
    FaSearch,
    FaImages,
    FaBook,
    FaCalendarCheck,
    FaMoneyBillWave
} from 'react-icons/fa';
import { useAuthStore } from '../../store/authStore';
import Avatar from '../common/Avatar';
import NotificationDropdown from '../common/NotificationDropdown';
import ThemeToggle from '../common/ThemeToggle';

// Sidebar Items
const sidebarItems = [
    { path: '/superadmin/dashboard', label: 'Dashboard', icon: FaChartPie },
    { path: '/superadmin/students', label: 'Students', icon: FaUserGraduate },
    { path: '/superadmin/staff', label: 'Staff', icon: FaChalkboardTeacher },
    { path: '/superadmin/admissions', label: 'Admissions', icon: FaUserCog },
    { path: '/superadmin/exams', label: 'Exams', icon: FaClipboardList },
    { path: '/superadmin/leaves', label: 'Leaves', icon: FaCalendarAlt },
    { path: '/superadmin/results', label: 'Results', icon: FaClipboardList },
    { path: '/superadmin/cms', label: 'CMS', icon: FaImages },
    { path: '/superadmin/syllabus', label: 'Syllabus', icon: FaBook },
    { path: '/superadmin/timetable', label: 'Timetable', icon: FaCalendarCheck },
    { path: '/superadmin/finance', label: 'Finance', icon: FaMoneyBillWave },
    { path: '/superadmin/settings', label: 'Settings', icon: FaCog },
];

const SuperAdminLayout = () => {
    const isDesktop = useMediaQuery({ query: '(min-width: 768px)' });
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { superAdmin: user } = useAuthStore();
    const location = useLocation();

    // Auto-close sidebar on mobile route change
    useEffect(() => {
        if (!isDesktop) {
            setIsSidebarOpen(false);
        } else {
            setIsSidebarOpen(true);
        }
    }, [location.pathname, isDesktop]);

    const handleLogout = async () => {
        try {
            await authService.logout();
            window.location.href = '/';
        } catch (error) {
            console.error('Logout failed:', error);
            // Fallback to local clear if API call fails
            window.location.href = '/';
        }
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex overflow-hidden">
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {!isDesktop && isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/50 z-20 backdrop-blur-sm md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <AnimatePresence mode="wait">
                {(isSidebarOpen || isDesktop) && (
                    <motion.aside
                        initial={{ x: -280, opacity: 0 }}
                        animate={{
                            x: isSidebarOpen ? 0 : -280,
                            opacity: 1,
                            width: isSidebarOpen ? 280 : 0
                        }}
                        exit={{ x: -280, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }} // Sync with margin transition
                        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-emerald-900 via-emerald-800 to-teal-900 text-white shadow-2xl z-30 overflow-hidden flex flex-col`}
                        style={{ width: '280px' }}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 shrink-0">
                            <div className="flex items-center gap-3">
                                <motion.div
                                    whileHover={{ scale: 1.05, rotate: 5 }}
                                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0"
                                >
                                    <img
                                        src="/logo.png"
                                        alt="SJIA"
                                        className="w-8 h-8 object-contain"
                                        onError={(e) => e.currentTarget.src = 'https://placehold.co/100x100?text=SJIA'}
                                    />
                                </motion.div>
                                <div className="min-w-0">
                                    <h1 className="font-bold text-lg tracking-wide whitespace-nowrap">SJIA Admin</h1>
                                    <p className="text-xs text-white/50 whitespace-nowrap">Management Portal</p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
                            {sidebarItems.map((item, index) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <motion.div
                                        key={item.path}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Link
                                            to={item.path}
                                            className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group overflow-hidden whitespace-nowrap ${isActive
                                                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20'
                                                : 'text-white/70 hover:bg-white/10 hover:text-white'
                                                }`}
                                        >
                                            <item.icon className={`text-lg relative z-10 shrink-0 ${isActive ? 'text-white' : 'text-white/60 group-hover:text-amber-300'
                                                } transition-colors`} />
                                            <span className="font-medium relative z-10">{item.label}</span>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </nav>

                        {/* User Profile Section */}
                        <div className="p-4 border-t border-white/10 bg-black/20 shrink-0">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                            >
                                <Avatar
                                    src={user?.photoUrl}
                                    alt={`${user?.firstName} ${user?.lastName}`}
                                    size="md"
                                    className="border-2 border-amber-500/20 shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-white truncate">
                                        {user?.firstName} {user?.lastName}
                                    </p>
                                    <p className="text-xs text-white/50 truncate capitalize">
                                        {user?.role}
                                    </p>
                                </div>
                            </motion.div>

                            <motion.button
                                whileHover={{ scale: 1.02, x: 5 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleLogout}
                                className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-red-300 hover:bg-red-500/20 hover:text-red-200 rounded-xl transition-all duration-300 border border-red-500/20"
                            >
                                <FaSignOutAlt /> Sign Out
                            </motion.button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div
                className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${isSidebarOpen && isDesktop ? 'md:ml-[280px]' : ''
                    }`}
            >
                {/* Topbar */}
                <header className="sticky top-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-sm border-b border-gray-200/50 dark:border-slate-800 h-16 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleSidebar}
                            className="p-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200"
                        >
                            {isSidebarOpen ? <FaBars className="rotate-90 transition-transform" /> : <FaBars />}
                        </motion.button>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 hidden sm:block">
                                {sidebarItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
                            </h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                                Welcome back, {user?.firstName || 'Admin'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <div className="relative hidden md:block">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search anything..."
                                className="w-72 pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-slate-800 focus:border-emerald-300 transition-all text-sm text-gray-800 dark:text-gray-200"
                            />
                        </div>

                        <ThemeToggle />
                        {/* Notifications */}
                        <NotificationDropdown />

                        {/* Profile Quick Access */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="hidden lg:flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer"
                        >
                            <Avatar
                                src={user?.photoUrl}
                                alt={`${user?.firstName} ${user?.lastName}`}
                                size="sm"
                            />
                        </motion.div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 relative overflow-x-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default SuperAdminLayout;
