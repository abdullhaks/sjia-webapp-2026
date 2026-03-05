import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { message } from '../../components/common/AntdStaticProvider';
import { motion } from 'framer-motion';
import { superAdminLoginSchema, SuperAdminLoginFormData } from '../../validations/authSchemas';
import { useAuthStore } from '../../store/authStore';
import authService from '../../services/api/auth.api';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SuperAdminLoginFormData>({
        resolver: zodResolver(superAdminLoginSchema),
    });

    const onSubmit = async (data: SuperAdminLoginFormData) => {
        setIsLoading(true);
        try {
            const user = await authService.login({
                identifier: data.identifier,
                password: data.password,
            });

            setAuth(user);
            message.success(`Welcome back, ${user.firstName}!`);

            // Redirect based on role
            switch (user.role) {
                case 'superAdmin':
                case 'superadmin':
                    navigate('/superadmin/dashboard');
                    break;
                case 'staff':
                    navigate('/staff/dashboard');
                    break;
                case 'student':
                    navigate('/student/dashboard');
                    break;
                default:
                    navigate('/');
            }
        } catch (error: any) {
            message.error(
                error.response?.data?.message || 'Invalid email or password'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
            {/* Professional Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900" />

            {/* Subtle Grid Pattern */}
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
                {/* Login Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl px-12 py-2">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30">
                            <FiLogIn className="text-white text-2xl" />
                        </div>

                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
                            Sheikh Jeelani
                            <span className="block text-lg md:text-xl font-normal text-white/60 mt-1">
                                Islamic Academy
                            </span>
                        </h1>
                        <p className="text-white/40 text-sm mt-3">
                            Sign in to access the management portal
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label
                                htmlFor="identifier"
                                className="block text-sm font-medium text-white/70 mb-2"
                            >
                                Email Address
                            </label>
                            <div className="relative group">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    {...register('identifier')}
                                    type="email"
                                    id="identifier"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                                    placeholder="admin@sjia.edu"
                                />
                            </div>
                            {errors.identifier && (
                                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                                    <span className="w-1 h-1 bg-red-400 rounded-full" />
                                    {errors.identifier.message}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-white/70 mb-2"
                            >
                                Password
                            </label>
                            <div className="relative group">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    {...register('password')}
                                    type="password"
                                    id="password"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
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

                        {/* Remember Me */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center cursor-pointer group">
                                <input
                                    {...register('rememberMe')}
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-white/30 bg-white/5 text-purple-600 focus:ring-purple-500/50 focus:ring-offset-0"
                                />
                                <span className="ml-2 text-sm text-white/60 group-hover:text-white/80 transition-colors">
                                    Remember me
                                </span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white font-medium py-3 rounded-xl shadow-lg shadow-purple-900/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <FiLogIn className="text-lg" />
                                    Sign In
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                        <p className="text-xs text-white/30">
                            © 2002-2026 Sheikh Jeelani Islamic Academy
                        </p>
                    </div>
                </div>

            </motion.div>
        </div>
    );
};

export default LoginPage;
