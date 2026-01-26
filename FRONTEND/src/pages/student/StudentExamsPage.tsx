import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../../services/axios/authAxios';
import { FaClock, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';

const StudentExamsPage: React.FC = () => {
    const [exams, setExams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await axiosInstance.get('/exams/public'); // Using public endpoint for now
                setExams(response.data);
            } catch (err) {
                console.error('Failed to fetch exams', err);
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading exams...</div>;

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">My Exams</h1>
                <p className="text-gray-500">Upcoming and ongoing examinations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {exams.map((exam, index) => (
                    <motion.div
                        key={exam._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <FaFileAlt size={100} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{exam.title}</h3>
                                    <span className="inline-block mt-1 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-100">
                                        {exam.type}
                                    </span>
                                </div>
                                {/* Status Badge */}
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${new Date(exam.startDate) > new Date()
                                    ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' // Upcoming
                                    : new Date(exam.endDate) < new Date()
                                        ? 'bg-gray-50 text-gray-500 border border-gray-100' // Completed
                                        : 'bg-green-50 text-green-600 border border-green-100' // Ongoing
                                    }`}>
                                    {new Date(exam.startDate) > new Date() ? 'Upcoming' : new Date(exam.endDate) < new Date() ? 'Completed' : 'Ongoing'}
                                </span>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <FaCalendarAlt className="text-blue-500" />
                                    <span>Starts: <span className="font-semibold text-gray-800">{new Date(exam.startDate).toLocaleDateString()}</span></span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <FaClock className="text-purple-500" />
                                    <span>Ends: <span className="font-semibold text-gray-800">{new Date(exam.endDate).toLocaleDateString()}</span></span>
                                </div>
                            </div>

                            <button className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200">
                                View Schedule
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default StudentExamsPage;
