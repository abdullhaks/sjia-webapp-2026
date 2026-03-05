import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Mail, MapPin, Calendar, Book, Shield } from 'lucide-react';
import { Student } from '../../services/api/student.api';
import Avatar from './Avatar';
import StudentFolderSection from '../features/student/StudentFolderSection';

interface StudentDetailModalProps {
    student: Student | null;
    isOpen: boolean;
    onClose: () => void;
}

const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ student, isOpen, onClose }) => {
    if (!student) return null;

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
                        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header Background */}
                        <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-800 relative">
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="px-8 pb-8">
                            {/* Profile Image & Name */}
                            <div className="relative -mt-16 mb-6 flex items-end justify-between">
                                <div className="flex items-end gap-4">
                                    <div className="relative">
                                        <Avatar
                                            src={student.photoUrl}
                                            alt={`${student.firstName} ${student.lastName}`}
                                            size="2xl"
                                            className="border-4 border-white shadow-lg"
                                        />
                                        <div className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-2 border-white ${student.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`} />
                                    </div>
                                    <div className="mb-2">
                                        <h2 className="text-2xl font-bold text-gray-900">{student.firstName} {student.lastName}</h2>
                                        <p className="text-gray-500 font-medium">Admission No: {student.admissionNumber}</p>
                                    </div>
                                </div>
                                <span className="mb-4 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium border border-primary-100">
                                    {student.program}
                                </span>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Academic Info */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Academic Details</h3>

                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                            <Shield size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Current Class/Batch</p>
                                            <p className="font-medium text-gray-900">{student.batch}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                            <Calendar size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Date of Birth</p>
                                            <p className="font-medium text-gray-900">{new Date(student.dateOfBirth).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                            <Book size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Blood Group</p>
                                            <p className="font-medium text-gray-900">{student.bloodGroup || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Personal Info */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Personal Information</h3>

                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                        <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                            <Mail size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Email Address</p>
                                            <p className="font-medium text-gray-900 break-all">{student.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                            <Phone size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Phone Number</p>
                                            <p className="font-medium text-gray-900">{student.phone}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                        <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Guardian Name</p>
                                            <p className="font-medium text-gray-900">{student.guardianName}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Address Section */}
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-gray-100 text-gray-600 rounded-lg mt-1">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Permanent Address</p>
                                        <p className="text-gray-900 leading-relaxed">{student.address}, {student.city}, {student.state} - {student.pincode}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Documents and Folder Section for Admin */}
                            <StudentFolderSection studentId={student._id} />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default StudentDetailModal;
