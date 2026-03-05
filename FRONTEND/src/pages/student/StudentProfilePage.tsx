import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useStudentStore } from '../../store/studentStore';
import { useAttendanceStore } from '../../store/attendanceStore';
import { useResultStore } from '../../store/resultStore';
import { FaUser, FaEnvelope, FaIdCard, FaBuilding, FaPhone, FaLock, FaCamera, FaMedal, FaStar, FaCalendarCheck } from 'react-icons/fa';
import axiosInstance from '../../services/axios/authAxios';
import Avatar from '../../components/common/Avatar';

import EditStudentProfileModal from '../../components/features/student/EditStudentProfileModal';
import StudentFolderSection from '../../components/features/student/StudentFolderSection';

const StudentProfilePage: React.FC = () => {
    const { user } = useAuthStore();
    const { currentStudent, loading, error, fetchCurrentStudent } = useStudentStore();
    const { stats: attStats, fetchAttendanceStats } = useAttendanceStore();
    const { results, fetchMyResults } = useResultStore();

    useEffect(() => {
        fetchCurrentStudent();
        fetchMyResults();
    }, [fetchCurrentStudent, fetchMyResults]);

    useEffect(() => {
        if (currentStudent?._id) {
            fetchAttendanceStats(currentStudent._id);
        }
    }, [currentStudent?._id, fetchAttendanceStats]);

    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return;
        }

        try {
            await axiosInstance.post('/auth/change-password', {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });
            setPasswordSuccess('Password changed successfully!');
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setIsChangePasswordOpen(false), 2000);
        } catch (err: any) {
            setPasswordError(err.response?.data?.message || 'Failed to change password');
        }
    };

    const isTopper = useMemo(() => {
        if (!results || results.length === 0) return false;
        const avg = results.reduce((acc, curr: any) => acc + (curr.percentage || 0), 0) / results.length;
        return avg >= 90;
    }, [results]);

    const isPerfectAttendance = useMemo(() => {
        return attStats && attStats.percentage >= 95;
    }, [attStats]);

    if (loading || (!currentStudent && !error)) return <div className="p-8 text-center flex justify-center items-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
    if (error) return <div className="p-8 text-center text-red-500 bg-white rounded-xl shadow-sm m-4">{error}</div>;
    if (!currentStudent) return <div className="p-8 text-center text-red-500">Failed to load profile. Please contact admin.</div>;

    const badges = [];
    if (currentStudent.councilPosition) badges.push({ type: 'council', icon: <FaMedal />, title: 'Council Member', desc: currentStudent.councilPosition, colors: 'bg-yellow-50 border-yellow-200 text-yellow-600', iconBg: 'bg-yellow-100', titleColor: 'text-yellow-800' });
    if (isTopper) badges.push({ type: 'star', icon: <FaStar />, title: 'Academic Star', desc: 'Top Performer (90%+)', colors: 'bg-indigo-50 border-indigo-200 text-indigo-600', iconBg: 'bg-indigo-100', titleColor: 'text-indigo-800' });
    if (isPerfectAttendance) badges.push({ type: 'attendance', icon: <FaCalendarCheck />, title: 'Perfect Explorer', desc: '95%+ Attendance', colors: 'bg-emerald-50 border-emerald-200 text-emerald-600', iconBg: 'bg-emerald-100', titleColor: 'text-emerald-800' });

    if (badges.length === 0) badges.push({ type: 'default', icon: <FaUser />, title: 'Active Student', desc: 'Enrolled Member', colors: 'bg-gray-50 border-gray-200 text-gray-500', iconBg: 'bg-gray-100', titleColor: 'text-gray-700' });

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <EditStudentProfileModal
                isOpen={isEditProfileOpen}
                onClose={() => setIsEditProfileOpen(false)}
                currentStudent={currentStudent}
            />

            {/* Change Password Modal */}
            {isChangePasswordOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-200 dark:border-slate-800"
                    >
                        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Change Password</h2>
                        {passwordError && <div className="p-3 mb-4 bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-300 text-sm rounded-lg border border-red-100 dark:border-red-500/20">{passwordError}</div>}
                        {passwordSuccess && <div className="p-3 mb-4 bg-green-50 dark:bg-green-500/20 text-green-600 dark:text-green-300 text-sm rounded-lg border border-green-100 dark:border-green-500/20">{passwordSuccess}</div>}

                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                                <input
                                    type="password"
                                    value={passwordData.oldPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                    className="w-full p-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="w-full p-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="w-full p-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsChangePasswordOpen(false)}
                                    className="flex-1 py-2 px-4 border border-gray-300 dark:border-slate-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200"
                                >
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden"
            >
                {/* Cover Image */}
                <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                </div>

                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="relative group">
                            <div className="p-1 bg-white dark:bg-slate-900 rounded-full">
                                <Avatar
                                    src={currentStudent.photoUrl || user?.photoUrl}
                                    alt={currentStudent.firstName}
                                    size="xl"
                                    className="w-24 h-24 border-4 border-white dark:border-slate-900 shadow-md bg-gray-100 dark:bg-slate-800"
                                />
                            </div>
                            <button onClick={() => setIsEditProfileOpen(true)} className="absolute bottom-1 right-1 p-2 bg-gray-900/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs border border-white">
                                <FaCamera />
                            </button>
                        </div>
                        <button onClick={() => setIsEditProfileOpen(true)} className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all shadow-md shadow-gray-300 active:scale-95">
                            Edit Profile
                        </button>
                    </div>

                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
                            {currentStudent.firstName} {currentStudent.lastName}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium mt-1 uppercase tracking-wide text-xs">Student • ID #{currentStudent.admissionNumber}</p>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Personal Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="md:col-span-2 space-y-6"
                >
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-500 dark:text-blue-400"><FaUser /></div> Personal Information
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Full Name</label>
                                <p className="text-gray-900 dark:text-gray-200 font-semibold text-base">{currentStudent.firstName} {currentStudent.lastName}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Admission Number</label>
                                <p className="text-gray-900 dark:text-gray-200 font-semibold text-base flex items-center gap-2">
                                    <FaIdCard className="text-gray-300 dark:text-gray-500" />
                                    {currentStudent.admissionNumber}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Email Address</label>
                                <p className="text-gray-900 dark:text-gray-200 font-semibold text-base flex items-center gap-2">
                                    <FaEnvelope className="text-gray-300 dark:text-gray-500" />
                                    {currentStudent.email || 'N/A'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Phone Number</label>
                                <p className="text-gray-900 dark:text-gray-200 font-semibold text-base flex items-center gap-2">
                                    <FaPhone className="text-gray-300 dark:text-gray-500" />
                                    {currentStudent.phone || 'N/A'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Address</label>
                                <p className="text-gray-900 dark:text-gray-200 font-semibold text-base flex items-center gap-2">
                                    <FaBuilding className="text-gray-300 dark:text-gray-500" />
                                    {currentStudent.address || 'N/A'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Date of Birth</label>
                                <p className="text-gray-900 dark:text-gray-200 font-semibold text-base">
                                    {new Date(currentStudent.dateOfBirth).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
                            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-500 dark:text-purple-400"><FaBuilding /></div> Academic Information
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Class / Grade</label>
                                <div>
                                    <span className="inline-flex px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-sm font-bold border border-indigo-100 dark:border-indigo-900/50">
                                        {currentStudent.currentClass}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Roll Number</label>
                                <p className="text-gray-900 dark:text-gray-200 font-bold text-xl text-indigo-600 dark:text-indigo-400">#{currentStudent.admissionNumber.slice(-3)}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Parent Name</label>
                                <p className="text-gray-900 dark:text-gray-200 font-semibold text-base">{currentStudent.guardianName}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Parent Phone</label>
                                <p className="text-gray-900 dark:text-gray-200 font-semibold text-base">{currentStudent.guardianPhone}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Security & Achievements */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
                            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg text-yellow-500 text-xl font-mono">🏆</div> Badges & Roles
                        </h2>
                        <div className="space-y-3">
                            <AnimatePresence>
                                {badges.map((badge, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.9, x: -20 }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        transition={{ delay: 0.3 + (idx * 0.1) }}
                                        className={`flex items-center gap-3 p-3 border rounded-xl shadow-sm ${badge.colors}`}
                                    >
                                        <div className={`w-12 h-12 ${badge.iconBg} rounded-xl flex items-center justify-center text-xl shadow-inner border border-white/40 dark:border-white/10`}>
                                            {badge.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-extrabold ${badge.titleColor} truncate`}>{badge.title}</p>
                                            <p className="text-xs opacity-80 font-medium truncate">{badge.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <div className="p-2 bg-gray-50 dark:bg-slate-800/50 rounded-lg text-gray-500 dark:text-gray-400"><FaLock /></div> Security
                        </h2>
                        <button
                            onClick={() => setIsChangePasswordOpen(true)}
                            className="w-full py-3 px-4 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl transition-all border border-gray-200 dark:border-slate-700 text-sm mb-3 shadow-sm hover:shadow active:scale-[0.98]"
                        >
                            Change Password
                        </button>
                        <p className="text-xs text-gray-400 font-medium text-center bg-gray-50 dark:bg-slate-800 py-2 rounded-lg border border-dashed border-gray-200 dark:border-slate-700">
                            Keeps your account secure
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Folder / Media Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <StudentFolderSection />
            </motion.div>
        </div>
    );
};

export default StudentProfilePage;
