import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { FaBullseye, FaEye, FaHeart, FaBook, FaUsers, FaTrophy } from 'react-icons/fa';
import SectionWrapper from '../../common/SectionWrapper';
import AnimatedHeading from '../../common/AnimatedHeading';
import Card from '../../common/Card';
import { useCMSStore } from '../../../store/cmsStore';

const AboutSection: React.FC = () => {
    const { siteContent, leadership, fetchSiteContent, fetchLeadership } = useCMSStore();

    useEffect(() => {
        if (siteContent.length === 0) fetchSiteContent();
        fetchLeadership();
    }, [fetchSiteContent, fetchLeadership, siteContent.length]);

    const getContent = (key: string, fallback: string) => {
        const content = siteContent.find((c) => c.key === key);
        return content ? content.value : fallback;
    };

    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const stats = [
        { number: parseInt(getContent('stat-alumni-count', '2500')), suffix: '+', label: 'Alumni', icon: FaUsers },
        { number: parseInt(getContent('stat-students', '500')), suffix: '+', label: 'Current Students', icon: FaBook },
        { number: parseInt(getContent('stat-success-rate', '95')), suffix: '%', label: 'Success Rate', icon: FaTrophy },
        { number: parseInt(getContent('stat-faculty', '50')), suffix: '+', label: 'Expert Faculty', icon: FaUsers },
    ];

    const values = [
        {
            icon: FaBullseye,
            title: 'Excellence',
            description: 'Striving for academic and moral excellence in all endeavors',
        },
        {
            icon: FaHeart,
            title: 'Integrity',
            description: 'Upholding Islamic values and ethical principles',
        },
        {
            icon: FaUsers,
            title: 'Community',
            description: 'Building a supportive and inclusive learning environment',
        },
        {
            icon: FaBook,
            title: 'Knowledge',
            description: 'Pursuing both religious and worldly knowledge',
        },
        {
            icon: FaTrophy,
            title: 'Leadership',
            description: 'Developing future leaders with strong character',
        },
        {
            icon: FaEye,
            title: 'Vision',
            description: 'Preparing students for success in both worlds',
        },
    ];

    return (
        <SectionWrapper id="about" background="pattern">
            <div className="text-center mb-16 ">
                <AnimatedHeading level={2} gradient center className="mb-4 pt-16">
                    About Sheikh Jeelani Islamic Academy
                </AnimatedHeading>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-lg text-gray-600 max-w-3xl mx-auto"
                >
                    {getContent('about-description', 'Established in 2002, SJIA has been a beacon of Islamic education and modern learning, nurturing students to become successful individuals with strong moral foundations.')}
                </motion.p>
            </div>

            {/* Stats */}
            <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card variant="white" hover className="p-6 text-center">
                            <stat.icon className="text-4xl text-primary mx-auto mb-4" />
                            <div className="text-4xl font-bold text-primary mb-2">
                                {inView && (
                                    <CountUp
                                        end={stat.number}
                                        duration={2.5}
                                        suffix={stat.suffix}
                                    />
                                )}
                            </div>
                            <div className="text-gray-600 font-medium">{stat.label}</div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Vision & Mission */}
            <div className="grid md:grid-cols-2 gap-8 mb-20">
                <Card variant="glass" className="p-8">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4">
                            <FaEye className="text-white text-2xl" />
                        </div>
                        <h3 className="text-2xl font-bold text-primary">Our Vision</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                        {getContent('vision-text', 'To be a leading Islamic educational institution that combines traditional Islamic knowledge with modern academic excellence, producing graduates who are successful in both worldly pursuits and spiritual growth, contributing positively to society while upholding Islamic values.')}
                    </p>
                </Card>

                <Card variant="glass" className="p-8">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mr-4">
                            <FaBullseye className="text-white text-2xl" />
                        </div>
                        <h3 className="text-2xl font-bold text-accent">Our Mission</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                        {getContent('mission-text', 'To provide holistic education that integrates Islamic teachings with contemporary knowledge, fostering critical thinking, moral character, and professional skills. We aim to create an environment where students develop spiritually, intellectually, and socially to become responsible global citizens.')}
                    </p>
                </Card>
            </div>

            {/* Leadership Team (Dynamic) */}
            {leadership.length > 0 && (
                <div className="mb-20">
                    <AnimatedHeading level={3} center className="mb-12">
                        Our Leadership
                    </AnimatedHeading>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                        {leadership
                            .sort((a, b) => a.order - b.order)
                            .map((leader, index) => (
                                <motion.div
                                    key={leader._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.15 }}
                                >
                                    <Card variant="white" hover className="p-6 text-center h-full">
                                        <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full mb-4 overflow-hidden border-4 border-primary-100 shadow-lg">
                                            {leader.photoUrl ? (
                                                <img src={leader.photoUrl} alt={leader.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-4xl">👤</div>
                                            )}
                                        </div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-1">{leader.name}</h4>
                                        <div className="inline-block bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                                            {leader.position}
                                        </div>
                                        {leader.bio && (
                                            <p className="text-gray-600 text-sm">{leader.bio}</p>
                                        )}
                                    </Card>
                                </motion.div>
                            ))}
                    </div>
                </div>
            )}

            {/* Core Values */}
            <div>
                <AnimatedHeading level={3} center className="mb-12">
                    Our Core Values
                </AnimatedHeading>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {values.map((value, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card variant="white" hover className="p-6 h-full">
                                <div className="w-14 h-14 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                                    <value.icon className="text-white text-2xl" />
                                </div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                                    {value.title}
                                </h4>
                                <p className="text-gray-600 leading-relaxed">
                                    {value.description}
                                </p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* History Timeline */}
            <div className="mt-20">
                <AnimatedHeading level={3} center className="mb-12">
                    Our Journey
                </AnimatedHeading>
                <div className="max-w-3xl mx-auto pb-16">
                    <Card variant="white" className="p-8">
                        <div className="space-y-6 ">
                            {[
                                {
                                    year: '2002',
                                    title: 'Foundation',
                                    description: 'SJIA was established with a vision to provide quality Islamic education',
                                },
                                {
                                    year: '2005',
                                    title: 'Expansion',
                                    description: 'Introduced higher secondary programs and expanded infrastructure',
                                },
                                {
                                    year: '2010',
                                    title: 'University Affiliation',
                                    description: 'Partnered with Kerala Open University for degree programs',
                                },
                                {
                                    year: '2020',
                                    title: 'Digital Transformation',
                                    description: 'Implemented modern learning management systems and online education',
                                },
                            ].map((milestone, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2 }}
                                    className="flex gap-4 pb"
                                >
                                    <div className="flex-shrink-0">
                                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                                            {milestone.year}
                                        </div>
                                    </div>
                                    <div className="flex-grow">
                                        <h5 className="text-lg font-semibold text-gray-900 mb-1">
                                            {milestone.title}
                                        </h5>
                                        <p className="text-gray-600">{milestone.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </SectionWrapper>
    );
};

export default AboutSection;
