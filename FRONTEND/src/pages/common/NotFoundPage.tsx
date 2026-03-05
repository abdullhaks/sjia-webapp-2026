import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const NotFoundPage: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 relative overflow-hidden px-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="text-center relative z-10 max-w-lg"
            >
                {/* Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-amber-500/30"
                >
                    <FaExclamationTriangle className="text-white text-4xl" />
                </motion.div>

                {/* Text */}
                <h1 className="text-7xl font-black text-white mb-4 tracking-tight">404</h1>
                <h2 className="text-2xl font-bold text-white/80 mb-4">Page Not Found</h2>
                <p className="text-white/50 mb-10 leading-relaxed">
                    The page you're looking for doesn't exist or has been moved.
                    <br />
                    Let's get you back on track.
                </p>

                {/* CTA */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-900/30 transition-all duration-300 hover:scale-105"
                >
                    <FaHome />
                    Go Home
                </Link>
            </motion.div>
        </div>
    );
};

export default NotFoundPage;
