import React, { useState } from 'react';

interface AvatarProps {
    src?: string;
    alt: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    className?: string;
    fallback?: string; // Initials to show if image fails
}

const Avatar: React.FC<AvatarProps> = ({
    src,
    alt,
    size = 'md',
    className = '',
    fallback
}) => {
    const [imageError, setImageError] = useState(false);

    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-16 h-16 text-xl',
        xl: 'w-24 h-24 text-3xl',
        '2xl': 'w-32 h-32 text-4xl',
    };

    const getInitials = (name: string) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map(part => part[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    const initials = fallback || getInitials(alt);

    return (
        <div
            className={`
                ${sizeClasses[size]} 
                rounded-full 
                overflow-hidden 
                flex items-center justify-center 
                bg-gradient-to-br from-primary-500 to-primary-700 
                text-white font-bold shadow-md border-2 border-white/20
                ${className}
            `}
        >
            {!imageError && src ? (
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                />
            ) : (
                <span>{initials}</span>
            )}
        </div>
    );
};

export default Avatar;
