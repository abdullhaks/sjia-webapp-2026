import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGraduationCap, FaClock, FaCheckCircle, FaTimes } from 'react-icons/fa';
import SectionWrapper from '../../common/SectionWrapper';
import AnimatedHeading from '../../common/AnimatedHeading';
import Card from '../../common/Card';
import Button from '../../common/Button';
import { useCMSStore } from '../../../store/cmsStore';

interface Program {
    id: number;
    title: string;
    level: string;
    duration: string;
    description: string;
    highlights: string[];
    eligibility: string[];
    icon: string;
}

const ProgramsSection: React.FC = () => {
    const { siteContent, fetchSiteContent } = useCMSStore();
    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
    const [programs, setPrograms] = useState<Program[]>([]);

    useEffect(() => {
        if (siteContent.length === 0) fetchSiteContent();
    }, [fetchSiteContent]);

    useEffect(() => {
        const content = siteContent.find((c) => c.key === 'programs-json');
        if (content && content.value) {
            try {
                const parsedPrograms = JSON.parse(content.value);
                setPrograms(parsedPrograms);
            } catch (e) {
                console.error("Failed to parse programs-json", e);
                // Fallback to defaults if parsing fails
                setPrograms(defaultPrograms);
            }
        } else {
            setPrograms(defaultPrograms);
        }
    }, [siteContent]);

    const defaultPrograms: Program[] = [
        {
            id: 1,
            title: '8th Standard Preparation',
            level: 'Foundation',
            duration: '1 Year',
            description: 'Comprehensive preparation for 8th standard with Islamic studies integration',
            highlights: [
                'Core subjects with Islamic perspective',
                'Quranic studies and Arabic language',
                'Character development programs',
                'Interactive learning methods',
            ],
            eligibility: ['Completed 7th standard', 'Age: 12-13 years'],
            icon: '📚',
        },
        {
            id: 2,
            title: 'SSLC Program',
            level: 'Secondary',
            duration: '2 Years',
            description: 'Kerala State Board SSLC with comprehensive Islamic education',
            highlights: [
                'State board curriculum',
                'Islamic studies and Arabic',
                'Science and mathematics focus',
                'Exam preparation and guidance',
            ],
            eligibility: ['Completed 8th standard', 'Age: 13-15 years'],
            icon: '🎓',
        },
        {
            id: 3,
            title: 'Plus Two Program',
            level: 'Higher Secondary',
            duration: '2 Years',
            description: 'Higher secondary education with multiple stream options',
            highlights: [
                'Science, Commerce, and Arts streams',
                'Advanced Islamic studies',
                'Career counseling and guidance',
                'University entrance preparation',
            ],
            eligibility: ['Completed SSLC', 'Age: 15-17 years'],
            icon: '📖',
        },
        {
            id: 4,
            title: 'Degree Programs',
            level: 'Undergraduate',
            duration: '3-4 Years',
            description: 'Bachelor\'s degree programs affiliated with Kerala Open University',
            highlights: [
                'Multiple specializations available',
                'Flexible learning schedules',
                'Industry-relevant curriculum',
                'Research opportunities',
            ],
            eligibility: ['Completed Plus Two', 'Age: 17+ years'],
            icon: '🎯',
        },
        {
            id: 5,
            title: 'PG Programs',
            level: 'Postgraduate',
            duration: '2 Years',
            description: 'Master\'s degree programs for advanced learning',
            highlights: [
                'Specialized knowledge areas',
                'Research and thesis work',
                'Expert faculty guidance',
                'Career advancement focus',
            ],
            eligibility: ['Completed Bachelor\'s degree', 'Age: 20+ years'],
            icon: '🏆',
        },
    ];

    return (
        <SectionWrapper id="programs" background="white">
            <div className="text-center mb-16 pt-16">
                <AnimatedHeading level={2} gradient center className="mb-4">
                    Our Academic Programs
                </AnimatedHeading>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-lg text-gray-600 max-w-3xl mx-auto"
                >
                    From foundation to postgraduate studies, we offer comprehensive programs
                    that blend Islamic values with modern education.
                </motion.p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
                {programs.map((program, index) => (
                    <motion.div
                        key={program.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card
                            variant="white"
                            hover
                            className="p-6 h-full flex flex-col group hover:scale-105 transition-transform duration-300 hover:shadow-lg"
                            onClick={() => setSelectedProgram(program)}
                        >
                            {/* Icon */}
                            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                {program.icon}
                            </div>

                            {/* Level Badge */}
                            <div className="inline-flex items-center bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium mb-3 w-fit">
                                {program.level}
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                                {program.title}
                            </h3>

                            {/* Duration */}
                            <div className="flex items-center text-gray-600 mb-4">
                                <FaClock className="mr-2 text-accent" />
                                <span>{program.duration}</span>
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 mb-4 flex-grow">
                                {program.description}
                            </p>

                            {/* Highlights Preview */}
                            <div className="space-y-2 mb-4">
                                {program.highlights.slice(0, 2).map((highlight, idx) => (
                                    <div key={idx} className="flex items-start text-sm text-gray-600">
                                        <FaCheckCircle className="text-success mr-2 mt-1 flex-shrink-0" />
                                        <span>{highlight}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Learn More Button */}
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full mt-auto"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedProgram(program);
                                }}
                            >
                                Learn More
                            </Button>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Program Details Modal */}
            <AnimatePresence>
                {selectedProgram && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedProgram(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="bg-gradient-primary p-6 text-white relative">
                                <button
                                    onClick={() => setSelectedProgram(null)}
                                    className="absolute top-4 right-4 text-white hover:text-accent transition-colors"
                                >
                                    <FaTimes size={24} />
                                </button>
                                <div className="text-5xl mb-4">{selectedProgram.icon}</div>
                                <h2 className="text-3xl font-bold mb-2">{selectedProgram.title}</h2>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="bg-white/20 px-3 py-1 rounded-full">
                                        {selectedProgram.level}
                                    </span>
                                    <span className="flex items-center">
                                        <FaClock className="mr-2" />
                                        {selectedProgram.duration}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                {/* Description */}
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        About This Program
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {selectedProgram.description}
                                    </p>
                                </div>

                                {/* Highlights */}
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                        Program Highlights
                                    </h3>
                                    <div className="space-y-2">
                                        {selectedProgram.highlights.map((highlight, idx) => (
                                            <div key={idx} className="flex items-start">
                                                <FaCheckCircle className="text-success mr-3 mt-1 flex-shrink-0" />
                                                <span className="text-gray-600">{highlight}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Eligibility */}
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                        Eligibility Criteria
                                    </h3>
                                    <div className="space-y-2">
                                        {selectedProgram.eligibility.map((criteria, idx) => (
                                            <div key={idx} className="flex items-start">
                                                <FaGraduationCap className="text-primary mr-3 mt-1 flex-shrink-0" />
                                                <span className="text-gray-600">{criteria}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="pt-4">
                                    <Button
                                        variant="accent"
                                        size="lg"
                                        className="w-full"
                                        onClick={() => {
                                            setSelectedProgram(null);
                                            const contactSection = document.querySelector('#contact');
                                            contactSection?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                    >
                                        Apply for This Program
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </SectionWrapper>
    );
};

export default ProgramsSection;
