import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaBook, FaUsers } from 'react-icons/fa';
import Button from '../../common/Button';
import { useCMSStore } from '../../../store/cmsStore';
import LoadingSpinner from '../../common/LoadingSpinner';

const HeroSection: React.FC = () => {
    const { siteContent, fetchSiteContent, loading } = useCMSStore();

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
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut' },
        },
    };

    if (loading && siteContent.length === 0) {
        return <div className="h-screen flex items-center justify-center bg-gradient-hero"><LoadingSpinner size="lg" color="white" /></div>;
    }

    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero"
        >
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 pattern-islamic opacity-30"></div>

            {/* Floating Orbs */}
            <motion.div
                animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="absolute top-20 left-10 w-64 h-64 bg-accent rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    y: [0, 20, 0],
                    opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="absolute bottom-20 right-10 w-96 h-96 bg-primary-400 rounded-full blur-3xl"
            />

            {/* Content */}
            <div className="relative z-10 container-custom text-center text-white pt-20">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-5xl mx-auto"
                >
                    {/* Islamic Greeting */}
                    <motion.div variants={itemVariants} className="mb-6 mt-32">
                        <p className="text-accent text-xl md:text-2xl font-arabic mb-2">
                            {getContent('hero-greeting-arabic', 'السلام عليكم ورحمة الله وبركاته')}
                        </p>
                        <p className="text-gray-200 text-sm md:text-base">
                            {getContent('hero-greeting-english', 'Peace be upon you and the mercy of Allah and His blessings')}
                        </p>
                    </motion.div>

                    {/* Quranic Verse */}
                    <motion.div
                        variants={itemVariants}
                        className="glass-dark rounded-2xl p-6 md:p-8 mb-8 max-w-3xl mx-auto"
                    >
                        <p className="text-2xl md:text-3xl font-arabic mb-3 leading-relaxed">
                            {getContent('hero-verse-arabic', 'قُلْ هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ')}
                        </p>
                        <p className="text-gray-300 text-sm md:text-base italic">
                            "{getContent('hero-verse-english', 'Say: Are those who know equal to those who do not know?')}"
                        </p>
                        <p className="text-accent text-xs md:text-sm mt-2">
                            - {getContent('hero-verse-ref', 'Quran 39:9')}
                        </p>
                    </motion.div>

                    {/* College Name */}
                    <motion.div variants={itemVariants}>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 font-display">
                            {getContent('college-name-main', 'Sheikh Jeelani')}
                            <span className="block text-accent mt-2">{getContent('college-name-sub', 'Islamic Academy')}</span>
                        </h1>
                        <div className="inline-flex items-center glass-dark px-6 py-2 rounded-full mb-6">
                            <span className="text-accent font-semibold">★</span>
                            <span className="mx-2 text-gray-300">Established</span>
                            <span className="text-accent font-bold">{getContent('college-established-year', '2002')}</span>
                        </div>
                    </motion.div>

                    {/* Tagline */}
                    <motion.p
                        variants={itemVariants}
                        className="text-lg md:text-xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed"
                    >
                        {getContent('hero-tagline', 'Empowering minds with Islamic values and modern education, preparing students for success in this world and the hereafter.')}
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
                    >
                        <Button
                            variant="accent"
                            size="lg"
                            icon={<FaGraduationCap />}
                            onClick={() => {
                                const contactSection = document.querySelector('#contact');
                                contactSection?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            Apply Now
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            icon={<FaBook />}
                            onClick={() => {
                                const programsSection = document.querySelector('#programs');
                                programsSection?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            Explore Programs
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            icon={<FaUsers />}
                            onClick={() => {
                                const campusSection = document.querySelector('#campus');
                                campusSection?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            Virtual Tour
                        </Button>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        variants={itemVariants}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-20"
                    >
                        {[
                            { number: getContent('stat-students', '500+'), label: 'Students' },
                            { number: getContent('stat-faculty', '50+'), label: 'Faculty Members' },
                            { number: getContent('stat-years', '20+'), label: 'Years of Excellence' },
                        ].map((stat, index) => (
                            <div
                                key={index}
                                className="glass-dark rounded-xl p-6 hover:scale-105 transition-transform duration-300"
                            >
                                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-gray-300 text-sm md:text-base">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

       
        
            </div>
        </section>
    );
};

export default HeroSection;
