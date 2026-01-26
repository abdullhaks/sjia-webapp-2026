import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import SectionWrapper from '../../common/SectionWrapper';
import AnimatedHeading from '../../common/AnimatedHeading';
import Card from '../../common/Card';
import { useCMSStore } from '../../../store/cmsStore';
import LoadingSpinner from '../../common/LoadingSpinner';

interface Activity {
    id: number;
    title: string;
    description: string;
    category: string;
    image: string;
}

const CampusSection: React.FC = () => {
    const { gallery, fetchGallery, loading } = useCMSStore();
    const [activeTab, setActiveTab] = useState<'activities' | 'gallery'>('activities');
    const [selectedImage, setSelectedImage] = useState<any | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    useEffect(() => {
        fetchGallery();
    }, [fetchGallery]);

    const activities: Activity[] = [
        {
            id: 1,
            title: 'Arts & Cultural Programs',
            description: 'Regular cultural events celebrating Islamic heritage and artistic expression',
            category: 'Cultural',
            image: '🎨',
        },
        {
            id: 2,
            title: 'Sports Events',
            description: 'Annual sports meet promoting physical fitness and team spirit',
            category: 'Sports',
            image: '⚽',
        },
        {
            id: 3,
            title: 'Academic Competitions',
            description: 'Quiz competitions, debates, and academic olympiads',
            category: 'Academic',
            image: '🏆',
        },
        {
            id: 4,
            title: 'Community Service',
            description: 'Social outreach programs and charitable activities',
            category: 'Service',
            image: '🤝',
        },
        {
            id: 5,
            title: 'Islamic Seminars',
            description: 'Regular seminars on Islamic knowledge and contemporary issues',
            category: 'Religious',
            image: '📚',
        },
        {
            id: 6,
            title: 'Science Exhibitions',
            description: 'Annual science fair showcasing student innovations',
            category: 'Academic',
            image: '🔬',
        },
    ];

    const categories = ['all', 'campus', 'events', 'achievements', 'other'];

    const filteredImages = selectedCategory === 'all'
        ? gallery
        : gallery.filter(img => img.category === selectedCategory);

    const currentImageIndex = selectedImage
        ? filteredImages.findIndex(img => img._id === selectedImage._id)
        : -1;

    const handlePrevImage = () => {
        if (currentImageIndex > 0) {
            setSelectedImage(filteredImages[currentImageIndex - 1]);
        }
    };

    const handleNextImage = () => {
        if (currentImageIndex < filteredImages.length - 1) {
            setSelectedImage(filteredImages[currentImageIndex + 1]);
        }
    };

    return (
        <SectionWrapper id="campus" background="dots">
            <div className="text-center mb-16 pt-16">
                <AnimatedHeading level={2} gradient center className="mb-4">
                    Campus Life
                </AnimatedHeading>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-lg text-gray-600 max-w-3xl mx-auto"
                >
                    Experience the vibrant campus life at SJIA with diverse activities,
                    modern facilities, and a nurturing environment.
                </motion.p>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-12">
                <div className="inline-flex bg-white rounded-xl shadow-md p-2">
                    <button
                        onClick={() => setActiveTab('activities')}
                        className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 ${activeTab === 'activities'
                            ? 'bg-primary text-white shadow-md'
                            : 'text-gray-600 hover:text-primary'
                            }`}
                    >
                        Activities
                    </button>
                    <button
                        onClick={() => setActiveTab('gallery')}
                        className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 ${activeTab === 'gallery'
                            ? 'bg-primary text-white shadow-md'
                            : 'text-gray-600 hover:text-primary'
                            }`}
                    >
                        Gallery
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                {activeTab === 'activities' ? (
                    <motion.div
                        key="activities"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-16"
                    >
                        {activities.map((activity, index) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card variant="white" hover className="p-6 h-full">
                                    <div className="text-6xl mb-4">{activity.image}</div>
                                    <div className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                                        {activity.category}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {activity.title}
                                    </h3>
                                    <p className="text-gray-600">{activity.description}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="gallery"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Category Filter */}
                        <div className="flex justify-center gap-3 mb-8 flex-wrap">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-6 py-2 rounded-lg font-medium capitalize transition-all duration-300 ${selectedCategory === category
                                        ? 'bg-primary text-white shadow-md'
                                        : 'bg-white text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* Gallery Grid */}
                        {loading && gallery.length === 0 ? (
                            <LoadingSpinner />
                        ) : filteredImages.length === 0 ? (
                            <div className="text-center text-gray-500 py-10">No images found in this category.</div>
                        ) : (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {filteredImages.map((image, index) => (
                                    <motion.div
                                        key={image._id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                                        onClick={() => setSelectedImage(image)}
                                    >
                                        <img src={image.imageUrl} alt={image.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                                            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">
                                                View Image
                                            </span>
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                                            <p className="text-white text-sm font-medium">{image.title}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 text-white hover:text-accent transition-colors z-10"
                        >
                            <FaTimes size={32} />
                        </button>

                        {currentImageIndex > 0 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePrevImage();
                                }}
                                className="absolute left-4 text-white hover:text-accent transition-colors z-10"
                            >
                                <FaChevronLeft size={48} />
                            </button>
                        )}

                        {currentImageIndex < filteredImages.length - 1 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleNextImage();
                                }}
                                className="absolute right-4 text-white hover:text-accent transition-colors z-10"
                            >
                                <FaChevronRight size={48} />
                            </button>
                        )}

                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="max-w-4xl w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-black rounded-xl max-h-[80vh] flex items-center justify-center overflow-hidden">
                                <img src={selectedImage.imageUrl} alt={selectedImage.title} className="max-w-full max-h-full object-contain" />
                            </div>
                            <div className="mt-4 text-center">
                                <h3 className="text-white text-2xl font-bold mb-2">
                                    {selectedImage.title}
                                </h3>
                                <p className="text-gray-300">
                                    {selectedImage.description}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </SectionWrapper>
    );
};

export default CampusSection;
