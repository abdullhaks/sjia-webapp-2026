import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp, FaExpand, FaCompress } from 'react-icons/fa';
import SectionWrapper from '../../common/SectionWrapper';
import AnimatedHeading from '../../common/AnimatedHeading';
import promo from '/promo.mp4'

const VideoSection: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

    // Demo video URL — replace with actual college promotion video
    const videoUrl = promo;

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime);
            setProgress((video.currentTime / video.duration) * 100);
        };
        const handleLoadedMeta = () => setDuration(video.duration);
        const handleEnded = () => setIsPlaying(false);

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('loadedmetadata', handleLoadedMeta);
        video.addEventListener('ended', handleEnded);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('loadedmetadata', handleLoadedMeta);
            video.removeEventListener('ended', handleEnded);
        };
    }, []);

    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };

    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = !video.muted;
        setIsMuted(video.muted);
    };

    const toggleFullscreen = () => {
        const container = containerRef.current;
        if (!container) return;
        if (!document.fullscreenElement) {
            container.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const video = videoRef.current;
        if (!video) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const pct = clickX / rect.width;
        video.currentTime = pct * video.duration;
    };

    const formatTime = (t: number) => {
        const mins = Math.floor(t / 60);
        const secs = Math.floor(t % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
        controlsTimeout.current = setTimeout(() => {
            if (isPlaying) setShowControls(false);
        }, 3000);
    };

    return (
        <SectionWrapper id="video" background="white">
            <div className="text-center mb-12 pt-16">
                <AnimatedHeading level={2} gradient center className="mb-4">
                    Discover Our Academy
                </AnimatedHeading>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-lg text-gray-600 max-w-3xl mx-auto"
                >
                    Take a virtual tour and learn everything about Sheikh Jeelani Islamic Academy —
                    our campus, programs, values, and the vibrant community that makes us exceptional.
                </motion.p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="max-w-5xl mx-auto pb-16"
            >
                <div
                    ref={containerRef}
                    className="relative group rounded-2xl overflow-hidden shadow-2xl video-player-container"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => isPlaying && setShowControls(false)}
                >
                    {/* Decorative border glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 rounded-2xl opacity-60 blur-sm group-hover:opacity-80 transition-opacity duration-500 -z-10" />

                    {/* Video Element */}
                    <div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-video">
                        <video
                            ref={videoRef}
                            src={videoUrl}
                            muted={isMuted}
                            playsInline
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={togglePlay}
                            poster=""
                        />

                        {/* Center Play Button (when paused) */}
                        {!isPlaying && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/30"
                                onClick={togglePlay}
                            >
                                <div className="w-24 h-24 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110 shadow-2xl">
                                    <FaPlay className="text-white text-3xl ml-2" />
                                </div>
                            </motion.div>
                        )}

                        {/* Bottom Controls Bar */}
                        <div
                            className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                }`}
                        >
                            {/* Progress Bar */}
                            <div
                                className="h-1.5 bg-white/20 cursor-pointer group/progress mx-4 rounded-full overflow-hidden"
                                onClick={handleProgressClick}
                            >
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full relative transition-all duration-100"
                                    style={{ width: `${progress}%` }}
                                >
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={togglePlay}
                                        className="text-white hover:text-emerald-400 transition-colors text-lg"
                                        title={isPlaying ? 'Pause' : 'Play'}
                                    >
                                        {isPlaying ? <FaPause /> : <FaPlay />}
                                    </button>
                                    <button
                                        onClick={toggleMute}
                                        className="text-white hover:text-emerald-400 transition-colors text-lg"
                                        title={isMuted ? 'Unmute' : 'Mute'}
                                    >
                                        {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                                    </button>
                                    <span className="text-white/80 text-sm font-mono">
                                        {formatTime(currentTime)} / {formatTime(duration)}
                                    </span>
                                </div>
                                <button
                                    onClick={toggleFullscreen}
                                    className="text-white hover:text-emerald-400 transition-colors text-lg"
                                    title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                                >
                                    {isFullscreen ? <FaCompress /> : <FaExpand />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Caption */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="text-center text-gray-500 mt-4 text-sm italic"
                >
                    🎬 Watch our college promotion video to learn more about SJIA
                </motion.p>
            </motion.div>
        </SectionWrapper>
    );
};

export default VideoSection;
