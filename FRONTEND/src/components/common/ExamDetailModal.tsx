import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Book } from 'lucide-react';
import { Exam } from '../../services/api/exam.api';

interface ExamDetailModalProps {
    exam: Exam | null;
    isOpen: boolean;
    onClose: () => void;
}

const ExamDetailModal: React.FC<ExamDetailModalProps> = ({ exam, isOpen, onClose }) => {
    if (!exam) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                    >
                        {/* Header Background */}
                        <div className="shrink-0 p-6 bg-gradient-to-r from-blue-600 to-indigo-700 relative text-white">
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <h2 className="text-2xl font-bold mb-1">{exam.title}</h2>
                            <div className="flex gap-3 text-blue-100 text-sm">
                                <span className="bg-white/20 px-2 py-1 rounded">{exam.type}</span>
                                <span className={`px-2 py-1 rounded text-white font-medium
                                    ${exam.status === 'Completed' ? 'bg-green-500/80' : ''}
                                    ${exam.status === 'Scheduled' ? 'bg-blue-400/80' : ''}
                                    ${exam.status === 'Ongoing' ? 'bg-amber-500/80' : ''}
                                `}>
                                    Status: {exam.status}
                                </span>
                            </div>
                        </div>

                        {/* Scrolling Content */}
                        <div className="flex-1 overflow-y-auto p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Exam Period</h3>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                            <Calendar size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Date Range</p>
                                            <p className="font-medium text-gray-900">
                                                {new Date(exam.startDate).toLocaleDateString()} — {new Date(exam.endDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    {exam.description && (
                                        <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 mt-2 text-sm text-gray-700">
                                            <strong>Description:</strong> {exam.description}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Participant Target</h3>
                                    <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                                        <div className="flex items-center gap-2 mb-2 text-indigo-700 font-semibold">
                                            Classes Included
                                        </div>
                                        <div className="flex flex-wrap gap-2 text-sm text-indigo-900">
                                            {exam.classes && exam.classes.length > 0 ? (
                                                exam.classes.map((cls, idx) => (
                                                    <span key={idx} className="bg-white/60 px-2 py-1 rounded shadow-sm border border-indigo-200">{cls}</span>
                                                ))
                                            ) : (
                                                <span className="text-indigo-400">No specific classes selected.</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-2">
                                <h3 className="text-base font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
                                    <Book size={18} className="text-blue-500" />
                                    Subject Timetable
                                </h3>

                                {exam.schedule && exam.schedule.length > 0 ? (
                                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                                        <table className="min-w-full text-left text-sm">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                                <tr>
                                                    <th className="px-4 py-3 font-semibold text-gray-600">Subject</th>
                                                    <th className="px-4 py-3 font-semibold text-gray-600">Date</th>
                                                    <th className="px-4 py-3 font-semibold text-gray-600">Time</th>
                                                    <th className="px-4 py-3 font-semibold text-gray-600">Duration</th>
                                                    <th className="px-4 py-3 font-semibold text-gray-600">Max Marks</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 bg-white text-gray-700">
                                                {exam.schedule.map((sched, idx) => (
                                                    <tr key={idx} className="hover:bg-gray-50/50">
                                                        <td className="px-4 py-3 font-medium">{sched.subjectName}</td>
                                                        <td className="px-4 py-3">{new Date(sched.date).toLocaleDateString()}</td>
                                                        <td className="px-4 py-3 flex items-center gap-1.5 whitespace-nowrap"><Clock size={14} className="text-gray-400" /> {sched.startTime}</td>
                                                        <td className="px-4 py-3">{sched.duration}</td>
                                                        <td className="px-4 py-3">{sched.maxMarks || 100}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        No subjects scheduled for this exam yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ExamDetailModal;
