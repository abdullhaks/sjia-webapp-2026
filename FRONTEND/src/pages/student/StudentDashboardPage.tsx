import React, { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useStudentStore } from '../../store/studentStore';
import { useAttendanceStore } from '../../store/attendanceStore';
import { useNoticeStore } from '../../store/noticeStore';
import { useExamStore } from '../../store/examStore';
import { Calendar, BookOpen, FileText, User, TrendingUp, Bell, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StudentDashboardPage: React.FC = () => {
    const { user } = useAuthStore();
    const { currentStudent, fetchCurrentStudent } = useStudentStore();
    const { stats: attendanceStats, fetchAttendanceStats } = useAttendanceStore();
    const { notices, fetchNotices } = useNoticeStore();
    const { upcomingExams, fetchUpcomingExams } = useExamStore();

    useEffect(() => {
        const loadData = async () => {
            if (user?.id) {
                // Fetch profile first to get admission number if needed, but standard logic uses User ID or Student ID
                const student = await fetchCurrentStudent();
                if (student) {
                    // Use student._id for specific student data if APIs require Student ID instead of User ID
                    // Current attendance store seems to take string (studentId), assuming it supports Student ID
                    fetchAttendanceStats(student._id);
                }
                fetchNotices('student');
                fetchUpcomingExams();
            }
        };
        loadData();
    }, [user, fetchCurrentStudent, fetchAttendanceStats, fetchNotices, fetchUpcomingExams]);

    const attendancePercentage = attendanceStats?.percentage || 0;

    // Limits
    const recentNotices = notices.slice(0, 3);
    const displayExams = upcomingExams.slice(0, 3);

    // Mock monthly attendance data mapping to phase 7.4 Log Trackers
    const monthlyAttendanceData = [
        { month: 'Sep', percentage: 92 },
        { month: 'Oct', percentage: 95 },
        { month: 'Nov', percentage: 88 },
        { month: 'Dec', percentage: 100 },
        { month: 'Jan', percentage: 96 },
        { month: 'Feb', percentage: attendancePercentage || 94 }
    ];

    const quickActions = [
        { icon: Calendar, label: 'Timetable', path: '/student/timetable', color: 'from-blue-500 to-cyan-500' },
        { icon: BookOpen, label: 'Syllabus', path: '/student/syllabus', color: 'from-purple-500 to-pink-500' },
        { icon: FileText, label: 'Results', path: '/student/results', color: 'from-green-500 to-emerald-500' },
        { icon: User, label: 'Profile', path: '/student/profile', color: 'from-orange-500 to-red-500' },
    ];



    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-50 text-red-600 border-red-100';
            case 'medium': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
            case 'low': return 'bg-blue-50 text-blue-600 border-blue-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    return (
        <div className="min-h-screen p-6 space-y-6">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800"
            >
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    Welcome back, {currentStudent?.firstName || user?.firstName}! 👋
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </motion.div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Attendance Summary */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                            Attendance
                        </h2>
                    </div>

                    <div className="flex items-center justify-center mb-4">
                        <div className="relative w-40 h-40">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke="rgba(0,0,0,0.05)"
                                    strokeWidth="12"
                                    fill="none"
                                />
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke="url(#attendanceGradient)"
                                    strokeWidth="12"
                                    fill="none"
                                    strokeDasharray={`${2 * Math.PI * 70}`}
                                    strokeDashoffset={`${2 * Math.PI * 70 * (1 - attendancePercentage / 100)}`}
                                    strokeLinecap="round"
                                />
                                <defs>
                                    <linearGradient id="attendanceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#3b82f6" />
                                        <stop offset="100%" stopColor="#06b6d4" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className={`text-4xl font-bold text-gray-800`}>
                                    {attendancePercentage}%
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-500">
                            <span>Total Classes:</span>
                            <span className="font-semibold text-gray-800 dark:text-gray-200">{attendanceStats?.total || 0}</span>
                        </div>
                        <div className="flex justify-between text-gray-500 dark:text-gray-400">
                            <span>Days Present:</span>
                            <span className="font-semibold text-gray-800 dark:text-gray-200">{attendanceStats?.present || 0}</span>
                        </div>
                    </div>

                    <button className="w-full mt-4 py-2 px-4 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-medium rounded-xl transition-colors text-sm">
                        View Details
                    </button>
                </motion.div>

                {/* Recent Notices */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-purple-500" />
                            Recent Notices
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {recentNotices.length > 0 ? (
                            recentNotices.map((notice) => (
                                <div
                                    key={notice._id}
                                    className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all cursor-pointer border border-gray-100 dark:border-slate-700"
                                >
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h3 className="text-gray-800 dark:text-gray-200 font-medium text-sm line-clamp-2">
                                            {notice.title}
                                        </h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(notice.priority)} whitespace-nowrap`}>
                                            {notice.priority}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(notice.date).toLocaleDateString()}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-4">No recent notices</p>
                        )}
                    </div>

                    <button className="w-full mt-4 py-2 px-4 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-400 font-medium rounded-xl transition-colors text-sm">
                        View All Notices
                    </button>
                </motion.div>

                {/* Upcoming Exams */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-green-500" />
                            Upcoming Exams
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {displayExams.length > 0 ? (
                            displayExams.map((exam) => (
                                <div
                                    key={exam._id}
                                    className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all cursor-pointer border border-gray-100 dark:border-slate-700"
                                >
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <div>
                                            <h3 className="text-gray-800 dark:text-gray-200 font-medium text-sm">
                                                {exam.title}
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{exam.type}</p>
                                        </div>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 whitespace-nowrap">
                                            {exam.daysLeft} days
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(exam.startDate).toLocaleDateString()}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-4">No upcoming exams</p>
                        )}
                    </div>

                    <button className="w-full mt-4 py-2 px-4 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 text-green-600 dark:text-emerald-400 font-medium rounded-xl transition-colors text-sm">
                        View All Exams
                    </button>
                </motion.div>
            </div>

            {/* Quick Actions and Chart Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Attendance Chart Log Tracker */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.35 }}
                    className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                            Monthly Attendance Trend
                        </h2>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyAttendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorPercentage" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    formatter={(value: number | undefined) => [`${value ?? 0}%`, 'Attendance']}
                                />
                                <Area type="monotone" dataKey="percentage" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPercentage)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800"
                >
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4 h-64">
                        {quickActions.map((action, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-700 transition-all group text-left flex flex-col items-center justify-center text-center h-full"
                                onClick={() => window.location.href = action.path}
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 shadow-[0_0_10px_rgba(0,0,0,0.1)] group-hover:scale-110 transition-transform flex-shrink-0`}>
                                    <action.icon className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 font-medium text-sm">{action.label}</p>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default StudentDashboardPage;
