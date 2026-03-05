import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCMSStore } from '../../store/cmsStore';
import { GalleryItem } from '../../services/api/cms.api';
import { FaImage, FaTimes } from 'react-icons/fa';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StudentMediaPage: React.FC = () => {
    const { gallery, fetchGallery, loading } = useCMSStore();
    const [selectedMedia, setSelectedMedia] = useState<GalleryItem | null>(null);
    const [filter, setFilter] = useState<'all' | 'campus' | 'events' | 'achievements' | 'other'>('all');

    useEffect(() => {
        fetchGallery();
    }, [fetchGallery]);

    const filteredGallery = gallery.filter((item) => {
        if (filter === 'all') return true;
        return item.category === filter;
    });

    if (loading && gallery.length === 0) return <LoadingSpinner />;

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Media Center</h1>
                <p className="text-gray-500">Memories, links, and videos from campus events</p>

                <div className="mt-6 flex gap-3 flex-wrap">
                    {(['all', 'campus', 'events', 'achievements', 'other'] as const).map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${filter === cat ? 'bg-indigo-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            {cat === 'all' ? 'All Media' : cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {filteredGallery.map((item, index) => (
                    <motion.div
                        key={item._id || index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="break-inside-avoid relative group overflow-hidden rounded-2xl shadow-sm border border-gray-100 bg-white cursor-pointer"
                        onClick={() => setSelectedMedia(item)}
                    >
                        <div className="relative w-full overflow-hidden">
                            <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 min-h-[200px]"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
                        </div>

                        <div className="absolute bottom-0 inset-x-0 p-4 pt-12 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                            <div className="flex items-center gap-2 text-white/90 mb-1">
                                <FaImage className="w-3 h-3" />
                                <span className="text-xs font-medium uppercase tracking-wider">{item.category}</span>
                            </div>
                            <h3 className="text-lg font-bold text-white leading-tight drop-shadow-md">
                                {item.title}
                            </h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredGallery.length === 0 && !loading && (
                <div className="bg-white p-12 rounded-2xl border border-gray-200 border-dashed text-center">
                    <p className="text-gray-500 text-lg">No media found for this category.</p>
                </div>
            )}

            {/* Media Viewer Modal */}
            <AnimatePresence>
                {selectedMedia && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
                        onClick={() => setSelectedMedia(null)}
                    >
                        <button
                            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                            onClick={() => setSelectedMedia(null)}
                        >
                            <FaTimes className="w-6 h-6" />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl bg-black relative"
                        >
                            <img
                                src={selectedMedia.imageUrl}
                                alt={selectedMedia.title}
                                className="w-full auto object-contain max-h-[85vh]"
                            />
                            <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                <h2 className="text-2xl font-bold text-white mb-2">{selectedMedia.title}</h2>
                                {selectedMedia.description && (
                                    <p className="text-white/80">{selectedMedia.description}</p>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentMediaPage;
