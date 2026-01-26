import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SectionWrapper from '../../common/SectionWrapper';
import AnimatedHeading from '../../common/AnimatedHeading';
import Card from '../../common/Card';
import { FaTrophy, FaMedal, FaChartLine } from 'react-icons/fa';
import { useResultStore } from '../../../store/resultStore';
import LoadingSpinner from '../../common/LoadingSpinner';

const AcademicExcellenceSection: React.FC = () => {
    const { toppers, fetchToppers, loading } = useResultStore();

    useEffect(() => {
        fetchToppers();
    }, [fetchToppers]);

    const resultsData = [
        { year: '2019', passRate: 92, distinctions: 45 },
        { year: '2020', passRate: 94, distinctions: 52 },
        { year: '2021', passRate: 96, distinctions: 68 },
        { year: '2022', passRate: 98, distinctions: 75 },
        { year: '2023', passRate: 100, distinctions: 82 },
    ];

    const getRankSuffix = (rank: number) => {
        if (rank === 1) return 'st Rank';
        if (rank === 2) return 'nd Rank';
        if (rank === 3) return 'rd Rank';
        return 'th Rank';
    };

    const getMedalColor = (index: number) => {
        if (index === 0) return 'text-yellow-400';
        if (index === 1) return 'text-gray-400';
        return 'text-orange-400';
    };

    const getGradient = (index: number) => {
        if (index === 0) return 'from-yellow-400 to-orange-500';
        if (index === 1) return 'from-gray-300 to-gray-400';
        return 'from-orange-400 to-red-500';
    };

    return (
        <SectionWrapper id="academic-excellence" background="pattern">
            <div className="text-center mb-16 pt-16">
                <AnimatedHeading level={2} gradient center className="mb-4">
                    Academic Excellence
                </AnimatedHeading>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-lg text-gray-600 max-w-3xl mx-auto"
                >
                    Celebrating our tradition of outstanding academic performance and
                    continuous improvement in educational standards.
                </motion.p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
                {/* Chart Section */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100"
                >
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary-800">
                        <FaChartLine className="text-accent" />
                        5-Year Performance Analysis
                    </h3>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={resultsData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="year" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    cursor={{ fill: '#f3f4f6' }}
                                />
                                <Bar dataKey="passRate" name="Pass Rate %" fill="#9B59B6" radius={[4, 4, 0, 0]} barSize={30} />
                                <Bar dataKey="distinctions" name="Distinctions" fill="#F39C12" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Highlights Text */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Card variant="white" className="p-6 border-l-4 border-l-primary mb-6">
                            <h4 className="text-lg font-bold text-gray-900 mb-2">100% Pass Rate</h4>
                            <p className="text-gray-600">
                                Consistently achieving 100% pass rate in public examinations for the past 3 consecutive years.
                            </p>
                        </Card>
                        <Card variant="white" className="p-6 border-l-4 border-l-accent mb-6">
                            <h4 className="text-lg font-bold text-gray-900 mb-2">State Rank Holders</h4>
                            <p className="text-gray-600">
                                12 State rank holders produced in the last academic year across various disciplines.
                            </p>
                        </Card>
                        <Card variant="white" className="p-6 border-l-4 border-l-secondary mb-6">
                            <h4 className="text-lg font-bold text-gray-900 mb-2">University Toppers</h4>
                            <p className="text-gray-600">
                                Our degree students consistently secure top positions in University examinations.
                            </p>
                        </Card>
                    </motion.div>
                </div>
            </div>

            {/* Hall of Fame */}
            <div>
                <motion.h3
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-2xl font-bold text-center mb-10 flex items-center justify-center gap-3"
                >
                    <FaTrophy className="text-accent" />
                    Hall of Fame
                </motion.h3>

                {loading ? (
                    <LoadingSpinner />
                ) : toppers.length > 0 ? (
                    <div className="grid md:grid-cols-3 gap-8">
                        {toppers.map((result: any, index) => (
                            <motion.div
                                key={result._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -10 }}
                                className="relative"
                            >
                                <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-r ${getGradient(index)} opacity-70 blur-md group-hover:opacity-100 transition duration-1000 group-hover:duration-200`}></div>
                                <div className="relative bg-white rounded-2xl p-8 text-center h-full flex flex-col items-center border border-gray-100 shadow-xl">
                                    <div className="absolute top-0 right-0 p-4">
                                        <FaMedal className={`text-4xl ${getMedalColor(index)}`} />
                                    </div>

                                    <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden mb-6 border-4 border-white shadow-lg text-5xl">
                                        {result.studentId?.photoUrl ? (
                                            <img src={result.studentId.photoUrl} alt={result.studentId.firstName} className="w-full h-full object-cover" />
                                        ) : (
                                            '🎓'
                                        )}
                                    </div>

                                    <h4 className="text-xl font-bold text-gray-900 mb-1">
                                        {result.studentId ? `${result.studentId.firstName} ${result.studentId.lastName}` : 'Unknown Student'}
                                    </h4>
                                    <p className="text-primary font-medium mb-4">{result.examId?.title}</p>

                                    <div className="mt-auto w-full pt-4 border-t border-gray-100">
                                        <div className="flex justify-between items-center px-4">
                                            <div className="text-left">
                                                <p className="text-xs text-gray-500">Score</p>
                                                <p className="font-bold text-gray-900">{result.percentage}%</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500">Position</p>
                                                <p className="font-bold text-accent">{index + 1}{getRankSuffix(index + 1)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 pb-16">Toppers list will be updated after recent exams.</div>
                )}
            </div>
        </SectionWrapper>
    );
};

export default AcademicExcellenceSection;
