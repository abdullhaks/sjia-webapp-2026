import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../../services/axios/authAxios';
import { FaBookOpen, FaDownload, FaChevronDown, FaCheckCircle, FaRegCircle } from 'react-icons/fa';

const StudentSyllabusPage: React.FC = () => {
    const [syllabusList, setSyllabusList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedSyllabus, setExpandedSyllabus] = useState<string | null>(null);

    useEffect(() => {
        const fetchSyllabus = async () => {
            try {
                // Fetch only active syllabi for this student's class (backend should ideally filter this, but we'll fetch all and they'll likely see theirs)
                const response = await axiosInstance.get('/syllabus');
                setSyllabusList(response.data);
            } catch (err) {
                console.error('Failed to fetch syllabus', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSyllabus();
    }, []);

    const toggleExpand = (id: string) => {
        setExpandedSyllabus(expandedSyllabus === id ? null : id);
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading your syllabus...</div>;

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">My Syllabus</h1>
                <p className="text-gray-500">Track your academic progress across modules</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {syllabusList.length === 0 ? (
                    <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 border-dashed">
                        <FaBookOpen className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No syllabus assigned</h3>
                        <p className="text-gray-500 mt-1">There are currently no syllabi available for your class.</p>
                    </div>
                ) : (
                    syllabusList.map((item, index) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
                        >
                            <div
                                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                                onClick={() => toggleExpand(item._id)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                                        <FaBookOpen size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">{item.subject}</h3>
                                        <p className="text-sm text-gray-500">{item.class} • {item.academicYear}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {item.fileUrl && (
                                        <a
                                            href={item.fileUrl?.startsWith('http') ? item.fileUrl : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'}${item.fileUrl?.startsWith('/') ? '' : '/'}${item.fileUrl}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors flex items-center gap-2 text-sm font-semibold border border-blue-100"
                                        >
                                            <FaDownload /> PDF Guide
                                        </a>
                                    )}
                                    <motion.div
                                        animate={{ rotate: expandedSyllabus === item._id ? 180 : 0 }}
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500"
                                    >
                                        <FaChevronDown size={14} />
                                    </motion.div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {expandedSyllabus === item._id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-gray-100 bg-gray-50/50"
                                    >
                                        <div className="p-6">
                                            {item.structure && item.structure.length > 0 ? (
                                                <div className="space-y-6">
                                                    {item.structure.map((termInfo: any, tIndex: number) => (
                                                        <div key={tIndex} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                                                            <h4 className="text-lg font-bold text-blue-800 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                                                                <span className="w-2 h-6 bg-blue-500 rounded-full inline-block"></span>
                                                                {termInfo.term || `Term ${tIndex + 1}`}
                                                            </h4>

                                                            <div className="space-y-4">
                                                                {termInfo.chapters && termInfo.chapters.map((chapter: any, cIndex: number) => (
                                                                    <div key={cIndex} className="pl-4 border-l-2 border-blue-100">
                                                                        <h5 className="font-semibold text-gray-800 mb-3">{chapter.title}</h5>
                                                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                                                            {chapter.topics && chapter.topics.map((topic: any, idx: number) => (
                                                                                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100 hover:bg-blue-50/50 hover:border-blue-100 transition-colors">
                                                                                    <div className={`mt-0.5 shrink-0 ${topic.isCompleted ? 'text-emerald-500' : 'text-gray-300'}`}>
                                                                                        {topic.isCompleted ? <FaCheckCircle /> : <FaRegCircle />}
                                                                                    </div>
                                                                                    <span className={`text-sm ${topic.isCompleted ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                                                                                        {topic.title}
                                                                                    </span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {(!termInfo.chapters || termInfo.chapters.length === 0) && (
                                                                    <p className="text-sm text-gray-500 italic pl-4">No chapters defined for this term yet.</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8">
                                                    <p className="text-gray-500 mb-2">No structured curriculum data available.</p>
                                                    <p className="text-sm text-gray-400">Download the PDF guide above for detailed topic breakdowns.</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StudentSyllabusPage;
