import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useStudentStore } from '../../store/studentStore';
import { FaUser, FaEnvelope, FaIdCard, FaBuilding, FaPhone, FaLock, FaCamera } from 'react-icons/fa';
import axiosInstance from '../../services/axios/authAxios';
import Avatar from '../../components/common/Avatar';

import EditStudentProfileModal from '../../components/features/student/EditStudentProfileModal';

const StudentProfilePage: React.FC = () => {
    const { user } = useAuthStore();
    const { currentStudent, loading, fetchCurrentStudent } = useStudentStore();

    useEffect(() => {
        fetchCurrentStudent();
    }, [fetchCurrentStudent]);

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

    if (loading) return <div className="p-8 text-center">Loading profile...</div>;
    if (!currentStudent) return <div className="p-8 text-center text-red-500">Failed to load profile. Please contact admin.</div>;

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
                        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
                    >
                        <h2 className="text-xl font-bold mb-4">Change Password</h2>
                        {passwordError && <div className="p-3 mb-4 bg-red-50 text-red-600 text-sm rounded-lg">{passwordError}</div>}
                        {passwordSuccess && <div className="p-3 mb-4 bg-green-50 text-green-600 text-sm rounded-lg">{passwordSuccess}</div>}

                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                <input
                                    type="password"
                                    value={passwordData.oldPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsChangePasswordOpen(false)}
                                    className="flex-1 py-2 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 text-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
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
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
                {/* Cover Image */}
                <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600" />

                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="relative group">
                            <div className="p-1 bg-white rounded-full">
                                <Avatar
                                    src={currentStudent.photoUrl || user?.photoUrl}
                                    alt={currentStudent.firstName}
                                    size="xl"
                                    className="w-24 h-24 border-4 border-white shadow-md bg-gray-100"
                                />
                            </div>
                            <button onClick={() => setIsEditProfileOpen(true)} className="absolute bottom-1 right-1 p-2 bg-gray-900/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                                <FaCamera />
                            </button>
                        </div>
                        <button onClick={() => setIsEditProfileOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                            Edit Profile
                        </button>
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {currentStudent.firstName} {currentStudent.lastName}
                        </h1>
                        <p className="text-gray-500">Student • {currentStudent.admissionNumber}</p>
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
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FaUser className="text-blue-500" /> Personal Information
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500 uppercase">Full Name</label>
                                <p className="text-gray-900 font-medium">{currentStudent.firstName} {currentStudent.lastName}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500 uppercase">Admission Number</label>
                                <p className="text-gray-900 font-medium flex items-center gap-2">
                                    <FaIdCard className="text-gray-400" />
                                    {currentStudent.admissionNumber}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500 uppercase">Email Address</label>
                                <p className="text-gray-900 font-medium flex items-center gap-2">
                                    <FaEnvelope className="text-gray-400" />
                                    {currentStudent.email || 'N/A'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500 uppercase">Phone Number</label>
                                <p className="text-gray-900 font-medium flex items-center gap-2">
                                    <FaPhone className="text-gray-400" />
                                    {currentStudent.phone || 'N/A'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500 uppercase">Address</label>
                                <p className="text-gray-900 font-medium flex items-center gap-2">
                                    <FaBuilding className="text-gray-400" />
                                    {currentStudent.address || 'N/A'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500 uppercase">Date of Birth</label>
                                <p className="text-gray-900 font-medium">
                                    {new Date(currentStudent.dateOfBirth).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FaBuilding className="text-purple-500" /> Academic Information
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500 uppercase">Class</label>
                                <div className="inline-flex px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100">
                                    {currentStudent.currentClass}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500 uppercase">Roll Number</label>
                                <p className="text-gray-900 font-medium">#{currentStudent.admissionNumber.slice(-3)}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500 uppercase">Parent Name</label>
                                <p className="text-gray-900 font-medium">{currentStudent.guardianName}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500 uppercase">Parent Phone</label>
                                <p className="text-gray-900 font-medium">{currentStudent.guardianPhone}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Security */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FaLock className="text-green-500" /> Security
                        </h2>
                        <button
                            onClick={() => setIsChangePasswordOpen(true)}
                            className="w-full py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-xl transition-colors border border-gray-200 text-sm mb-3"
                        >
                            Change Password
                        </button>
                        <p className="text-xs text-gray-400 text-center">
                            Last changed: 30 days ago
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default StudentProfilePage;
