import React from 'react';
import { motion } from 'framer-motion';

// Exclude conflicting animation event handlers from React's button props
interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'> {
    variant?: 'primary' | 'secondary' | 'accent' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
    isLoading?: boolean;
    icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    children,
    isLoading = false,
    icon,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary shadow-md hover:shadow-lg hover:scale-105',
        secondary: 'bg-white dark:bg-slate-800 text-primary dark:text-emerald-400 border-2 border-primary dark:border-emerald-500 hover:bg-primary dark:hover:bg-emerald-500 hover:text-white dark:hover:text-slate-900 focus:ring-primary shadow-sm hover:shadow-md',
        accent: 'bg-accent text-white hover:bg-accent-dark focus:ring-accent shadow-md hover:shadow-glow-accent hover:scale-105',
        outline: 'border-2 border-white dark:border-slate-700 text-white dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 hover:text-primary dark:hover:text-emerald-400 focus:ring-white dark:focus:ring-slate-700',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    return (
        <motion.button
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    Loading...
                </>
            ) : (
                <>
                    {icon && <span>{icon}</span>}
                    {children}
                </>
            )}
        </motion.button>
    );
};

export default Button;
