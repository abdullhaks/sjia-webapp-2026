import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../../services/axios/authAxios';
import { FaTrophy, FaDownload } from 'react-icons/fa';

const StudentResultsPage: React.FC = () => {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axiosInstance.get('/results/my-results');
                setResults(response.data);
            } catch (err) {
                console.error('Failed to fetch results', err);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading results...</div>;

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">My Results</h1>
                <p className="text-gray-500">Academic performance history</p>
            </div>

            {results.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                    {results.map((result, index) => (
                        <motion.div
                            key={result._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">{result.examId?.title || 'Term Exam'}</h3>
                                    <p className="text-sm text-gray-500">Published on {new Date(result.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Total Score</p>
                                        <p className="text-2xl font-bold text-blue-600">{result.totalScore}</p>
                                    </div>
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white bg-green-500`}>
                                        {result.grade}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-gray-50/50">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {result.subjects && result.subjects.map((sub: any, idx: number) => (
                                        <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center">
                                            <span className="font-medium text-gray-700">{sub.subject}</span>
                                            <span className="font-bold text-gray-900">{sub.score}</span>
                                        </div>
                                    ))}
                                </div>
                                <button className="mt-6 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                                    <FaDownload /> Download Report Card
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 border-dashed">
                    <FaTrophy className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No results found</h3>
                    <p className="text-gray-500">You haven't taken any exams yet.</p>
                </div>
            )}
        </div>
    );
};

export default StudentResultsPage;
