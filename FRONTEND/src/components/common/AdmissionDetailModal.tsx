import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Mail, MapPin, Calendar, BookOpen, Clock } from 'lucide-react';
import { Admission } from '../../services/api/admission.api';

interface AdmissionDetailModalProps {
    admission: Admission | null;
    isOpen: boolean;
    onClose: () => void;
}

const AdmissionDetailModal: React.FC<AdmissionDetailModalProps> = ({ admission, isOpen, onClose }) => {
    if (!admission) return null;

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
            case 'InterviewScheduled': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string | number | undefined }> = ({ icon, label, value }) => (
        <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
            <div className="text-gray-400 mt-0.5 flex-shrink-0">{icon}</div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
                <p className="text-gray-800 font-medium truncate">{value || '—'}</p>
            </div>
        </div>
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white relative rounded-t-2xl">
                            <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"><X size={20} /></button>
                            <h2 className="text-xl font-bold mb-1">Application Details</h2>
                            <p className="text-white/70 text-sm font-mono">{admission.applicationId}</p>
                            <div className={`mt-3 inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(admission.status)}`}>
                                {admission.status === 'InterviewScheduled' ? 'INTERVIEW SCHEDULED' : admission.status.toUpperCase()}
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-1">
                            <InfoRow icon={<User size={16} />} label="Student Name" value={admission.studentName} />
                            <InfoRow icon={<User size={16} />} label="Parent / Guardian Name" value={admission.parentName} />
                            <InfoRow icon={<Phone size={16} />} label="Contact Number" value={admission.phone} />
                            <InfoRow icon={<Mail size={16} />} label="Email Address" value={admission.email} />
                            <InfoRow icon={<Calendar size={16} />} label="Age" value={admission.age} />
                            <InfoRow icon={<BookOpen size={16} />} label="Preferred Class" value={admission.preferredClass} />
                            <InfoRow icon={<MapPin size={16} />} label="Place" value={admission.place} />

                            {admission.interviewDate && (
                                <InfoRow icon={<Clock size={16} />} label="Interview Date" value={new Date(admission.interviewDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} />
                            )}

                            {admission.rejectionReason && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-xs text-red-500 uppercase tracking-wider mb-1">Rejection Reason</p>
                                    <p className="text-red-700 text-sm">{admission.rejectionReason}</p>
                                </div>
                            )}

                            {admission.notes && (
                                <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Notes</p>
                                    <p className="text-gray-700 text-sm">{admission.notes}</p>
                                </div>
                            )}

                            <div className="mt-4 text-xs text-gray-400">
                                Applied on: {admission.createdAt ? new Date(admission.createdAt).toLocaleString() : '—'}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-100 text-center">
                            <button onClick={onClose} className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">Close</button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AdmissionDetailModal;
