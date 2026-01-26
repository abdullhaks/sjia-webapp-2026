import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedHeadingProps {
    children: ReactNode;
    level?: 1 | 2 | 3 | 4;
    className?: string;
    gradient?: boolean;
    center?: boolean;
}

const AnimatedHeading = ({
    children,
    level = 2,
    className = '',
    gradient = false,
    center = false,
}: AnimatedHeadingProps) => {
    const sizes = {
        1: 'text-4xl md:text-5xl lg:text-6xl font-bold',
        2: 'text-3xl md:text-4xl lg:text-5xl font-bold',
        3: 'text-2xl md:text-3xl lg:text-4xl font-semibold',
        4: 'text-xl md:text-2xl lg:text-3xl font-semibold',
    };

    const gradientClass = gradient ? 'text-gradient-primary' : 'text-gray-900';
    const alignClass = center ? 'text-center' : '';
    const combinedClassName = `${sizes[level]} ${gradientClass} ${alignClass} ${className}`;

    const motionProps: HTMLMotionProps<'div'> = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 },
    };

    const renderHeading = () => {
        switch (level) {
            case 1: return <h1 className={combinedClassName}>{children}</h1>;
            case 2: return <h2 className={combinedClassName}>{children}</h2>;
            case 3: return <h3 className={combinedClassName}>{children}</h3>;
            case 4: return <h4 className={combinedClassName}>{children}</h4>;
            default: return <h2 className={combinedClassName}>{children}</h2>;
        }
    };

    return (
        <motion.div {...motionProps}>
            {renderHeading()}
        </motion.div>
    );
};

export default AnimatedHeading;

