import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaBook, FaEllipsisH } from 'react-icons/fa';

import { useTimetableStore } from '../../store/timetableStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StaffClassesPage: React.FC = () => {
    const { mySchedule, fetchMySchedule, loading } = useTimetableStore();

    useEffect(() => {
        fetchMySchedule();
    }, [fetchMySchedule]);

    // Derive Unique Classes from Schedule
    const classes = Array.from(new Set(mySchedule.map(s => s.class + '|' + s.subject)))
        .map((key, index) => {
            const [className, subject] = key.split('|');
            // Find a slot for this class/subject to get room info if available
            const slot = mySchedule.find(s => s.class === className && s.subject === subject);
            return {
                id: index,
                name: className,
                subject: subject,
                students: 'N/A', // Count not available
                room: slot?.room || 'N/A'
            };
        });

    if (loading && classes.length === 0) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">My Classes</h1>
                <p className="text-gray-500">Managed classes and subjects</p>
            </div>

            {classes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map((cls, index) => (
                        <motion.div
                            key={cls.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <FaUsers size={100} />
                            </div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                                        <FaBook size={24} />
                                    </div>
                                    <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600">
                                        <FaEllipsisH />
                                    </button>
                                </div>

                                <h3 className="text-xl font-bold text-gray-800 mb-1">{cls.name}</h3>
                                <p className="text-gray-500 mb-4">{cls.subject} • Room {cls.room}</p>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FaUsers />
                                        <span className="font-medium">{cls.students === 'N/A' ? 'Active' : cls.students + ' Students'}</span>
                                    </div>
                                    <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                    <p className="text-gray-500">No classes assigned yet.</p>
                </div>
            )}
        </div>
    );
};

export default StaffClassesPage;
