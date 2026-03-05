import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { message } from '../../components/common/AntdStaticProvider';
import { motion } from 'framer-motion';
import { staffStudentLoginSchema, StaffStudentLoginFormData } from '../../validations/authSchemas';
import { useAuthStore } from '../../store/authStore';
import authService from '../../services/api/auth.api';
import { FiUser, FiLock, FiLogIn } from 'react-icons/fi';

const StaffLoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<StaffStudentLoginFormData>({
        resolver: zodResolver(staffStudentLoginSchema),
    });

    const onSubmit = async (data: StaffStudentLoginFormData) => {
        setIsLoading(true);
        try {
            const user = await authService.login({
                identifier: data.identifier,
                password: data.password,
            });

            if (user.role !== 'staff') {
                await authService.logout();
                throw new Error('This portal is only for staff members');
            }

            setAuth(user);
            message.success(`Welcome back, ${user.firstName}!`);
            navigate('/staff/dashboard');

        } catch (error: any) {
            message.error(
                error.message === 'This portal is only for staff members' ? error.message :
                    error.response?.data?.message || 'Invalid email/phone or password'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-teal-900/30 to-slate-900" />

            <div className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full max-w-md relative z-10 px-6"
            >
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl px-12 py-8">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-500/30">
                            <FiLogIn className="text-white text-2xl" />
                        </div>

                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
                            Staff Portal
                            <span className="block text-lg md:text-xl font-normal text-white/60 mt-1">
                                Educator Access
                            </span>
                        </h1>
                        <p className="text-white/40 text-sm mt-3">
                            Sign in with your email or phone number
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label
                                htmlFor="identifier"
                                className="block text-sm font-medium text-white/70 mb-2"
                            >
                                Email Address or Phone Number
                            </label>
                            <div className="relative group">
                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-teal-400 transition-colors" />
                                <input
                                    {...register('identifier')}
                                    type="text"
                                    id="identifier"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all"
                                    placeholder="Enter email or phone"
                                />
                            </div>
                            {errors.identifier && (
                                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                                    <span className="w-1 h-1 bg-red-400 rounded-full" />
                                    {errors.identifier.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-white/70 mb-2"
                            >
                                Password
                            </label>
                            <div className="relative group">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-teal-400 transition-colors" />
                                <input
                                    {...register('password')}
                                    type="password"
                                    id="password"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                                    <span className="w-1 h-1 bg-red-400 rounded-full" />
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-teal-600 to-teal-800 hover:from-teal-500 hover:to-teal-700 text-white font-medium py-3 rounded-xl shadow-lg shadow-teal-900/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <FiLogIn className="text-lg" />
                                    Sign In as Staff
                                </>
                            )}
                        </motion.button>
                        <div className="text-center mt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="text-sm text-white/50 hover:text-white transition-colors"
                            >
                                Back to Home
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default StaffLoginPage;
