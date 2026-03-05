import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaYoutube, FaInstagram, FaExternalLinkAlt, FaPlay } from 'react-icons/fa';
import SectionWrapper from '../../common/SectionWrapper';
import AnimatedHeading from '../../common/AnimatedHeading';
import Card from '../../common/Card';
import { useCMSStore } from '../../../store/cmsStore';

interface YouTubeLink {
    id: string;
    title: string;
    url: string;
    thumbnail?: string;
}

interface InstagramLink {
    id: string;
    title: string;
    url: string;
    thumbnail?: string;
}

interface SocialLinks {
    youtube: YouTubeLink[];
    instagram: InstagramLink[];
}

const extractYoutubeId = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
};

const SocialMediaSection: React.FC = () => {
    const { siteContent, fetchSiteContent } = useCMSStore();
    const [socialLinks, setSocialLinks] = useState<SocialLinks>({ youtube: [], instagram: [] });
    const [activeTab, setActiveTab] = useState<'youtube' | 'instagram'>('youtube');
    const [playingVideo, setPlayingVideo] = useState<string | null>(null);

    useEffect(() => {
        if (siteContent.length === 0) fetchSiteContent();
    }, [fetchSiteContent, siteContent.length]);

    useEffect(() => {
        const content = siteContent.find((c) => c.key === 'social-links-json');
        if (content && content.value) {
            try {
                const parsed: SocialLinks = JSON.parse(content.value);
                setSocialLinks(parsed);
            } catch (e) {
                console.error('Failed to parse social-links-json', e);
                setSocialLinks(defaultSocialLinks);
            }
        } else {
            setSocialLinks(defaultSocialLinks);
        }
    }, [siteContent]);

    const defaultSocialLinks: SocialLinks = {
        youtube: [
            {
                id: '1',
                title: 'Annual Day Celebration 2024',
                url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            },
            {
                id: '2',
                title: 'Campus Tour - SJIA',
                url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            },
            {
                id: '3',
                title: 'Farewell Ceremony 2024',
                url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            },
        ],
        instagram: [
            {
                id: '1',
                title: 'Arts & Cultural Festival',
                url: 'https://www.instagram.com/sjia_official',
                thumbnail: '',
            },
            {
                id: '2',
                title: 'Sports Day Highlights',
                url: 'https://www.instagram.com/sjia_official',
                thumbnail: '',
            },
            {
                id: '3',
                title: 'Graduation Ceremony',
                url: 'https://www.instagram.com/sjia_official',
                thumbnail: '',
            },
        ],
    };

    return (
        <SectionWrapper id="social-media" background="white">
            <div className="text-center mb-16 pt-16">
                <AnimatedHeading level={2} gradient center className="mb-4">
                    Follow Our Journey
                </AnimatedHeading>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-lg text-gray-600 max-w-3xl mx-auto"
                >
                    Stay connected with SJIA through our social media channels.
                    Watch our latest videos and explore our Instagram highlights.
                </motion.p>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-12">
                <div className="inline-flex bg-gray-100 rounded-xl p-1.5 shadow-inner">
                    <button
                        onClick={() => setActiveTab('youtube')}
                        className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-all duration-300 ${activeTab === 'youtube'
                                ? 'bg-red-600 text-white shadow-lg shadow-red-500/30'
                                : 'text-gray-600 hover:text-red-600'
                            }`}
                    >
                        <FaYoutube size={20} />
                        YouTube
                    </button>
                    <button
                        onClick={() => setActiveTab('instagram')}
                        className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-all duration-300 ${activeTab === 'instagram'
                                ? 'bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white shadow-lg shadow-pink-500/30'
                                : 'text-gray-600 hover:text-pink-600'
                            }`}
                    >
                        <FaInstagram size={20} />
                        Instagram
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'youtube' && (
                    <motion.div
                        key="youtube"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="pb-16"
                    >
                        {socialLinks.youtube.length === 0 ? (
                            <div className="text-center text-gray-500 py-10">
                                No YouTube videos available yet.
                            </div>
                        ) : (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {socialLinks.youtube.map((video, index) => {
                                    const videoId = extractYoutubeId(video.url);
                                    const isPlaying = playingVideo === video.id;
                                    return (
                                        <motion.div
                                            key={video.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <Card variant="white" hover className="overflow-hidden h-full group">
                                                <div className="relative aspect-video bg-gray-900 overflow-hidden">
                                                    {isPlaying && videoId ? (
                                                        <iframe
                                                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                                                            className="w-full h-full"
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                            title={video.title}
                                                        />
                                                    ) : (
                                                        <>
                                                            {videoId && (
                                                                <img
                                                                    src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                                                                    alt={video.title}
                                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                                />
                                                            )}
                                                            <div
                                                                className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer group-hover:bg-black/50 transition-colors"
                                                                onClick={() => setPlayingVideo(video.id)}
                                                            >
                                                                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                                                                    <FaPlay className="text-white text-xl ml-1" />
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="p-5">
                                                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                                                        {video.title}
                                                    </h3>
                                                    <a
                                                        href={video.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
                                                    >
                                                        Watch on YouTube <FaExternalLinkAlt size={12} />
                                                    </a>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'instagram' && (
                    <motion.div
                        key="instagram"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="pb-16"
                    >
                        {socialLinks.instagram.length === 0 ? (
                            <div className="text-center text-gray-500 py-10">
                                No Instagram posts available yet.
                            </div>
                        ) : (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {socialLinks.instagram.map((post, index) => (
                                    <motion.div
                                        key={post.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <a
                                            href={post.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block"
                                        >
                                            <Card variant="white" hover className="overflow-hidden h-full group">
                                                <div className="relative aspect-square bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 flex items-center justify-center overflow-hidden">
                                                    {post.thumbnail ? (
                                                        <img
                                                            src={post.thumbnail}
                                                            alt={post.title}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        <div className="text-center text-white p-8">
                                                            <FaInstagram className="text-6xl mx-auto mb-4 opacity-80" />
                                                            <p className="text-lg font-medium opacity-90">{post.title}</p>
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                                        <FaExternalLinkAlt
                                                            className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="p-5">
                                                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-pink-600 font-medium text-sm mt-2 flex items-center gap-2">
                                                        <FaInstagram /> View on Instagram
                                                    </p>
                                                </div>
                                            </Card>
                                        </a>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </SectionWrapper>
    );
};

export default SocialMediaSection;
