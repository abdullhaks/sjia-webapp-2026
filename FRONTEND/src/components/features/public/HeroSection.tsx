import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMonitor, FiUsers, FiBookOpen } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useCMSStore } from '../../../store/cmsStore';
import LoadingSpinner from '../../common/LoadingSpinner';

const HeroSection: React.FC = () => {
    const { siteContent, fetchSiteContent, loading } = useCMSStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchSiteContent();
    }, [fetchSiteContent]);

    const getContent = (key: string, fallback: string) => {
        const content = siteContent.find((c) => c.key === key);
        return content ? content.value : fallback;
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 30 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.25, 0.8, 0.25, 1] },
        },
    };

    if (loading && siteContent.length === 0) {
        return <div className="h-screen flex items-center justify-center bg-gray-900"><LoadingSpinner size="lg" color="white" /></div>;
    }

    const portals = [
        {
            title: "Super Admin",
            desc: "System Management",
            icon: <FiMonitor />,
            path: "/superadmin-login",
            gradient: "from-indigo-600 to-indigo-900",
            hoverOverlay: "group-hover:bg-indigo-600/20",
            textColor: "text-indigo-300"
        },
        {
            title: "Staff Portal",
            desc: "Educator Access",
            icon: <FiUsers />,
            path: "/staff-login",
            gradient: "from-teal-600 to-teal-900",
            hoverOverlay: "group-hover:bg-teal-600/20",
            textColor: "text-teal-300"
        },
        {
            title: "Student Portal",
            desc: "Learning Dashboard",
            icon: <FiBookOpen />,
            path: "/student-login",
            gradient: "from-emerald-600 to-emerald-900",
            hoverOverlay: "group-hover:bg-emerald-600/20",
            textColor: "text-emerald-300"
        }
    ];

    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-950 pt-20 pb-32"
        >
            {/* Immersive Background */}
            <div className="absolute inset-0">
                {getContent('hero-background-image', '') && (
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 mix-blend-luminosity"
                        style={{ backgroundImage: `url(${getContent('hero-background-image', '')})` }}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-950/90 to-gray-950 z-10" />

                {/* Dynamic Lighting Orbs */}
                <motion.div
                    animate={{ x: [-50, 50, -50], y: [-50, 50, -50], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-[100px] z-10"
                />
                <motion.div
                    animate={{ x: [50, -50, 50], y: [50, -50, 50], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear', delay: 2 }}
                    className="absolute bottom-1/4 right-1/4 w-[40rem] h-[40rem] bg-emerald-500/10 rounded-full blur-[100px] z-10"
                />
            </div>

            {/* Main Content */}
            <div className="relative z-20 container mx-auto px-4 w-full text-center">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-6xl mx-auto"
                >
                    {/* Welcome Header */}
                    <motion.div variants={itemVariants} className="mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 shadow-xl w-auto">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-white/80 text-sm font-medium tracking-wide uppercase">Admissions Open 2026</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-4 leading-tight">
                            Sheikh Jeelani
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 mt-2">
                                Islamic Academy
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-400 font-light max-w-3xl mx-auto leading-relaxed">
                            {getContent('hero-tagline', 'Excellence in Islamic Education Since 2002. Cultivating wisdom, faith, and modern knowledge for a brighter tomorrow.')}
                        </p>
                    </motion.div>

                    {/* Portal Selection Grid - This directly answers the prompt */}
                    <motion.div variants={itemVariants} className="mt-20">
                        <h2 className="text-white/60 text-sm font-bold tracking-[0.2em] uppercase mb-8">Access Your Portal</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {portals.map((portal, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate(portal.path)}
                                    className="group relative cursor-pointer rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl transition-all duration-300"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${portal.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                                    <div className="p-8 md:p-10 relative z-10 flex flex-col items-center justify-center min-h-[240px]">
                                        <div className={`w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-3xl mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300 ${portal.textColor}`}>
                                            {portal.icon}
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">{portal.title}</h3>
                                        <p className="text-gray-400 text-sm">{portal.desc}</p>

                                        <div className="mt-8 flex items-center justify-center gap-2 text-white/40 group-hover:text-white/90 transition-colors">
                                            <span className="text-sm font-semibold tracking-wider">SECURE LOGIN</span>
                                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-white/30 to-transparent" />
            </motion.div>
        </section>
    );
};

export default HeroSection;
