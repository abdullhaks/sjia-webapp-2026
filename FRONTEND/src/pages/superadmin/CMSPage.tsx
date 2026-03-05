import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Image as ImageIcon, Users, Layout, Upload, Trash2, Plus,
    Edit, Folder, Copy, Share2, Youtube, Instagram,
    BookOpen, GraduationCap, MessageSquare, ToggleLeft, ToggleRight
} from 'lucide-react';
import { useCMSStore } from '../../store/cmsStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { message, Upload as AntUpload, Modal } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';

// ─── Types ──────────────────────────────────────────────
interface SocialLinksData {
    youtubeChannel: string;
    instagramProfile: string;
    facebookPage: string;
    whatsappNumber: string;
    youtube: { id: string; title: string; url: string; thumbnail?: string }[];
    instagram: { id: string; title: string; url: string; thumbnail?: string }[];
}
const defaultSocialLinks: SocialLinksData = {
    youtubeChannel: '', instagramProfile: '', facebookPage: '', whatsappNumber: '',
    youtube: [], instagram: [],
};

interface ProgramItem {
    id: number;
    title: string; level: string; duration: string; description: string;
    highlights: string[]; eligibility: string[]; icon: string;
}

interface FacultyItem {
    id: string; name: string; position: string; category: 'authority' | 'hod' | 'faculty';
    profileImage?: string; education?: string; experience?: string; specialization?: string;
}

interface TestimonialItem {
    id: string; name: string; batch: string; career: string;
    opinion: string; stars: number; image?: string;
}

// ─── Main Component ─────────────────────────────────────
type TabKey = 'gallery' | 'leadership' | 'content' | 'media' | 'social' | 'programs' | 'faculty' | 'testimonials' | 'admissionToggle';

const CMSPage = () => {
    const {
        gallery, leadership, siteContent, loading, error,
        fetchGallery, fetchLeadership, fetchSiteContent,
        createGalleryItem, deleteGalleryItem,
        createLeadershipMember, updateLeadershipMember, deleteLeadershipMember,
        updateSiteContent, uploadFile, clearError,
        media, fetchMediaFiles, deleteMediaFile
    } = useCMSStore();

    const [activeTab, setActiveTab] = useState<TabKey>('gallery');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isLeadershipModalOpen, setIsLeadershipModalOpen] = useState(false);
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'gallery' | 'leadership' | 'media', id: string, url?: string } | null>(null);
    const [editingMember, setEditingMember] = useState<any>(null);

    // Form states
    const [uploadFileList, setUploadFileList] = useState<UploadFile[]>([]);
    const [galleryForm, setGalleryForm] = useState({ title: '', category: 'campus', description: '' });
    const [leadershipForm, setLeadershipForm] = useState({ name: '', position: '', photoUrl: '', bio: '', order: 0 });

    // Social Links state
    const [socialLinks, setSocialLinks] = useState<SocialLinksData>(defaultSocialLinks);
    const [newYtLink, setNewYtLink] = useState({ title: '', url: '' });
    const [newIgLink, setNewIgLink] = useState({ title: '', url: '', thumbnail: '' });

    // Programs state
    const [programs, setPrograms] = useState<ProgramItem[]>([]);
    const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
    const [editProgram, setEditProgram] = useState<ProgramItem | null>(null);
    const [programForm, setProgramForm] = useState({ title: '', level: '', duration: '', description: '', highlights: '', eligibility: '', icon: '📚' });

    // Faculty JSON state
    const [facultyItems, setFacultyItems] = useState<FacultyItem[]>([]);
    const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
    const [editFaculty, setEditFaculty] = useState<FacultyItem | null>(null);
    const [facultyForm, setFacultyForm] = useState({ name: '', position: '', category: 'authority' as 'authority' | 'hod' | 'faculty', profileImage: '', education: '', experience: '', specialization: '' });

    // Testimonials state
    const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
    const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
    const [editTestimonial, setEditTestimonial] = useState<TestimonialItem | null>(null);
    const [testimonialForm, setTestimonialForm] = useState({ name: '', batch: '', career: '', opinion: '', stars: 5, image: '' });

    // Admission toggle
    const [admissionOpen, setAdmissionOpen] = useState(false);

    useEffect(() => {
        if (activeTab === 'gallery') fetchGallery();
        if (activeTab === 'leadership') fetchLeadership();
        if (activeTab === 'content') fetchSiteContent();
        if (activeTab === 'media') fetchMediaFiles();
        if (['social', 'programs', 'faculty', 'testimonials', 'admissionToggle'].includes(activeTab)) fetchSiteContent();
    }, [activeTab]);

    useEffect(() => { if (error) { message.error(error); clearError(); } }, [error]);

    // Load site content data
    useEffect(() => {
        const socialContent = siteContent.find(c => c.key === 'social-links-json');
        if (socialContent?.value) { try { setSocialLinks({ ...defaultSocialLinks, ...JSON.parse(socialContent.value) }); } catch { setSocialLinks(defaultSocialLinks); } }

        const progContent = siteContent.find(c => c.key === 'programs-json');
        if (progContent?.value) { try { setPrograms(JSON.parse(progContent.value)); } catch { setPrograms([]); } }

        const facContent = siteContent.find(c => c.key === 'faculty-staff-json');
        if (facContent?.value) { try { setFacultyItems(JSON.parse(facContent.value)); } catch { setFacultyItems([]); } }

        const testContent = siteContent.find(c => c.key === 'testimonials-json');
        if (testContent?.value) { try { setTestimonials(JSON.parse(testContent.value)); } catch { setTestimonials([]); } }

        const admContent = siteContent.find(c => c.key === 'admission-open');
        if (admContent) setAdmissionOpen(admContent.value === 'true' || admContent.value === '1');
    }, [siteContent]);

    // ─── Gallery ─────────────────────────────────────────
    const handleGallerySubmit = async () => {
        if (!uploadFileList || uploadFileList.length === 0) return message.error('Please upload an image');
        if (!galleryForm.title) return message.error('Title is required');
        try {
            const file = uploadFileList[0].originFileObj as File;
            const uploadResult = await uploadFile(file);
            await createGalleryItem({ title: galleryForm.title, category: galleryForm.category as any, description: galleryForm.description, imageUrl: uploadResult.url, isActive: true });
            message.success('Gallery item added successfully');
            setIsUploadModalOpen(false); setGalleryForm({ title: '', category: 'campus', description: '' }); setUploadFileList([]);
        } catch (err) { console.error(err); }
    };

    // ─── Leadership ──────────────────────────────────────
    const handleLeadershipSubmit = async () => {
        if (!leadershipForm.name || !leadershipForm.position) return message.error('Name and Position are required');
        try {
            let photoUrl = leadershipForm.photoUrl;
            if (uploadFileList.length > 0) { const file = uploadFileList[0].originFileObj as File; const r = await uploadFile(file); photoUrl = r.url; }
            if (editingMember) { await updateLeadershipMember(editingMember._id, { ...leadershipForm, photoUrl }); message.success('Member updated'); }
            else { if (!photoUrl) return message.error('Photo is required'); await createLeadershipMember({ ...leadershipForm, photoUrl }); message.success('Member added'); }
            setIsLeadershipModalOpen(false); setEditingMember(null); setLeadershipForm({ name: '', position: '', photoUrl: '', bio: '', order: 0 }); setUploadFileList([]);
        } catch (err) { console.error(err); }
    };

    const openEditLeadership = (member: any) => {
        setEditingMember(member);
        setLeadershipForm({ name: member.name, position: member.position, photoUrl: member.photoUrl, bio: member.bio || '', order: member.order });
        setIsLeadershipModalOpen(true);
    };

    // ─── Delete ──────────────────────────────────────────
    const handleDelete = async () => {
        if (!deleteConfirm) return;
        try {
            if (deleteConfirm.type === 'gallery') await deleteGalleryItem(deleteConfirm.id);
            if (deleteConfirm.type === 'leadership') await deleteLeadershipMember(deleteConfirm.id);
            if (deleteConfirm.type === 'media' && deleteConfirm.url) await deleteMediaFile(deleteConfirm.url);
            message.success('Deleted successfully'); setDeleteConfirm(null);
        } catch (err) { console.error(err); }
    };

    // ─── Media ───────────────────────────────────────────
    const handleMediaSubmit = async () => {
        if (!uploadFileList || uploadFileList.length === 0) return message.error('Please select a file');
        try {
            const file = uploadFileList[0].originFileObj as File; const res = await uploadFile(file);
            message.success('File uploaded. Link: ' + res.url); fetchMediaFiles(); setIsMediaModalOpen(false); setUploadFileList([]);
        } catch (err) { console.error(err); }
    };

    // ─── Social Links ────────────────────────────────────
    const saveSocialLinks = async (updatedLinks: SocialLinksData) => {
        try {
            await updateSiteContent('social-links-json', { value: JSON.stringify(updatedLinks), type: 'json', description: 'Social media links' });
            setSocialLinks(updatedLinks); message.success('Social links updated!');
        } catch { message.error('Failed to save social links'); }
    };
    const addYoutubeLink = () => { if (!newYtLink.title || !newYtLink.url) return message.error('Title and URL required'); saveSocialLinks({ ...socialLinks, youtube: [...socialLinks.youtube, { ...newYtLink, id: Date.now().toString() }] }); setNewYtLink({ title: '', url: '' }); };
    const removeYoutubeLink = (id: string) => saveSocialLinks({ ...socialLinks, youtube: socialLinks.youtube.filter(y => y.id !== id) });
    const addInstagramLink = () => { if (!newIgLink.title || !newIgLink.url) return message.error('Title and URL required'); saveSocialLinks({ ...socialLinks, instagram: [...socialLinks.instagram, { ...newIgLink, id: Date.now().toString() }] }); setNewIgLink({ title: '', url: '', thumbnail: '' }); };
    const removeInstagramLink = (id: string) => saveSocialLinks({ ...socialLinks, instagram: socialLinks.instagram.filter(i => i.id !== id) });
    const updateSocialProfile = (field: keyof SocialLinksData, value: string) => setSocialLinks({ ...socialLinks, [field]: value });
    const saveSocialProfiles = () => saveSocialLinks(socialLinks);

    // ─── Programs CRUD ───────────────────────────────────
    const savePrograms = async (updatedPrograms: ProgramItem[]) => {
        try {
            await updateSiteContent('programs-json', { value: JSON.stringify(updatedPrograms), type: 'json', description: 'Academic programs for landing page' });
            setPrograms(updatedPrograms); message.success('Programs saved!');
        } catch { message.error('Failed to save programs'); }
    };
    const handleProgramSubmit = () => {
        if (!programForm.title || !programForm.level) return message.error('Title and Level are required');
        const item: ProgramItem = {
            id: editProgram ? editProgram.id : Date.now(),
            title: programForm.title, level: programForm.level, duration: programForm.duration,
            description: programForm.description, icon: programForm.icon || '📚',
            highlights: programForm.highlights.split('\n').filter(h => h.trim()),
            eligibility: programForm.eligibility.split('\n').filter(e => e.trim()),
        };
        if (editProgram) { savePrograms(programs.map(p => p.id === editProgram.id ? item : p)); }
        else { savePrograms([...programs, item]); }
        setIsProgramModalOpen(false); setEditProgram(null);
        setProgramForm({ title: '', level: '', duration: '', description: '', highlights: '', eligibility: '', icon: '📚' });
    };
    const openEditProgram = (p: ProgramItem) => {
        setEditProgram(p);
        setProgramForm({ title: p.title, level: p.level, duration: p.duration, description: p.description, highlights: p.highlights.join('\n'), eligibility: p.eligibility.join('\n'), icon: p.icon });
        setIsProgramModalOpen(true);
    };
    const deleteProgram = (id: number) => savePrograms(programs.filter(p => p.id !== id));

    // ─── Faculty JSON CRUD ───────────────────────────────
    const saveFacultyItems = async (items: FacultyItem[]) => {
        try {
            await updateSiteContent('faculty-staff-json', { value: JSON.stringify(items), type: 'json', description: 'Faculty & leadership data for landing page' });
            setFacultyItems(items); message.success('Faculty data saved!');
        } catch { message.error('Failed to save faculty data'); }
    };
    const handleFacultySubmit = async () => {
        if (!facultyForm.name || !facultyForm.position) return message.error('Name and Position are required');
        let profileImage = facultyForm.profileImage;
        if (uploadFileList.length > 0) { const file = uploadFileList[0].originFileObj as File; const r = await uploadFile(file); profileImage = r.url; }

        const item: FacultyItem = {
            id: editFaculty ? editFaculty.id : Date.now().toString(),
            name: facultyForm.name, position: facultyForm.position, category: facultyForm.category,
            profileImage, education: facultyForm.education, experience: facultyForm.experience, specialization: facultyForm.specialization,
        };
        if (editFaculty) { saveFacultyItems(facultyItems.map(f => f.id === editFaculty.id ? item : f)); }
        else { saveFacultyItems([...facultyItems, item]); }
        setIsFacultyModalOpen(false); setEditFaculty(null); setUploadFileList([]);
        setFacultyForm({ name: '', position: '', category: 'authority', profileImage: '', education: '', experience: '', specialization: '' });
    };
    const openEditFaculty = (f: FacultyItem) => {
        setEditFaculty(f);
        setFacultyForm({ name: f.name, position: f.position, category: f.category, profileImage: f.profileImage || '', education: f.education || '', experience: f.experience || '', specialization: f.specialization || '' });
        setIsFacultyModalOpen(true);
    };
    const deleteFaculty = (id: string) => saveFacultyItems(facultyItems.filter(f => f.id !== id));

    // ─── Testimonials CRUD ───────────────────────────────
    const saveTestimonials = async (items: TestimonialItem[]) => {
        try {
            await updateSiteContent('testimonials-json', { value: JSON.stringify(items), type: 'json', description: 'Alumni testimonials for landing page' });
            setTestimonials(items); message.success('Testimonials saved!');
        } catch { message.error('Failed to save testimonials'); }
    };
    const handleTestimonialSubmit = async () => {
        if (!testimonialForm.name || !testimonialForm.opinion) return message.error('Name and Opinion are required');
        if (testimonialForm.opinion.length > 200) return message.error('Opinion must be 200 characters or less');
        let image = testimonialForm.image;
        if (uploadFileList.length > 0) { const file = uploadFileList[0].originFileObj as File; const r = await uploadFile(file); image = r.url; }

        const item: TestimonialItem = {
            id: editTestimonial ? editTestimonial.id : Date.now().toString(),
            name: testimonialForm.name, batch: testimonialForm.batch, career: testimonialForm.career,
            opinion: testimonialForm.opinion, stars: testimonialForm.stars, image,
        };
        if (editTestimonial) { saveTestimonials(testimonials.map(t => t.id === editTestimonial.id ? item : t)); }
        else { saveTestimonials([...testimonials, item]); }
        setIsTestimonialModalOpen(false); setEditTestimonial(null); setUploadFileList([]);
        setTestimonialForm({ name: '', batch: '', career: '', opinion: '', stars: 5, image: '' });
    };
    const openEditTestimonial = (t: TestimonialItem) => {
        setEditTestimonial(t);
        setTestimonialForm({ name: t.name, batch: t.batch, career: t.career, opinion: t.opinion, stars: t.stars, image: t.image || '' });
        setIsTestimonialModalOpen(true);
    };
    const deleteTestimonial = (id: string) => saveTestimonials(testimonials.filter(t => t.id !== id));

    // ─── Admission Toggle ────────────────────────────────
    const toggleAdmission = async () => {
        const newVal = !admissionOpen;
        try {
            await updateSiteContent('admission-open', { value: newVal ? 'true' : 'false', type: 'text', description: 'Toggle admission form visibility on landing page' });
            setAdmissionOpen(newVal);
            message.success(`Admissions ${newVal ? 'OPENED' : 'CLOSED'} successfully!`);
        } catch { message.error('Failed to toggle admission status'); }
    };

    // ─── Tab config ──────────────────────────────────────
    const tabs: { key: TabKey; label: string; icon: any }[] = [
        { key: 'gallery', label: 'Gallery', icon: ImageIcon },
        { key: 'leadership', label: 'Leadership', icon: Users },
        { key: 'programs', label: 'Programs', icon: BookOpen },
        { key: 'faculty', label: 'Faculty', icon: GraduationCap },
        { key: 'testimonials', label: 'Testimonials', icon: MessageSquare },
        { key: 'social', label: 'Social Links', icon: Share2 },
        { key: 'content', label: 'Site Content', icon: Layout },
        { key: 'media', label: 'Media Library', icon: Folder },
        { key: 'admissionToggle', label: 'Admission', icon: admissionOpen ? ToggleRight : ToggleLeft },
    ];

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">Content Management</h1>
                    <p className="text-slate-400 mt-1">Manage all website content from one place.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap space-x-1 border-b border-white/10 pb-2 ">
                {tabs.map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg transition-colors whitespace-nowrap text-sm ${activeTab === tab.key ? 'bg-white/10 text-teal-400 border-b-2 border-teal-400' : 'text-slate-400 hover:text-emerald-700'}`}>
                        <tab.icon size={16} /> <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {/* Gallery Tab */}
                {activeTab === 'gallery' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                        <div className="flex justify-end"><button onClick={() => setIsUploadModalOpen(true)} className="btn-premium flex items-center space-x-2"><Plus size={18} /> <span>Add Image</span></button></div>
                        {loading ? <LoadingSpinner /> : (!gallery || gallery.length === 0) ? <EmptyState title="No Images Found" description="Upload images to display in the gallery." /> : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {gallery.map((item) => (
                                    <div key={item._id} className="card-premium group relative overflow-hidden">
                                        <div className="h-48 w-full overflow-hidden rounded-t-lg"><img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" /></div>
                                        <div className="p-4"><div className="flex justify-between items-start"><h3 className="text-lg font-semibold text-white">{item.title}</h3><span className="text-xs px-2 py-1 rounded bg-teal-500/20 text-teal-300 capitalize">{item.category}</span></div><p className="text-sm text-slate-400 mt-2 truncate">{item.description}</p></div>
                                        <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => setDeleteConfirm({ type: 'gallery', id: item._id })} className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full backdrop-blur-sm"><Trash2 size={16} /></button></div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Leadership Tab */}
                {activeTab === 'leadership' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                        <div className="flex justify-end"><button onClick={() => { setEditingMember(null); setIsLeadershipModalOpen(true); }} className="btn-premium flex items-center space-x-2"><Plus size={18} /> <span>Add Member</span></button></div>
                        {loading ? <LoadingSpinner /> : (!leadership || leadership.length === 0) ? <EmptyState title="No Team Members" description="Add leadership team members." /> : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {leadership.map((member) => (
                                    <div key={member._id} className="card-premium p-6 flex items-center space-x-4">
                                        <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-teal-500/30"><img src={member.photoUrl} alt={member.name} className="h-full w-full object-cover" /></div>
                                        <div className="flex-1"><h3 className="text-lg font-semibold text-white">{member.name}</h3><p className="text-teal-400 text-sm">{member.position}</p></div>
                                        <div className="flex space-x-2"><button onClick={() => openEditLeadership(member)} className="text-slate-400 hover:text-teal-400 p-1"><Edit size={16} /></button><button onClick={() => setDeleteConfirm({ type: 'leadership', id: member._id })} className="text-slate-400 hover:text-red-400 p-1"><Trash2 size={16} /></button></div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Programs Tab */}
                {activeTab === 'programs' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                        <div className="flex justify-between items-center">
                            <p className="text-slate-400 text-sm">Manage academic programs shown on the landing page. Changes are saved to the database via Site Content.</p>
                            <button onClick={() => { setEditProgram(null); setProgramForm({ title: '', level: '', duration: '', description: '', highlights: '', eligibility: '', icon: '📚' }); setIsProgramModalOpen(true); }} className="btn-premium flex items-center space-x-2"><Plus size={18} /> <span>Add Program</span></button>
                        </div>
                        {programs.length === 0 ? <EmptyState title="No Programs" description="Add academic programs to show on the landing page." /> : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {programs.map(p => (
                                    <div key={p.id} className="card-premium p-6 relative group">
                                        <div className="text-4xl mb-3">{p.icon}</div>
                                        <span className="text-xs px-2 py-1 rounded bg-teal-500/20 text-teal-300">{p.level}</span>
                                        <h3 className="text-lg font-semibold text-white mt-2">{p.title}</h3>
                                        <p className="text-sm text-slate-400 mt-1">{p.duration}</p>
                                        <p className="text-sm text-slate-500 mt-2 line-clamp-2">{p.description}</p>
                                        <div className="flex space-x-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEditProgram(p)} className="text-teal-400 hover:text-teal-300 p-2 bg-white/5 rounded-lg"><Edit size={14} /></button>
                                            <button onClick={() => deleteProgram(p.id)} className="text-red-400 hover:text-red-300 p-2 bg-white/5 rounded-lg"><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Faculty Tab */}
                {activeTab === 'faculty' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                        <div className="flex justify-between items-center">
                            <p className="text-slate-400 text-sm">Manage Supreme Authority, HODs, and Faculty Members. Data is stored as JSON in Site Content.</p>
                            <button onClick={() => { setEditFaculty(null); setFacultyForm({ name: '', position: '', category: 'authority', profileImage: '', education: '', experience: '', specialization: '' }); setUploadFileList([]); setIsFacultyModalOpen(true); }} className="btn-premium flex items-center space-x-2"><Plus size={18} /> <span>Add Faculty</span></button>
                        </div>
                        {/* Category sections */}
                        {(['authority', 'hod', 'faculty'] as const).map(cat => {
                            const catLabel = cat === 'authority' ? '🏛️ Supreme Authority' : cat === 'hod' ? '📋 Heads of Department' : '👨‍🏫 Faculty Members';
                            const items = facultyItems.filter(f => f.category === cat);
                            return (
                                <div key={cat}>
                                    <h3 className="text-lg font-semibold text-emerald-700 mb-4 flex items-center gap-2">{catLabel} <span className="text-xs text-slate-500">({items.length})</span></h3>
                                    {items.length === 0 ? <p className="text-slate-500 text-sm mb-4">No members in this category.</p> : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                            {items.map(f => (
                                                <div key={f.id} className="card-premium p-4 flex items-center space-x-4 group">
                                                    <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-teal-500/30 flex-shrink-0">
                                                        {f.profileImage ? <img src={f.profileImage} alt={f.name} className="h-full w-full object-cover" /> : <div className="h-full w-full bg-teal-800 flex items-center justify-center text-white text-xl font-bold">{f.name[0]}</div>}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-white font-medium truncate">{f.name}</h4>
                                                        <p className="text-teal-400 text-xs">{f.position}</p>
                                                        {f.specialization && <p className="text-slate-500 text-xs truncate">{f.specialization}</p>}
                                                    </div>
                                                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => openEditFaculty(f)} className="text-teal-400 p-1"><Edit size={14} /></button>
                                                        <button onClick={() => deleteFaculty(f.id)} className="text-red-400 p-1"><Trash2 size={14} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </motion.div>
                )}

                {/* Testimonials Tab */}
                {activeTab === 'testimonials' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                        <div className="flex justify-between items-center">
                            <p className="text-slate-400 text-sm">Manage alumni testimonials. Opinion must be 200 characters or less.</p>
                            <button onClick={() => { setEditTestimonial(null); setTestimonialForm({ name: '', batch: '', career: '', opinion: '', stars: 5, image: '' }); setUploadFileList([]); setIsTestimonialModalOpen(true); }} className="btn-premium flex items-center space-x-2"><Plus size={18} /> <span>Add Testimonial</span></button>
                        </div>
                        {testimonials.length === 0 ? <EmptyState title="No Testimonials" description="Add alumni testimonials to display on the landing page." /> : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {testimonials.map(t => (
                                    <div key={t.id} className="card-premium p-6 group">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                {t.image ? <img src={t.image} alt={t.name} className="h-12 w-12 rounded-full object-cover border-2 border-teal-500/30" /> : <div className="h-12 w-12 rounded-full bg-teal-800 flex items-center justify-center text-white font-bold">{t.name[0]}</div>}
                                                <div><h4 className="text-white font-medium">{t.name}</h4><p className="text-teal-400 text-xs">Batch of {t.batch}</p><p className="text-slate-500 text-xs">{t.career}</p></div>
                                            </div>
                                            <div className="flex text-yellow-400 text-sm">{'★'.repeat(t.stars)}{'☆'.repeat(5 - t.stars)}</div>
                                        </div>
                                        <p className="text-slate-300 text-sm italic">"{t.opinion}"</p>
                                        <div className="flex space-x-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEditTestimonial(t)} className="text-teal-400 hover:text-teal-300 p-2 bg-white/5 rounded-lg"><Edit size={14} /></button>
                                            <button onClick={() => deleteTestimonial(t.id)} className="text-red-400 hover:text-red-300 p-2 bg-white/5 rounded-lg"><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Site Content Tab */}
                {activeTab === 'content' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                        {loading ? <LoadingSpinner /> : (!siteContent || siteContent.length === 0) ? <div className="card-premium p-6 text-center"><p className="text-slate-400">No dynamic content keys found.</p></div> : (
                            <div className="grid grid-cols-1 gap-6">
                                {siteContent.map((content) => (
                                    <div key={content.key} className="card-premium p-6">
                                        <div className="flex justify-between items-start mb-2"><div><h3 className="text-lg font-semibold text-white capitalize">{content.key.replace(/-/g, ' ')}</h3><p className="text-xs text-teal-400 uppercase tracking-wider">{content.section}</p></div><span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">{content.type}</span></div>
                                        <p className="text-sm text-slate-400 mb-4">{content.description}</p>
                                        <div className="flex gap-4">
                                            {content.type === 'text' || content.type === 'url' ?
                                                <input type="text" className="input-premium w-full" defaultValue={content.value} onBlur={(e) => { if (e.target.value !== content.value) { updateSiteContent(content.key, { value: e.target.value }); message.success('Content updated'); } }} /> :
                                                <textarea className="input-premium w-full min-h-[100px]" defaultValue={content.value} onBlur={(e) => { if (e.target.value !== content.value) { updateSiteContent(content.key, { value: e.target.value }); message.success('Content updated'); } }} />
                                            }
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Social Links Tab */}
                {activeTab === 'social' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
                        <div className="card-premium p-6">
                            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2"><Share2 size={20} className="text-teal-400" /> Social Media Profiles</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div><label className="text-sm text-slate-400 mb-1 block">YouTube Channel URL</label><input type="text" className="input-premium w-full" placeholder="https://youtube.com/@channel" value={socialLinks.youtubeChannel || ''} onChange={e => updateSocialProfile('youtubeChannel', e.target.value)} /></div>
                                <div><label className="text-sm text-slate-400 mb-1 block">Instagram Profile URL</label><input type="text" className="input-premium w-full" placeholder="https://instagram.com/profile" value={socialLinks.instagramProfile || ''} onChange={e => updateSocialProfile('instagramProfile', e.target.value)} /></div>
                                <div><label className="text-sm text-slate-400 mb-1 block">Facebook Page URL</label><input type="text" className="input-premium w-full" placeholder="https://facebook.com/page" value={socialLinks.facebookPage || ''} onChange={e => updateSocialProfile('facebookPage', e.target.value)} /></div>
                                <div><label className="text-sm text-slate-400 mb-1 block">WhatsApp Number</label><input type="text" className="input-premium w-full" placeholder="919876543210" value={socialLinks.whatsappNumber || ''} onChange={e => updateSocialProfile('whatsappNumber', e.target.value)} /></div>
                            </div>
                            <button onClick={saveSocialProfiles} className="btn-premium mt-2">Save Profile Links</button>
                        </div>
                        <div className="card-premium p-6">
                            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2"><Youtube size={20} className="text-red-500" /> YouTube Videos</h3>
                            {socialLinks.youtube.length > 0 && <div className="space-y-3 mb-6">{socialLinks.youtube.map(v => <div key={v.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-4"><div className="flex-1"><p className="text-white font-medium">{v.title}</p><a href={v.url} target="_blank" rel="noreferrer" className="text-teal-400 text-sm hover:underline">{v.url}</a></div><button onClick={() => removeYoutubeLink(v.id)} className="text-red-400 hover:text-red-300 p-2 ml-4"><Trash2 size={16} /></button></div>)}</div>}
                            <div className="flex flex-col sm:flex-row gap-3 sm:items-end w-full">
                                <div className="flex-1 w-full sm:min-w-[200px]"><label className="text-sm text-slate-400 mb-1 block">Title</label><input type="text" className="input-premium w-full" placeholder="Video title" value={newYtLink.title} onChange={e => setNewYtLink({ ...newYtLink, title: e.target.value })} /></div>
                                <div className="flex-1 w-full sm:min-w-[200px]"><label className="text-sm text-slate-400 mb-1 block">YouTube URL</label><input type="text" className="input-premium w-full" placeholder="https://youtube.com/watch?v=..." value={newYtLink.url} onChange={e => setNewYtLink({ ...newYtLink, url: e.target.value })} /></div>
                                <button onClick={addYoutubeLink} className="btn-premium flex items-center justify-center space-x-2 w-full sm:w-auto"><Plus size={16} /> <span>Add</span></button>
                            </div>
                        </div>
                        <div className="card-premium p-6">
                            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2"><Instagram size={20} className="text-pink-500" /> Instagram Posts</h3>
                            {socialLinks.instagram.length > 0 && <div className="space-y-3 mb-6">{socialLinks.instagram.map(p => <div key={p.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-4"><div className="flex-1"><p className="text-white font-medium">{p.title}</p><a href={p.url} target="_blank" rel="noreferrer" className="text-teal-400 text-sm hover:underline">{p.url}</a></div><button onClick={() => removeInstagramLink(p.id)} className="text-red-400 hover:text-red-300 p-2 ml-4"><Trash2 size={16} /></button></div>)}</div>}
                            <div className="flex flex-col sm:flex-row gap-3 sm:items-end w-full">
                                <div className="flex-1 w-full sm:min-w-[150px]"><label className="text-sm text-slate-400 mb-1 block">Title</label><input type="text" className="input-premium w-full" placeholder="Post title" value={newIgLink.title} onChange={e => setNewIgLink({ ...newIgLink, title: e.target.value })} /></div>
                                <div className="flex-1 w-full sm:min-w-[150px]"><label className="text-sm text-slate-400 mb-1 block">Instagram URL</label><input type="text" className="input-premium w-full" placeholder="https://instagram.com/p/..." value={newIgLink.url} onChange={e => setNewIgLink({ ...newIgLink, url: e.target.value })} /></div>
                                <div className="flex-1 w-full sm:min-w-[150px]"><label className="text-sm text-slate-400 mb-1 block">Thumbnail (Optional)</label><input type="text" className="input-premium w-full" placeholder="https://..." value={newIgLink.thumbnail} onChange={e => setNewIgLink({ ...newIgLink, thumbnail: e.target.value })} /></div>
                                <button onClick={addInstagramLink} className="btn-premium flex items-center justify-center space-x-2 w-full sm:w-auto"><Plus size={16} /> <span>Add</span></button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Media Tab */}
                {activeTab === 'media' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                        <div className="flex justify-end"><button onClick={() => setIsMediaModalOpen(true)} className="btn-premium flex items-center space-x-2"><Plus size={18} /> <span>Upload Raw File</span></button></div>
                        {loading ? <LoadingSpinner /> : (!media || media.length === 0) ? <EmptyState title="No Media Found" description="Upload raw media files." /> : (
                            <div className="bg-white/5 border border-white/10 rounded-xl overflow-x-auto">
                                <table className="w-full text-left whitespace-nowrap min-w-[600px]">
                                    <thead className="bg-white/5 border-b border-white/10"><tr><th className="px-6 py-4 text-slate-300 font-medium">File Name</th><th className="px-6 py-4 text-slate-300 font-medium">Size</th><th className="px-6 py-4 text-slate-300 font-medium">Date</th><th className="px-6 py-4 text-slate-300 font-medium text-right">Actions</th></tr></thead>
                                    <tbody className="divide-y divide-white/5">
                                        {media.map((file, idx) => (
                                            <tr key={idx} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-6 py-4"><a href={file.url} target="_blank" rel="noreferrer" className="text-teal-400 hover:underline">{file.filename}</a></td>
                                                <td className="px-6 py-4 text-slate-400">{(file.size / 1024).toFixed(1)} KB</td>
                                                <td className="px-6 py-4 text-slate-400">{new Date(file.createdAt).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 text-right"><div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={async () => { await navigator.clipboard.writeText(file.url); message.success('Link copied!'); }} className="text-slate-400 hover:text-teal-400 p-2"><Copy size={16} /></button><button onClick={() => setDeleteConfirm({ type: 'media', id: file.filename, url: file.url })} className="text-slate-400 hover:text-red-400 p-2"><Trash2 size={16} /></button></div></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Admission Toggle Tab */}
                {activeTab === 'admissionToggle' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                        <div className="card-premium p-8 max-w-lg mx-auto text-center">
                            <div className="mb-6">
                                <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 transition-colors duration-300 ${admissionOpen ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {admissionOpen ? <ToggleRight size={48} /> : <ToggleLeft size={48} />}
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Admission Portal</h2>
                                <p className="text-slate-400">Current Status: <span className={`font-bold ${admissionOpen ? 'text-emerald-400' : 'text-red-400'}`}>{admissionOpen ? 'OPEN' : 'CLOSED'}</span></p>
                                <p className="text-slate-500 text-sm mt-2">When admissions are open, visitors can submit admission applications from the landing page. When closed, only contact information is shown.</p>
                            </div>
                            <button onClick={toggleAdmission} className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${admissionOpen ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                                {admissionOpen ? '🔒 Close Admissions' : '🔓 Open Admissions'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── Modals ───────────────────────────────────────── */}
            {/* Gallery Modal */}
            <Modal title="Add to Gallery" open={isUploadModalOpen} onCancel={() => setIsUploadModalOpen(false)} onOk={handleGallerySubmit} okText="Upload" okButtonProps={{ className: 'bg-teal-600' }}>
                <div className="space-y-4 pt-4">
                    <input type="text" placeholder="Title" className="w-full p-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" value={galleryForm.title} onChange={e => setGalleryForm({ ...galleryForm, title: e.target.value })} />
                    <select className="w-full p-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" value={galleryForm.category} onChange={e => setGalleryForm({ ...galleryForm, category: e.target.value })}><option value="campus">Campus</option><option value="events">Events</option><option value="achievements">Achievements</option><option value="other">Other</option></select>
                    <textarea placeholder="Description" className="w-full p-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none min-h-[80px]" value={galleryForm.description} onChange={e => setGalleryForm({ ...galleryForm, description: e.target.value })} />
                    <AntUpload beforeUpload={() => false} maxCount={1} fileList={uploadFileList} onChange={({ fileList }) => setUploadFileList(fileList)}><button className="px-5 py-2.5 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg w-full flex justify-center items-center space-x-2 font-medium transition-colors"><Upload size={16} /> <span>Select Image</span></button></AntUpload>
                </div>
            </Modal>

            {/* Leadership Modal */}
            <Modal title={editingMember ? "Edit Member" : "Add Team Member"} open={isLeadershipModalOpen} onCancel={() => setIsLeadershipModalOpen(false)} onOk={handleLeadershipSubmit} okText={editingMember ? "Update" : "Add"} okButtonProps={{ className: 'bg-teal-600' }}>
                <div className="space-y-4 pt-4">
                    <input type="text" placeholder="Full Name" className="w-full p-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" value={leadershipForm.name} onChange={e => setLeadershipForm({ ...leadershipForm, name: e.target.value })} />
                    <input type="text" placeholder="Position" className="w-full p-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" value={leadershipForm.position} onChange={e => setLeadershipForm({ ...leadershipForm, position: e.target.value })} />
                    <textarea placeholder="Bio" className="w-full p-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none min-h-[80px]" value={leadershipForm.bio} onChange={e => setLeadershipForm({ ...leadershipForm, bio: e.target.value })} />
                    <input type="number" placeholder="Order" className="w-full p-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" value={leadershipForm.order} onChange={e => setLeadershipForm({ ...leadershipForm, order: Number(e.target.value) })} />
                    <AntUpload beforeUpload={() => false} maxCount={1} fileList={uploadFileList} onChange={({ fileList }) => setUploadFileList(fileList)}><button className="px-5 py-2.5 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg w-full flex justify-center items-center space-x-2 font-medium transition-colors"><Upload size={16} /> <span>{editingMember ? "Change Photo" : "Select Photo"}</span></button></AntUpload>
                </div>
            </Modal>

            {/* Media Upload Modal */}
            <Modal title="Upload Media File" open={isMediaModalOpen} onCancel={() => setIsMediaModalOpen(false)} onOk={handleMediaSubmit} okText="Upload File" okButtonProps={{ className: 'bg-teal-600' }}>
                <div className="space-y-4 pt-4 text-center">
                    <p className="text-slate-500 mb-4 text-left">Files are stored on Cloudinary with a public link.</p>
                    <AntUpload beforeUpload={() => false} maxCount={1} fileList={uploadFileList} onChange={({ fileList }) => setUploadFileList(fileList)}><button className="px-5 py-2.5 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg w-full flex justify-center items-center space-x-2 font-medium transition-colors"><Upload size={16} /> <span>Select File to Upload</span></button></AntUpload>
                </div>
            </Modal>

            {/* Program Modal */}
            <Modal title={editProgram ? "Edit Program" : "Add Program"} open={isProgramModalOpen} onCancel={() => setIsProgramModalOpen(false)} onOk={handleProgramSubmit} okText={editProgram ? "Update" : "Add"} okButtonProps={{ className: 'bg-teal-600' }}>
                <div className="space-y-4 pt-4">
                    <input type="text" placeholder="Program Title" className="w-full p-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" value={programForm.title} onChange={e => setProgramForm({ ...programForm, title: e.target.value })} />
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Level (e.g. Foundation)" className="w-full p-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" value={programForm.level} onChange={e => setProgramForm({ ...programForm, level: e.target.value })} />
                        <input type="text" placeholder="Duration (e.g. 2 Years)" className="w-full p-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" value={programForm.duration} onChange={e => setProgramForm({ ...programForm, duration: e.target.value })} />
                    </div>
                    <input type="text" placeholder="Icon Emoji (e.g. 📚)" className="w-full p-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" value={programForm.icon} onChange={e => setProgramForm({ ...programForm, icon: e.target.value })} />
                    <textarea placeholder="Description" className="w-full p-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none min-h-[80px]" value={programForm.description} onChange={e => setProgramForm({ ...programForm, description: e.target.value })} />
                    <textarea placeholder="Highlights (one per line)" className="w-full p-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none min-h-[80px]" value={programForm.highlights} onChange={e => setProgramForm({ ...programForm, highlights: e.target.value })} />
                    <textarea placeholder="Eligibility (one per line)" className="w-full p-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none min-h-[60px]" value={programForm.eligibility} onChange={e => setProgramForm({ ...programForm, eligibility: e.target.value })} />
                </div>
            </Modal>

            {/* Faculty Modal */}
            <Modal title={editFaculty ? "Edit Faculty Member" : "Add Faculty Member"} open={isFacultyModalOpen} onCancel={() => setIsFacultyModalOpen(false)} onOk={handleFacultySubmit} okText={editFaculty ? "Update" : "Add"} okButtonProps={{ className: 'bg-teal-600' }}>
                <div className="space-y-4 pt-4">
                    <input type="text" placeholder="Full Name" className="w-full p-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" value={facultyForm.name} onChange={e => setFacultyForm({ ...facultyForm, name: e.target.value })} />
                    <input type="text" placeholder="Position (e.g. Principal)" className="w-full p-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" value={facultyForm.position} onChange={e => setFacultyForm({ ...facultyForm, position: e.target.value })} />
                    <select className="w-full p-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" value={facultyForm.category} onChange={e => setFacultyForm({ ...facultyForm, category: e.target.value as any })}>
                        <option value="authority">Supreme Authority</option><option value="hod">Head of Department</option><option value="faculty">Faculty Member</option>
                    </select>
                    <input type="text" placeholder="Education (Optional)" className="w-full p-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" value={facultyForm.education} onChange={e => setFacultyForm({ ...facultyForm, education: e.target.value })} />
                    <input type="text" placeholder="Experience (Optional)" className="w-full p-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" value={facultyForm.experience} onChange={e => setFacultyForm({ ...facultyForm, experience: e.target.value })} />
                    <input type="text" placeholder="Specialization (Optional)" className="w-full p-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" value={facultyForm.specialization} onChange={e => setFacultyForm({ ...facultyForm, specialization: e.target.value })} />
                    <AntUpload beforeUpload={() => false} maxCount={1} fileList={uploadFileList} onChange={({ fileList }) => setUploadFileList(fileList)}><button className="px-5 py-2.5 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg w-full flex justify-center items-center space-x-2 font-medium transition-colors"><Upload size={16} /> <span>{editFaculty ? "Change Photo" : "Upload Photo"}</span></button></AntUpload>
                </div>
            </Modal>

            {/* Testimonial Modal */}
            <Modal title={editTestimonial ? "Edit Testimonial" : "Add Testimonial"} open={isTestimonialModalOpen} onCancel={() => setIsTestimonialModalOpen(false)} onOk={handleTestimonialSubmit} okText={editTestimonial ? "Update" : "Add"} okButtonProps={{ className: 'bg-teal-600' }}>
                <div className="space-y-4 pt-4">
                    <input type="text" placeholder="Alumni Name" className="w-full p-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" value={testimonialForm.name} onChange={e => setTestimonialForm({ ...testimonialForm, name: e.target.value })} />
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Batch (e.g. 2020)" className="w-full p-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" value={testimonialForm.batch} onChange={e => setTestimonialForm({ ...testimonialForm, batch: e.target.value })} />
                        <input type="text" placeholder="Current Career" className="w-full p-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" value={testimonialForm.career} onChange={e => setTestimonialForm({ ...testimonialForm, career: e.target.value })} />
                    </div>
                    <div>
                        <textarea placeholder="Opinion (max 200 chars)" className="w-full p-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none min-h-[80px]" maxLength={200} value={testimonialForm.opinion} onChange={e => setTestimonialForm({ ...testimonialForm, opinion: e.target.value })} />
                        <p className="text-xs text-slate-500 mt-1">{testimonialForm.opinion.length}/200 characters</p>
                    </div>
                    <div>
                        <label className="text-sm text-slate-400 mb-2 block">Star Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(s => (
                                <button key={s} onClick={() => setTestimonialForm({ ...testimonialForm, stars: s })} className={`text-2xl transition-colors ${s <= testimonialForm.stars ? 'text-yellow-400' : 'text-slate-600'}`}>★</button>
                            ))}
                        </div>
                    </div>
                    <AntUpload beforeUpload={() => false} maxCount={1} fileList={uploadFileList} onChange={({ fileList }) => setUploadFileList(fileList)}><button className="px-5 py-2.5 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg w-full flex justify-center items-center space-x-2 font-medium transition-colors"><Upload size={16} /> <span>{editTestimonial ? "Change Photo" : "Upload Photo (Optional)"}</span></button></AntUpload>
                </div>
            </Modal>

            <ConfirmDialog open={!!deleteConfirm} title="Delete Item" message="Are you sure? This action cannot be undone." onConfirm={handleDelete} onCancel={() => setDeleteConfirm(null)} />
        </div>
    );
};

export default CMSPage;
