import React from 'react';

interface SectionWrapperProps {
    children: React.ReactNode;
    id?: string;
    className?: string;
    background?: 'white' | 'pattern' | 'gradient' | 'dots';
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
    children,
    id,
    className = '',
    background = 'white',
}) => {
    const backgrounds = {
        white: 'bg-white',
        pattern: 'bg-gray-50 pattern-islamic',
        gradient: 'bg-gradient-to-br from-primary-50 to-white',
        dots: 'bg-white pattern-dots',
    };

    return (
        <section
            id={id}
            className={`section-padding ${backgrounds[background]} ${className}`}
        >
            <div className="container-custom">
                {children}
            </div>
        </section>
    );
};

export default SectionWrapper;
