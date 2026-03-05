import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFileAlt, FaLink, FaTrash, FaPlus, FaSpinner, FaExternalLinkAlt } from 'react-icons/fa';
import { useStudentStore } from '../../../store/studentStore';
import { message } from '../../common/AntdStaticProvider';

interface StudentFolderSectionProps {
    studentId?: string; // If provided, used by admin. Otherwise defaults to 'me'
}

const StudentFolderSection: React.FC<StudentFolderSectionProps> = ({ studentId }) => {
    const { currentStudent, students, addFolderItem, removeFolderItem, addFolderItemMe, removeFolderItemMe } = useStudentStore();
    const [isAdding, setIsAdding] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tab, setTab] = useState<'file' | 'link'>('file');

    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Get the correct student data based on context
    const student = studentId ? students.find(s => s._id === studentId) : currentStudent;

    if (!student) return null;

    const folderItems = student.folder || [];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            message.error('Please provide a title');
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('type', tab);

            if (tab === 'file') {
                if (!selectedFile) {
                    message.error('Please select a file to upload');
                    setIsSubmitting(false);
                    return;
                }
                formData.append('file', selectedFile);
            } else {
                if (!url.trim()) {
                    message.error('Please provide a link URL');
                    setIsSubmitting(false);
                    return;
                }
                formData.append('url', url);
            }

            if (studentId) {
                await addFolderItem(studentId, formData);
            } else {
                await addFolderItemMe(formData);
            }

            message.success('Added to folder successfully!');
            setTitle('');
            setUrl('');
            setSelectedFile(null);
            setIsAdding(false);
        } catch (error) {
            // error shown by store
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (itemId: string) => {
        if (!window.confirm('Are you sure you want to remove this item?')) return;
        try {
            if (studentId) {
                await removeFolderItem(studentId, itemId);
            } else {
                await removeFolderItemMe(itemId);
            }
            message.success('Item removed');
        } catch (error) {
            // error shown by store
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mt-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FaFileAlt className="text-blue-500" /> My Personal Folder
                </h2>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-medium hover:bg-blue-100 flex items-center gap-2 transition-colors"
                    >
                        <FaPlus size={12} /> Add Item
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mb-6"
                    >
                        <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                            <div className="flex gap-4 mb-4 border-b border-gray-200 pb-2">
                                <button
                                    onClick={() => setTab('file')}
                                    className={`font-medium text-sm pb-2 border-b-2 transition-colors ${tab === 'file' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                >
                                    Upload File
                                </button>
                                <button
                                    onClick={() => setTab('link')}
                                    className={`font-medium text-sm pb-2 border-b-2 transition-colors ${tab === 'link' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                >
                                    Add Link
                                </button>
                            </div>

                            <form onSubmit={handleAdd} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="e.g. Science Assignment, Competition Video"
                                        required
                                    />
                                </div>

                                {tab === 'file' ? (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Select File</label>
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                            required
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">URL / Link</label>
                                        <input
                                            type="url"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="https://..."
                                            required
                                        />
                                    </div>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsAdding(false)}
                                        className="py-2 px-4 rounded-xl text-gray-600 font-medium hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="py-2 px-6 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 flex items-center gap-2 disabled:opacity-70 transition-colors"
                                    >
                                        {isSubmitting ? <FaSpinner className="animate-spin" /> : 'Save Item'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {folderItems.length === 0 ? (
                <div className="py-8 text-center bg-gray-50 border border-gray-100 rounded-xl border-dashed">
                    <p className="text-gray-500">Your folder is empty. Organize your media and links here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {folderItems.map((item) => (
                        <div key={item._id} className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow bg-gray-50">
                            <div className={`p-3 rounded-lg flex-shrink-0 ${item.type === 'file' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                                {item.type === 'file' ? <FaFileAlt size={20} /> : <FaLink size={20} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-800 truncate">{item.title}</h3>
                                <p className="text-xs text-gray-500 mb-2">Added on {new Date(item.addedAt).toLocaleDateString()}</p>
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800"
                                >
                                    Open {item.type === 'file' ? 'File' : 'Link'} <FaExternalLinkAlt size={10} />
                                </a>
                            </div>
                            <button
                                onClick={() => handleDelete(item._id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                                title="Delete Item"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentFolderSection;
