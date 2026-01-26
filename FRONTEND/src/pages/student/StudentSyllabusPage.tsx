import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../../services/axios/authAxios';
import { FaBookOpen, FaDownload } from 'react-icons/fa';

const StudentSyllabusPage: React.FC = () => {
    const [syllabusList, setSyllabusList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSyllabus = async () => {
            try {
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

    if (loading) return <div className="p-8 text-center">Loading syllabus...</div>;

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">My Syllabus</h1>
                <p className="text-gray-500">Course curriculum and materials</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {syllabusList.map((item, index) => (
                    <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                    >
                        <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-4 text-purple-600">
                            <FaBookOpen size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">{item.subject}</h3>
                        <p className="text-sm text-gray-500 mb-4">{item.class} • {item.academicYear}</p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <span className="text-xs text-gray-400">PDF • 2.5 MB</span>
                            <button className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-blue-600 transition-colors">
                                <FaDownload />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default StudentSyllabusPage;
