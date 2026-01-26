import React from 'react';

const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; color?: string }> = ({ size = 'md', color = 'primary-200' }) => {
    const sizes = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };

    // If color is a hex/rgb value or a tailwind color class not in primary theme
    // We might need to handle it. 
    // If 'white', we want border-white/20 and border-t-white.
    // Simplifying to assume color prop handles valid class parts or standard colors.

    // For now, let's keep it simple. If color is 'white', we use specific classes.
    // Otherwise fallback to primary.
    const isWhite = color === 'white';
    const baseBorderColor = isWhite ? 'border-white/20' : 'border-primary-200';
    const activeBorderColor = isWhite ? 'border-t-white' : 'border-t-primary';

    return (
        <div className="flex items-center justify-center">
            <div className={`${sizes[size]} relative`}>
                <div className={`absolute inset-0 border-4 ${baseBorderColor} rounded-full`}></div>
                <div className={`absolute inset-0 border-4 border-transparent ${activeBorderColor} rounded-full animate-spin`}></div>
            </div>
        </div>
    );
};

export default LoadingSpinner;
