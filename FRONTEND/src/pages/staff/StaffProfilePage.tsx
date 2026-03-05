import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useStaffStore } from '../../store/staffStore';
import { FaUser, FaLock } from 'react-icons/fa';
import Avatar from '../../components/common/Avatar';
import axiosInstance from '../../services/axios/authAxios';
import EditStaffProfileModal from '../../components/features/staff/EditStaffProfileModal';

const StaffProfilePage: React.FC = () => {
    const { user } = useAuthStore();
    const { currentStaff, fetchCurrentStaff } = useStaffStore();
    const [loading, setLoading] = useState(true);

    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    useEffect(() => {
        const loadProfile = async () => {
            await fetchCurrentStaff();
            setLoading(false);
        };
        loadProfile();
    }, [fetchCurrentStaff]);

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
    if (!currentStaff) return <div className="p-8 text-center text-red-500">Failed to load profile. Please contact admin.</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <EditStaffProfileModal
                isOpen={isEditProfileOpen}
                onClose={() => setIsEditProfileOpen(false)}
                currentStaff={currentStaff}
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
                            <input type="password" placeholder="Current Password" value={passwordData.oldPassword} onChange={e => setPasswordData({ ...passwordData, oldPassword: e.target.value })} className="w-full p-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded focus:ring-2 focus:ring-emerald-500 outline-none" required />
                            <input type="password" placeholder="New Password" value={passwordData.newPassword} onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="w-full p-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded focus:ring-2 focus:ring-emerald-500 outline-none" required />
                            <input type="password" placeholder="Confirm Password" value={passwordData.confirmPassword} onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className="w-full p-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded focus:ring-2 focus:ring-emerald-500 outline-none" required />
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setIsChangePasswordOpen(false)} className="flex-1 p-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-slate-800">Cancel</button>
                                <button type="submit" className="flex-1 p-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">Update</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-600" />
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="p-1 bg-white dark:bg-slate-900 rounded-full">
                            <Avatar src={currentStaff.photoUrl || user?.photoUrl} alt={currentStaff.firstName} size="xl" className="w-24 h-24 border-4 border-white dark:border-slate-900 shadow-md bg-gray-100 dark:bg-slate-800" />
                        </div>
                        <button onClick={() => setIsEditProfileOpen(true)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-sm">Edit Profile</button>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{currentStaff.firstName} {currentStaff.lastName}</h1>
                        <p className="text-gray-500 dark:text-gray-400">{currentStaff.designation} • {currentStaff.department}</p>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="md:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2"><FaUser className="text-emerald-500" /> Personal Info</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div><label className="text-xs text-gray-500 dark:text-gray-400 uppercase">Employee ID</label><p className="font-medium text-gray-900 dark:text-gray-200">{currentStaff.employeeId}</p></div>
                            <div><label className="text-xs text-gray-500 dark:text-gray-400 uppercase">Email</label><p className="font-medium text-gray-900 dark:text-gray-200">{currentStaff.email}</p></div>
                            <div><label className="text-xs text-gray-500 dark:text-gray-400 uppercase">Phone</label><p className="font-medium text-gray-900 dark:text-gray-200">{currentStaff.phone}</p></div>
                            <div><label className="text-xs text-gray-500 dark:text-gray-400 uppercase">Qualification</label><p className="font-medium text-gray-900 dark:text-gray-200">{currentStaff.qualification}</p></div>
                        </div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2"><FaLock className="text-emerald-500" /> Security</h2>
                        <button onClick={() => setIsChangePasswordOpen(true)} className="w-full py-2 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium border border-gray-200 dark:border-slate-700">Change Password</button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default StaffProfilePage;
