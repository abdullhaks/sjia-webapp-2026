import React, { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useStudentStore } from '../../store/studentStore';
import { useAttendanceStore } from '../../store/attendanceStore';
import { useNoticeStore } from '../../store/noticeStore';
import { useExamStore } from '../../store/examStore';
import { Calendar, BookOpen, FileText, User, TrendingUp, Bell, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

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
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
            >
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Welcome back, {currentStudent?.firstName || user?.firstName}! 👋
                </h1>
                <p className="text-gray-500">
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
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
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
                            <span className="font-semibold text-gray-800">{attendanceStats?.total || 0}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                            <span>Days Present:</span>
                            <span className="font-semibold text-gray-800">{attendanceStats?.present || 0}</span>
                        </div>
                    </div>

                    <button className="w-full mt-4 py-2 px-4 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium rounded-xl transition-colors text-sm">
                        View Details
                    </button>
                </motion.div>

                {/* Recent Notices */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-purple-500" />
                            Recent Notices
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {recentNotices.length > 0 ? (
                            recentNotices.map((notice) => (
                                <div
                                    key={notice._id}
                                    className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer border border-gray-100"
                                >
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h3 className="text-gray-800 font-medium text-sm line-clamp-2">
                                            {notice.title}
                                        </h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(notice.priority)} whitespace-nowrap`}>
                                            {notice.priority}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500">{new Date(notice.date).toLocaleDateString()}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-sm text-center py-4">No recent notices</p>
                        )}
                    </div>

                    <button className="w-full mt-4 py-2 px-4 bg-purple-50 hover:bg-purple-100 text-purple-600 font-medium rounded-xl transition-colors text-sm">
                        View All Notices
                    </button>
                </motion.div>

                {/* Upcoming Exams */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-green-500" />
                            Upcoming Exams
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {displayExams.length > 0 ? (
                            displayExams.map((exam) => (
                                <div
                                    key={exam._id}
                                    className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer border border-gray-100"
                                >
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <div>
                                            <h3 className="text-gray-800 font-medium text-sm">
                                                {exam.title}
                                            </h3>
                                            <p className="text-xs text-gray-500">{exam.type}</p>
                                        </div>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 whitespace-nowrap">
                                            {exam.daysLeft} days
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500">{new Date(exam.startDate).toLocaleDateString()}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-sm text-center py-4">No upcoming exams</p>
                        )}
                    </div>

                    <button className="w-full mt-4 py-2 px-4 bg-green-50 hover:bg-green-100 text-green-600 font-medium rounded-xl transition-colors text-sm">
                        View All Exams
                    </button>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
            >
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                        <motion.button
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all group text-left"
                            onClick={() => window.location.href = action.path}
                        >
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 shadow-[0_0_10px_rgba(0,0,0,0.1)] group-hover:scale-110 transition-transform`}>
                                <action.icon className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-gray-700 font-medium text-sm">{action.label}</p>
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default StudentDashboardPage;
