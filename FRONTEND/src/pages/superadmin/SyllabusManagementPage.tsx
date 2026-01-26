import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, Upload, Trash2, Plus, Download, Search
} from 'lucide-react';
import { useSyllabusStore } from '../../store/syllabusStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { message, Upload as AntUpload, Modal } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';

const SyllabusManagementPage = () => {
    const {
        syllabi, loading, error, fetchSyllabi,
        createSyllabus, deleteSyllabus, uploadFile, clearError
    } = useSyllabusStore();

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [uploadFileList, setUploadFileList] = useState<UploadFile[]>([]);

    const [filters, setFilters] = useState({ class: '', subject: '' });
    const [form, setForm] = useState({
        subject: '', class: '', academicYear: new Date().getFullYear().toString(), description: ''
    });

    useEffect(() => {
        fetchSyllabi();
    }, []);

    useEffect(() => {
        if (error) {
            message.error(error);
            clearError();
        }
    }, [error]);

    const handleUpload = async () => {
        if (uploadFileList.length === 0) return message.error('Please select a PDF file');
        if (!form.subject || !form.class) return message.error('Subject and Class are required');

        try {
            const file = uploadFileList[0].originFileObj as File;
            if (file.type !== 'application/pdf') return message.error('Only PDF files are allowed');

            const uploadResult = await uploadFile(file);

            await createSyllabus({
                subject: form.subject,
                class: form.class,
                academicYear: form.academicYear,
                description: form.description,
                fileUrl: uploadResult.url,
                fileName: uploadResult.originalName,
                fileSize: uploadResult.size,
                isActive: true
            });

            message.success('Syllabus uploaded successfully');
            setIsUploadModalOpen(false);
            setForm({ subject: '', class: '', academicYear: new Date().getFullYear().toString(), description: '' });
            setUploadFileList([]);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteSyllabus(deleteId);
            message.success('Syllabus deleted successfully');
            setDeleteId(null);
        } catch (err) {
            console.error(err);
        }
    };

    const filteredSyllabi = syllabi.filter(item => {
        return (
            (!filters.class || item.class.includes(filters.class)) &&
            (!filters.subject || item.subject.toLowerCase().includes(filters.subject.toLowerCase()))
        );
    });

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                        Syllabus Management
                    </h1>
                    <p className="text-slate-400 mt-1">Manage and upload academic syllabus files.</p>
                </div>
                <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="btn-premium flex items-center space-x-2"
                >
                    <Plus size={18} /> <span>Upload New</span>
                </button>
            </div>

            {/* Filters */}
            <div className="card-premium p-4 flex gap-4 items-center">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search subject..."
                        className="input-premium pl-10 w-full"
                        value={filters.subject}
                        onChange={e => setFilters({ ...filters, subject: e.target.value })}
                    />
                </div>
                <select
                    className="input-premium w-48"
                    value={filters.class}
                    onChange={e => setFilters({ ...filters, class: e.target.value })}
                >
                    <option value="">All Classes</option>
                    {[...Array(12)].map((_, i) => (
                        <option key={i} value={`Class ${i + 1} `}>Class {i + 1}</option>
                    ))}
                    <option value="Degree">Degree</option>
                </select>
            </div>

            {loading ? <LoadingSpinner /> : filteredSyllabi.length === 0 ? (
                <EmptyState title="No Syllabi Found" description="Upload a syllabus to get started." />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredSyllabi.map((item) => (
                            <motion.div
                                key={item._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="card-premium p-5 flex flex-col justify-between group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-red-500/10 rounded-lg text-red-500">
                                        <FileText size={24} />
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
                                    <h3 className="text-lg font-semibold text-white mb-1">{item.subject}</h3>
                                    <p className="text-teal-400 text-sm">{item.class}</p>
                                    <p className="text-slate-400 text-xs mt-2 line-clamp-2">{item.description}</p>
                                </div>

                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                                    <span className="text-xs text-slate-500">
                                        {(item.fileSize / 1024 / 1024).toFixed(2)} MB • {new Date(item.createdAt).toLocaleDateString()}
                                    </span>
                                    <a
                                        href={item.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300 flex items-center space-x-1 text-sm font-medium"
                                    >
                                        <Download size={14} /> <span>Download</span>
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Upload Modal */}
            <Modal
                title="Upload Syllabus"
                open={isUploadModalOpen}
                onCancel={() => setIsUploadModalOpen(false)}
                onOk={handleUpload}
                okText="Upload PDF"
                okButtonProps={{ className: 'bg-teal-600' }}
            >
                <div className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <select
                            className="input-premium w-full"
                            value={form.class} onChange={e => setForm({ ...form, class: e.target.value })}
                        >
                            <option value="">Select Class</option>
                            {[...Array(12)].map((_, i) => (
                                <option key={i} value={`Class ${i + 1} `}>Class {i + 1}</option>
                            ))}
                            <option value="Degree">Degree</option>
                        </select>
                        <input
                            type="text" placeholder="Subject (e.g. Maths)" className="input-premium w-full"
                            value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                        />
                    </div>
                    <textarea
                        placeholder="Description (Optional)" className="input-premium w-full min-h-[80px]"
                        value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    />
                    <AntUpload
                        beforeUpload={() => false}
                        maxCount={1}
                        accept="application/pdf"
                        fileList={uploadFileList}
                        onChange={({ fileList }) => setUploadFileList(fileList)}
                    >
                        <button className="btn-premium w-full flex justify-center items-center space-x-2">
                            <Upload size={16} /> <span>Select PDF File</span>
                        </button>
                    </AntUpload>
                    <p className="text-xs text-slate-500 text-center">Max size: 10MB. PDF files only.</p>
                </div>
            </Modal>

            <ConfirmDialog
                open={!!deleteId}
                title="Delete Syllabus"
                message="Are you sure you want to delete this syllabus? The file will be removed permanently."
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
            />
        </div>
    );
};

export default SyllabusManagementPage;
