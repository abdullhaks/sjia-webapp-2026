import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaHandsHelping, FaBullhorn, FaBookReader, FaHeart } from 'react-icons/fa';
import SectionWrapper from '../../common/SectionWrapper';
import AnimatedHeading from '../../common/AnimatedHeading';
import { useStudentStore } from '../../../store/studentStore';
import LoadingSpinner from '../../common/LoadingSpinner';

const StudentCouncilSection: React.FC = () => {
    const { councilMembers, fetchCouncilMembers, loading } = useStudentStore();

    useEffect(() => {
        fetchCouncilMembers();
    }, [fetchCouncilMembers]);

    const departments = [
        { icon: FaBookReader, title: 'Academic', desc: 'Study circles & peer tutoring' },
        { icon: FaBullhorn, title: 'Cultural', desc: 'Arts fest & literary events' },
        { icon: FaHeart, title: 'Welfare', desc: 'Student well-being & support' },
        { icon: FaHandsHelping, title: 'Social Service', desc: 'Community outreach' },
    ];

    return (
        <SectionWrapper id="student-council" background="white">
            <div className="text-center mb-16">
                <AnimatedHeading level={2} gradient center className="mb-4 pt-16">
                    Student Council
                </AnimatedHeading>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-lg text-gray-600 max-w-3xl mx-auto"
                >
                    Fostering leadership, responsibility, and democratic values through
                    active student representation and participation.
                </motion.p>
            </div>

            {/* Top Leaders */}
            {loading ? (
                <LoadingSpinner />
            ) : councilMembers.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-8 mb-20 justify-center">
                    {councilMembers.map((member, index) => (
                        <motion.div
                            key={member._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.15 }}
                            viewport={{ once: true }}
                        >
                            <div className={`relative group h-full ${index % 3 === 1 ? 'md:-mt-8' : ''}`}>
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-white rounded-2xl transform rotate-3 transition-transform group-hover:rotate-6"></div>
                                <div className="relative bg-white p-8 rounded-2xl shadow-lg border border-gray-100 h-full flex flex-col items-center text-center transition-transform group-hover:-translate-y-2">
                                    <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center overflow-hidden mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                        {member.photoUrl ? (
                                            <img src={member.photoUrl} alt={member.firstName} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-4xl">🎓</span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">{member.firstName} {member.lastName}</h3>
                                    <p className="text-primary font-semibold mb-2">{member.councilPosition}</p>
                                    <p className="text-xs text-gray-400 mb-4">{member.currentClass}</p>
                                    <div className="mt-auto">
                                        <p className="text-gray-600 italic text-sm">"Leading with Integrity"</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 mb-20">Student council members will be announced soon.</div>
            )}

            {/* Departments Grid */}
            <div className="bg-gray-50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 pattern-islamic"></div>

                <div className="relative z-10 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-4 text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                            <FaUsers className="text-primary" />
                            Council Departments
                        </h3>
                    </div>

                    {departments.map((dept, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
                        >
                            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center text-primary text-xl mb-4">
                                <dept.icon />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2">{dept.title}</h4>
                            <p className="text-sm text-gray-600">{dept.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </SectionWrapper>
    );
};

export default StudentCouncilSection;
