import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Image, Users, Layout, Upload, Trash2, Plus,
    Edit
} from 'lucide-react';
import { useCMSStore } from '../../store/cmsStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { message, Upload as AntUpload, Modal } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';

const CMSPage = () => {
    const {
        gallery, leadership, siteContent, loading, error,
        fetchGallery, fetchLeadership, fetchSiteContent,
        createGalleryItem, deleteGalleryItem,
        createLeadershipMember, updateLeadershipMember, deleteLeadershipMember,
        updateSiteContent, uploadFile, clearError
    } = useCMSStore();

    const [activeTab, setActiveTab] = useState<'gallery' | 'leadership' | 'content'>('gallery');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isLeadershipModalOpen, setIsLeadershipModalOpen] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'gallery' | 'leadership', id: string } | null>(null);
    const [editingMember, setEditingMember] = useState<any>(null);

    // Form states
    const [uploadFileList, setUploadFileList] = useState<UploadFile[]>([]);
    const [galleryForm, setGalleryForm] = useState({ title: '', category: 'campus', description: '' });
    const [leadershipForm, setLeadershipForm] = useState({ name: '', position: '', photoUrl: '', bio: '', order: 0 });

    useEffect(() => {
        if (activeTab === 'gallery') fetchGallery();
        if (activeTab === 'leadership') fetchLeadership();
        if (activeTab === 'content') fetchSiteContent();
    }, [activeTab]);

    useEffect(() => {
        if (error) {
            message.error(error);
            clearError();
        }
    }, [error]);

    const handleGallerySubmit = async () => {
        if (uploadFileList.length === 0) return message.error('Please upload an image');
        if (!galleryForm.title) return message.error('Title is required');

        try {
            // Upload file first
            const file = uploadFileList[0].originFileObj as File;
            const uploadResult = await uploadFile(file);

            await createGalleryItem({
                title: galleryForm.title,
                category: galleryForm.category as any,
                description: galleryForm.description,
                imageUrl: uploadResult.url,
                isActive: true
            });

            message.success('Gallery item added successfully');
            setIsUploadModalOpen(false);
            setGalleryForm({ title: '', category: 'campus', description: '' });
            setUploadFileList([]);
        } catch (err) {
            console.error(err);
        }
    };

    const handleLeadershipSubmit = async () => {
        if (!leadershipForm.name || !leadershipForm.position) return message.error('Name and Position are required');

        try {
            let photoUrl = leadershipForm.photoUrl;

            // Handle file upload if a new file is selected
            if (uploadFileList.length > 0) {
                const file = uploadFileList[0].originFileObj as File;
                const uploadResult = await uploadFile(file);
                photoUrl = uploadResult.url;
            }

            if (editingMember) {
                await updateLeadershipMember(editingMember._id, { ...leadershipForm, photoUrl });
                message.success('Member updated successfully');
            } else {
                if (!photoUrl) return message.error('Photo is required');
                await createLeadershipMember({ ...leadershipForm, photoUrl });
                message.success('Member added successfully');
            }

            setIsLeadershipModalOpen(false);
            setEditingMember(null);
            setLeadershipForm({ name: '', position: '', photoUrl: '', bio: '', order: 0 });
            setUploadFileList([]);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        if (!deleteConfirm) return;
        try {
            if (deleteConfirm.type === 'gallery') await deleteGalleryItem(deleteConfirm.id);
            if (deleteConfirm.type === 'leadership') await deleteLeadershipMember(deleteConfirm.id);
            message.success('Deleted successfully');
            setDeleteConfirm(null);
        } catch (err) {
            console.error(err);
        }
    };

    const openEditLeadership = (member: any) => {
        setEditingMember(member);
        setLeadershipForm({
            name: member.name,
            position: member.position,
            photoUrl: member.photoUrl,
            bio: member.bio || '',
            order: member.order
        });
        setIsLeadershipModalOpen(true);
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                        Content Management
                    </h1>
                    <p className="text-slate-400 mt-1">Manage website content, gallery, and leadership team.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 border-b border-white/10 pb-2">
                <button
                    onClick={() => setActiveTab('gallery')}
                    className={`flex items - center space - x - 2 px - 4 py - 2 rounded - t - lg transition - colors ${activeTab === 'gallery' ? 'bg-white/10 text-teal-400 border-b-2 border-teal-400' : 'text-slate-400 hover:text-white'
                        } `}
                >
                    <Image size={18} /> <span>Gallery</span>
                </button>
                <button
                    onClick={() => setActiveTab('leadership')}
                    className={`flex items - center space - x - 2 px - 4 py - 2 rounded - t - lg transition - colors ${activeTab === 'leadership' ? 'bg-white/10 text-teal-400 border-b-2 border-teal-400' : 'text-slate-400 hover:text-white'
                        } `}
                >
                    <Users size={18} /> <span>Leadership</span>
                </button>
                <button
                    onClick={() => setActiveTab('content')}
                    className={`flex items - center space - x - 2 px - 4 py - 2 rounded - t - lg transition - colors ${activeTab === 'content' ? 'bg-white/10 text-teal-400 border-b-2 border-teal-400' : 'text-slate-400 hover:text-white'
                        } `}
                >
                    <Layout size={18} /> <span>Site Content</span>
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'gallery' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex justify-end">
                            <button onClick={() => setIsUploadModalOpen(true)} className="btn-premium flex items-center space-x-2">
                                <Plus size={18} /> <span>Add Image</span>
                            </button>
                        </div>

                        {loading ? <LoadingSpinner /> : gallery.length === 0 ? (
                            <EmptyState title="No Images Found" description="Upload images to display in the gallery." />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {gallery.map((item) => (
                                    <div key={item._id} className="card-premium group relative overflow-hidden">
                                        <div className="h-48 w-full overflow-hidden rounded-t-lg">
                                            <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        </div>
                                        <div className="p-4">
                                            <div className="flex justify-between items-start">
                                                <h3 className="tex-lg font-semibold text-white">{item.title}</h3>
                                                <span className="text-xs px-2 py-1 rounded bg-teal-500/20 text-teal-300 capitalize">{item.category}</span>
                                            </div>
                                            <p className="text-sm text-slate-400 mt-2 truncate">{item.description}</p>
                                        </div>
                                        <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => setDeleteConfirm({ type: 'gallery', id: item._id })}
                                                className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full backdrop-blur-sm"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'leadership' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex justify-end">
                            <button onClick={() => { setEditingMember(null); setIsLeadershipModalOpen(true); }} className="btn-premium flex items-center space-x-2">
                                <Plus size={18} /> <span>Add Member</span>
                            </button>
                        </div>

                        {loading ? <LoadingSpinner /> : leadership.length === 0 ? (
                            <EmptyState title="No Team Members" description="Add leadership team members." />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {leadership.map((member) => (
                                    <div key={member._id} className="card-premium p-6 flex items-center space-x-4">
                                        <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-teal-500/30">
                                            <img src={member.photoUrl} alt={member.name} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                                            <p className="text-teal-400 text-sm">{member.position}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button onClick={() => openEditLeadership(member)} className="text-slate-400 hover:text-teal-400 p-1">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => setDeleteConfirm({ type: 'leadership', id: member._id })} className="text-slate-400 hover:text-red-400 p-1">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'content' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        {loading ? <LoadingSpinner /> : siteContent.length === 0 ? (
                            <div className="card-premium p-6 text-center">
                                <p className="text-slate-400">No dynamic content keys found. Initialize database first.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {siteContent.map((content) => (
                                    <div key={content.key} className="card-premium p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-lg font-semibold text-white capitalize">{content.key.replace(/-/g, ' ')}</h3>
                                                <p className="text-xs text-teal-400 uppercase tracking-wider">{content.section}</p>
                                            </div>
                                            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
                                                {content.type}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-400 mb-4">{content.description}</p>

                                        <div className="flex gap-4">
                                            {content.type === 'text' || content.type === 'url' ? (
                                                <input
                                                    type="text"
                                                    className="input-premium w-full"
                                                    defaultValue={content.value}
                                                    onBlur={(e) => {
                                                        if (e.target.value !== content.value) {
                                                            updateSiteContent(content.key, { value: e.target.value });
                                                            message.success('Content updated');
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <textarea
                                                    className="input-premium w-full min-h-[100px]"
                                                    defaultValue={content.value}
                                                    onBlur={(e) => {
                                                        if (e.target.value !== content.value) {
                                                            updateSiteContent(content.key, { value: e.target.value });
                                                            message.success('Content updated');
                                                        }
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Gallery Modal */}
            <Modal
                title="Add to Gallery"
                open={isUploadModalOpen}
                onCancel={() => setIsUploadModalOpen(false)}
                onOk={handleGallerySubmit}
                okText="Upload"
                okButtonProps={{ className: 'bg-teal-600' }}
            >
                <div className="space-y-4 pt-4">
                    <input
                        type="text" placeholder="Title" className="input-premium w-full"
                        value={galleryForm.title} onChange={e => setGalleryForm({ ...galleryForm, title: e.target.value })}
                    />
                    <select
                        className="input-premium w-full"
                        value={galleryForm.category} onChange={e => setGalleryForm({ ...galleryForm, category: e.target.value })}
                    >
                        <option value="campus">Campus</option>
                        <option value="events">Events</option>
                        <option value="achievements">Achievements</option>
                        <option value="other">Other</option>
                    </select>
                    <textarea
                        placeholder="Description" className="input-premium w-full min-h-[80px]"
                        value={galleryForm.description} onChange={e => setGalleryForm({ ...galleryForm, description: e.target.value })}
                    />
                    <AntUpload
                        beforeUpload={() => false}
                        maxCount={1}
                        fileList={uploadFileList}
                        onChange={({ fileList }) => setUploadFileList(fileList)}
                    >
                        <button className="btn-premium w-full flex justify-center items-center space-x-2">
                            <Upload size={16} /> <span>Select Image</span>
                        </button>
                    </AntUpload>
                </div>
            </Modal>

            {/* Leadership Modal */}
            <Modal
                title={editingMember ? "Edit Member" : "Add Team Member"}
                open={isLeadershipModalOpen}
                onCancel={() => setIsLeadershipModalOpen(false)}
                onOk={handleLeadershipSubmit}
                okText={editingMember ? "Update" : "Add"}
                okButtonProps={{ className: 'bg-teal-600' }}
            >
                <div className="space-y-4 pt-4">
                    <input
                        type="text" placeholder="Full Name" className="input-premium w-full"
                        value={leadershipForm.name} onChange={e => setLeadershipForm({ ...leadershipForm, name: e.target.value })}
                    />
                    <input
                        type="text" placeholder="Position (e.g. Principal)" className="input-premium w-full"
                        value={leadershipForm.position} onChange={e => setLeadershipForm({ ...leadershipForm, position: e.target.value })}
                    />
                    <textarea
                        placeholder="Bio" className="input-premium w-full min-h-[80px]"
                        value={leadershipForm.bio} onChange={e => setLeadershipForm({ ...leadershipForm, bio: e.target.value })}
                    />
                    <input
                        type="number" placeholder="Order (Display Priority)" className="input-premium w-full"
                        value={leadershipForm.order} onChange={e => setLeadershipForm({ ...leadershipForm, order: Number(e.target.value) })}
                    />
                    <AntUpload
                        beforeUpload={() => false}
                        maxCount={1}
                        fileList={uploadFileList}
                        onChange={({ fileList }) => setUploadFileList(fileList)}
                    >
                        <button className="btn-premium w-full flex justify-center items-center space-x-2">
                            <Upload size={16} /> <span>{editingMember ? "Change Photo (Optional)" : "Select Photo"}</span>
                        </button>
                    </AntUpload>
                </div>
            </Modal>

            {/* Confirm Dialog */}
            <ConfirmDialog
                open={!!deleteConfirm}
                title="Delete Item"
                message="Are you sure you want to delete this item? This action cannot be undone."
                onConfirm={handleDelete}
                onCancel={() => setDeleteConfirm(null)}
            />
        </div>
    );
};

export default CMSPage;
