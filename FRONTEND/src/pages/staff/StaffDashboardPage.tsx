import React, { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useStaffStore } from '../../store/staffStore';
import { useTimetableStore } from '../../store/timetableStore';
import { useLeaveStore } from '../../store/leaveStore';
import { Calendar, Users, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const StaffDashboardPage: React.FC = () => {
    const { user } = useAuthStore();
    const { currentStaff, fetchCurrentStaff } = useStaffStore();
    const { mySchedule, fetchMySchedule } = useTimetableStore();
    const { leaves, fetchAllLeaves } = useLeaveStore();

    useEffect(() => {
        fetchCurrentStaff();
        fetchMySchedule();
        fetchAllLeaves('pending');
    }, []);

    // Derive displayed schedule from mySchedule (assuming today's schedule logic needed)
    // For now, just showing all slots or a subset as "Today's Schedule" placeholder logic requires day filtering
    // Assuming mySchedule contains slots for all days, we need to filter by current day
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];

    const todaySchedule = mySchedule
        .filter(slot => slot.day === today)
        .sort((a, b) => a.period - b.period)
        .map((slot, i) => ({
            id: i, // No ID in slot
            period: slot.period,
            subject: slot.subject,
            class: slot.class, // Added in service
            room: slot.room || 'N/A',
            time: `${slot.startTime} - ${slot.endTime}`,
            status: 'upcoming' // Todo: calculate based on time
        }));

    // Fallback if no schedule found for today (or empty DB)
    const displaySchedule = todaySchedule.length > 0 ? todaySchedule : [];

    // Real pending leaves from store
    const pendingLeaves = leaves.slice(0, 3).map((leave) => ({
        id: leave._id,
        studentName: `${leave.firstName} ${leave.lastName}`,
        class: leave.role === 'student' ? 'Student' : 'Staff', // Fallback since Class isn't in Leave schema
        dates: new Date(leave.startDate).toLocaleDateString() + ' - ' + new Date(leave.endDate).toLocaleDateString(),
        reason: leave.reason,
        type: leave.role.toLowerCase()
    }));

    // Derive Unique Classes from Schedule
    const myClasses = Array.from(new Set(mySchedule.map(s => s.class + '|' + s.subject)))
        .map((key, index) => {
            const [className, subject] = key.split('|');
            return {
                id: index,
                name: className,
                subject: subject,
                students: 'N/A', // Count not available in schedule
                program: className.includes('SSLC') ? 'SSLC' : (className.includes('Plus') ? 'Plus Two' : 'General')
            };
        });

    const quickActions = [
        { icon: CheckCircle, label: 'Mark Attendance', path: '/staff/attendance', color: 'from-green-500 to-emerald-500' },
        { icon: Calendar, label: 'View Timetable', path: '/staff/timetable', color: 'from-blue-500 to-cyan-500' },
        { icon: FileText, label: 'Manage Leave', path: '/staff/leaves', color: 'from-purple-500 to-pink-500' },
        { icon: Users, label: 'View Students', path: '/staff/students', color: 'from-orange-500 to-red-500' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'current': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            case 'upcoming': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
            default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        }
    };

    return (
        <div className="min-h-screen space-y-6">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 p-6"
            >
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    Welcome back, {currentStaff?.firstName || user?.firstName}! 👨‍🏫
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </motion.div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Today's Schedule */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 p-6 lg:col-span-2"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-500" />
                            Today's Schedule
                        </h2>
                    </div>

                    <div className="space-y-3">
                        <div className="space-y-3">
                            {displaySchedule.length > 0 ? (
                                displaySchedule.map((schedule) => (
                                    <div
                                        key={schedule.id}
                                        className={`p-4 rounded-xl border transition-all ${schedule.status === 'current'
                                            ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/30'
                                            : 'bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{schedule.period}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">Period</div>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-gray-800 dark:text-gray-100 font-semibold">{schedule.subject}</h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{schedule.class} • Room {schedule.room}</p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500">{schedule.time}</p>
                                                </div>
                                            </div>
                                            <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(schedule.status)} capitalize`}>
                                                {schedule.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-400">No classes scheduled for today</div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Pending Leave Requests */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-yellow-500" />
                            Pending Leaves
                        </h2>
                        <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-500/30">
                            {pendingLeaves.length}
                        </span>
                    </div>

                    <div className="space-y-3">
                        {pendingLeaves.map((leave) => (
                            <div
                                key={leave.id}
                                className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700"
                            >
                                <div className="mb-2">
                                    <h3 className="text-gray-800 dark:text-gray-200 font-medium text-sm">{leave.studentName}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{leave.class}</p>
                                </div>
                                <div className="mb-2">
                                    <p className="text-xs text-gray-600 dark:text-gray-300">{leave.dates}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Reason: {leave.reason}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex-1 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-500/20 hover:bg-green-100 dark:hover:bg-green-500/30 text-green-700 dark:text-green-300 text-xs font-medium transition-all border border-green-200 dark:border-green-500/30">
                                        Approve
                                    </button>
                                    <button className="flex-1 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/30 text-red-700 dark:text-red-300 text-xs font-medium transition-all border border-red-200 dark:border-red-500/30">
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="btn-premium w-full mt-4">
                        View All Requests
                    </button>
                </motion.div>
            </div>

            {/* My Classes */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 p-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-500" />
                        My Classes
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {myClasses.map((classItem) => (
                        <div
                            key={classItem.id}
                            className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800/80 border border-gray-200 dark:border-slate-700 transition-all cursor-pointer group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="text-gray-800 dark:text-gray-200 font-semibold">{classItem.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{classItem.subject}</p>
                                </div>
                                <span className="text-xs px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/30">
                                    {classItem.program}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                                <Users className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">{classItem.students === 'N/A' ? 'Active' : `${classItem.students} Students`}</span>
                            </div>
                            <button className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-primary dark:text-primary-400 shadow-sm text-sm font-medium transition-all border border-gray-200 dark:border-slate-600 group-hover:border-primary/50">
                                Mark Attendance
                            </button>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 p-6"
            >
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                        <motion.button
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-6 rounded-xl bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-700 transition-all group"
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 mx-auto shadow-sm group-hover:scale-110 transition-transform`}>
                                <action.icon className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-gray-800 dark:text-gray-200 font-medium text-sm">{action.label}</p>
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default StaffDashboardPage;
