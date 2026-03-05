import React from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-4"
        >
            <div className="glass-white dark:bg-slate-800/80 rounded-2xl p-12 max-w-md w-full text-center border dark:border-slate-700">
                {icon && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="flex justify-center mb-6"
                    >
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-4xl">
                            {icon}
                        </div>
                    </motion.div>
                )}
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{title}</h3>
                {description && (
                    <p className="text-gray-500 dark:text-gray-400 mb-6">{description}</p>
                )}
                {action && <div className="mt-4">{action}</div>}
            </div>
        </motion.div>
    );
};

export default EmptyState;
