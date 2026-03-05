import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, Upload, Trash2, Plus, Download, FileText, Image as ImageIcon
} from 'lucide-react';
import { useTimetableStore } from '../../store/timetableStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { message, Upload as AntUpload, Modal } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';

const TimetableManagementPage = () => {
    const {
        timetables, loading, error, fetchTimetables,
        createTimetable, deleteTimetable, uploadFile, clearError
    } = useTimetableStore();

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [uploadFileList, setUploadFileList] = useState<UploadFile[]>([]);

    const [filters, setFilters] = useState({ class: '' });
    const [form, setForm] = useState({
        title: '', class: '', academicYear: new Date().getFullYear().toString(),
        effectiveFrom: '', effectiveTo: ''
    });

    useEffect(() => {
        fetchTimetables();
    }, []);

    useEffect(() => {
        if (error) {
            message.error(error);
            clearError();
        }
    }, [error]);

    const handleUpload = async () => {
        if (!uploadFileList || uploadFileList.length === 0) return message.error('Please select a file');
        if (!form.title || !form.class || !form.effectiveFrom) return message.error('Title, Class and Start Date are required');

        try {
            const file = uploadFileList[0].originFileObj as File;
            const uploadResult = await uploadFile(file);

            await createTimetable({
                title: form.title,
                class: form.class,
                academicYear: form.academicYear,
                type: 'pdf', // defaulting to pdf/file type for now
                fileUrl: uploadResult.url,
                fileName: uploadResult.originalName,
                effectiveFrom: form.effectiveFrom,
                effectiveTo: form.effectiveTo,
                isActive: true
            });

            message.success('Timetable created successfully');
            setIsUploadModalOpen(false);
            setForm({
                title: '', class: '', academicYear: new Date().getFullYear().toString(),
                effectiveFrom: '', effectiveTo: ''
            });
            setUploadFileList([]);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteTimetable(deleteId);
            message.success('Timetable deleted successfully');
            setDeleteId(null);
        } catch (err) {
            console.error(err);
        }
    };

    const filteredTimetables = timetables.filter(item => {
        return (!filters.class || item.class.includes(filters.class));
    });

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                        Timetable Management
                    </h1>
                    <p className="text-slate-400 mt-1">Manage class timetables and schedules.</p>
                </div>
                <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="btn-premium flex items-center space-x-2"
                >
                    <Plus size={18} /> <span>Add Timetable</span>
                </button>
            </div>

            {/* Filters */}
            <div className="card-premium p-4 flex gap-4 items-center">
                <select
                    className="input-premium w-64"
                    value={filters.class}
                    onChange={e => setFilters({ ...filters, class: e.target.value })}
                >
                    <option value="">All Classes</option>
                    {[...Array(12)].map((_, i) => (
                        <option key={i} value={`Class ${i + 1}`}>Class {i + 1}</option>
                    ))}
                    <option value="Degree">Degree</option>
                </select>
            </div>

            {loading ? <LoadingSpinner /> : (!filteredTimetables || filteredTimetables.length === 0) ? (
                <EmptyState title="No Timetables Found" description="Create a timetable to get started." />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredTimetables.map((item) => (
                            <motion.div
                                key={item._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="card-premium p-5 flex flex-col justify-between group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
                                        <Calendar size={24} />
                                    </div>
                                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => setDeleteId(item._id)}
                                            className="text-slate-400 hover:text-red-400 p-1 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                                    <p className="text-teal-400 text-sm font-medium">{item.class}</p>
                                    <div className="flex items-center space-x-2 mt-2 text-xs text-slate-400">
                                        <span>From: {new Date(item.effectiveFrom).toLocaleDateString()}</span>
                                        {item.effectiveTo && <span>To: {new Date(item.effectiveTo).toLocaleDateString()}</span>}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                                    <span className="text-xs text-slate-500 flex items-center space-x-1">
                                        {item.fileName?.endsWith('.pdf') ? <FileText size={12} /> : <ImageIcon size={12} />}
                                        <span className="truncate max-w-[100px]">{item.fileName}</span>
                                    </span>
                                    {item.fileUrl && (
                                        <a
                                            href={item.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300 flex items-center space-x-1 text-sm font-medium"
                                        >
                                            <Download size={14} /> <span>Download</span>
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Upload Modal */}
            <Modal
                title="Add New Timetable"
                open={isUploadModalOpen}
                onCancel={() => setIsUploadModalOpen(false)}
                onOk={handleUpload}
                okText="Create Timetable"
                okButtonProps={{ className: 'bg-teal-600' }}
            >
                <div className="space-y-4 pt-4">
                    <input
                        type="text" placeholder="Title (e.g. Class 10 Term 1)" className="w-full p-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                        value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    />
                    <select
                        className="w-full p-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                        value={form.class} onChange={e => setForm({ ...form, class: e.target.value })}
                    >
                        <option value="">Select Class</option>
                        {[...Array(12)].map((_, i) => (
                            <option key={i} value={`Class ${i + 1}`}>Class {i + 1}</option>
                        ))}
                        <option value="Degree">Degree</option>
                    </select>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Effective From</label>
                            <input
                                type="date" className="w-full p-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                onChange={e => setForm({ ...form, effectiveFrom: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Effective To</label>
                            <input
                                type="date" className="w-full p-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                onChange={e => setForm({ ...form, effectiveTo: e.target.value })}
                            />
                        </div>
                    </div>

                    <AntUpload
                        beforeUpload={() => false}
                        maxCount={1}
                        accept=".pdf,image/*"
                        fileList={uploadFileList}
                        onChange={({ fileList }) => setUploadFileList(fileList)}
                    >
                        <button className="px-5 py-2.5 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg w-full flex justify-center items-center space-x-2 font-medium transition-colors">
                            <Upload size={16} /> <span>Upload Timetable File (PDF/Image)</span>
                        </button>
                    </AntUpload>
                </div>
            </Modal>

            <ConfirmDialog
                open={!!deleteId}
                title="Delete Timetable"
                message="Are you sure you want to delete this timetable?"
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
            />
        </div>
    );
};

export default TimetableManagementPage;
