import { motion } from 'framer-motion';
import {
    FaUserGraduate,
    FaChalkboardTeacher,
    FaClipboardList,
    FaCalendarCheck,
    FaPlus,
    FaFileAlt,
    FaArrowUp,
    FaArrowDown
} from 'react-icons/fa';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import CountUp from 'react-countup';

import { useEffect } from 'react';
import { useDashboardStore } from '../../store/dashboardStore';

// statsConfig removed to prevent dummy data fallback

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const DashboardPage = () => {
    const { stats, admissionTrend, weeklyAttendance, recentActivities, fetchStats } = useDashboardStore();

    useEffect(() => {
        fetchStats();
    }, []);

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " mins ago";
        return Math.floor(seconds) + " seconds ago";
    };

    // Display Stats (default to 0 if empty)
    const displayStats = stats.length > 0 ? stats.map((stat) => ({
        ...stat,
        // Keep icon/gradient mapping logic if you want consistent UI for known keys,
        // but DO NOT fallback to dummy values.
        // We can define a helper for UI config based on title.
        icon: getStatConfig(stat.title).icon,
        gradient: getStatConfig(stat.title).gradient,
        bgGradient: getStatConfig(stat.title).bgGradient,
        trend: stat.trend || { value: 0, isPositive: true },
    })) : [
        // Optional: Show empty placeholders (0 values) instead of nothing? 
        // Or just show nothing. The user asked to remove Dummy Data.
        // Better to show the structure with 0s if we know the keys, 
        // but since we fetch dynamic keys, an Empty State is better if stats are truly empty.
        // However, the Service usually returns the 4 keys with 0 values if DB is empty.
        // Let's assume the service ALWAYS returns the structure.
    ];

    // Helper to get UI config
    function getStatConfig(title: string) {
        switch (title) {
            case 'Total Students': return { icon: FaUserGraduate, gradient: 'from-blue-500 to-blue-600', bgGradient: 'from-blue-50 to-blue-100' };
            case 'Total Staff': return { icon: FaChalkboardTeacher, gradient: 'from-purple-500 to-purple-600', bgGradient: 'from-purple-50 to-purple-100' };
            case 'New Admissions': return { icon: FaClipboardList, gradient: 'from-orange-500 to-orange-600', bgGradient: 'from-orange-50 to-orange-100' };
            case 'Avg. Attendance': return { icon: FaCalendarCheck, gradient: 'from-green-500 to-green-600', bgGradient: 'from-green-50 to-green-100' };
            default: return { icon: FaUserGraduate, gradient: 'from-gray-500 to-gray-600', bgGradient: 'from-gray-50 to-gray-100' };
        }
    }

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Dashboard Overview
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Welcome back! Here's what's happening today.
                    </p>
                </div>
                <div className="flex gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            import('antd').then(({ Modal }) => {
                                Modal.info({
                                    title: 'Generate Report',
                                    content: (
                                        <div className="py-4">
                                            <p className="mb-4">Select the type of report you wish to generate:</p>
                                            <div className="space-y-2">
                                                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors">
                                                    📄 Student Attendance Report
                                                </button>
                                                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors">
                                                    📊 Academic Performance Summary
                                                </button>
                                                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors">
                                                    💰 Fee Collection Statement
                                                </button>
                                            </div>
                                            <p className="mt-4 text-xs text-gray-400">
                                                * Full report generation capabilities will be enabled in Phase 2.
                                            </p>
                                        </div>
                                    ),
                                    okText: 'Close',
                                    maskClosable: true,
                                    width: 500,
                                    icon: <FaFileAlt className="text-blue-500 text-xl" />
                                });
                            });
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
                    >
                        <FaFileAlt className="text-gray-500" />
                        <span className="hidden sm:inline">Generate Report</span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: '0 10px 40px rgba(155, 89, 182, 0.4)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            import('antd').then(({ Modal }) => {
                                Modal.info({
                                    title: 'Quick Actions',
                                    content: (
                                        <div className="py-4 grid grid-cols-2 gap-3">
                                            <button className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700 text-sm font-medium transition-colors text-center">
                                                Add Student
                                            </button>
                                            <button className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 text-sm font-medium transition-colors text-center">
                                                Create Exam
                                            </button>
                                            <button className="p-3 bg-green-50 hover:bg-green-100 rounded-lg text-green-700 text-sm font-medium transition-colors text-center">
                                                Approve Leave
                                            </button>
                                            <button className="p-3 bg-orange-50 hover:bg-orange-100 rounded-lg text-orange-700 text-sm font-medium transition-colors text-center">
                                                Post Notice
                                            </button>
                                        </div>
                                    ),
                                    okText: 'Done',
                                    maskClosable: true,
                                    icon: <FaPlus className="text-primary text-xl" />
                                });
                            });
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl shadow-lg shadow-primary/30 transition-all"
                    >
                        <FaPlus />
                        <span className="hidden sm:inline">Quick Action</span>
                    </motion.button>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
            >
                {displayStats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className={`relative bg-gradient-to-br ${stat.bgGradient} p-6 rounded-2xl border border-white/50 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group`}
                    >
                        {/* Background Glow */}
                        <div className={`absolute -right-8 -top-8 w-24 h-24 bg-gradient-to-br ${stat.gradient} rounded-full opacity-20 group-hover:opacity-30 group-hover:scale-125 transition-all duration-500`} />

                        <div className="relative flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                                <h3 className="text-3xl font-bold text-gray-800">
                                    <CountUp end={stat.value} duration={2} separator="," />
                                    {stat.suffix || ''}
                                </h3>
                                <div className={`flex items-center gap-1 mt-2 text-sm ${stat.trend.isPositive ? 'text-green-600' : 'text-red-500'}`}>
                                    {stat.trend.isPositive ? <FaArrowUp className="text-xs" /> : <FaArrowDown className="text-xs" />}
                                    <span className="font-semibold">{stat.trend.value}%</span>
                                    <span className="text-gray-500">vs last month</span>
                                </div>
                            </div>
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                                <stat.icon className="text-white text-xl" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Charts Section */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <motion.div
                    whileHover={{ y: -2 }}
                    className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Admission Trends</h3>
                            <p className="text-sm text-gray-500">Monthly student enrollment data</p>
                        </div>
                        <select className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                            <option>Last 7 months</option>
                            <option>Last 12 months</option>
                        </select>
                    </div>
                    <div className="h-72 md:h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={admissionTrend}>
                                <defs>
                                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#9B59B6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#9B59B6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                        background: 'white'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="students"
                                    stroke="#9B59B6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorStudents)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Secondary Panel */}
                <motion.div
                    whileHover={{ y: -2 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
                >
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Weekly Attendance</h3>
                    <div className="h-44 mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyAttendance}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(155, 89, 182, 0.05)' }}
                                    contentStyle={{
                                        borderRadius: '8px',
                                        border: 'none',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Bar
                                    dataKey="present"
                                    fill="url(#barGradient)"
                                    radius={[6, 6, 0, 0]}
                                />
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#9B59B6" />
                                        <stop offset="100%" stopColor="#8E44AD" />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">
                            Recent Activity
                        </h4>
                        <div className="space-y-3">
                            {recentActivities.map((activity, index) => (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-xs font-bold text-primary-700">
                                        {activity.user.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-700 truncate">
                                            <span className="font-semibold text-gray-900">{activity.user}</span> {activity.action}
                                        </p>
                                        <p className="text-xs text-gray-400">{formatTimeAgo(activity.time)}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full mt-4 py-2.5 text-sm text-primary hover:text-white font-medium bg-primary-50 hover:bg-primary rounded-xl transition-all duration-300"
                        >
                            View All Activity
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default DashboardPage;
