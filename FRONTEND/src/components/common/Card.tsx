import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'glass' | 'white' | 'primary';
    hover?: boolean;
    onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
    children,
    className = '',
    variant = 'white',
    hover = false,
    onClick,
}) => {
    const variants = {
        glass: 'glass dark:glass-dark shadow-glass',
        white: 'bg-white dark:bg-slate-800 shadow-md',
        primary: 'glass-primary dark:glass-dark shadow-glass',
    };

    const hoverClass = hover ? 'card-interactive' : '';
    const cursorClass = onClick ? 'cursor-pointer' : '';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`rounded-xl overflow-hidden ${variants[variant]} ${hoverClass} ${cursorClass} ${className}`}
            onClick={onClick}
        >
            {children}
        </motion.div>
    );
};

export default Card;
