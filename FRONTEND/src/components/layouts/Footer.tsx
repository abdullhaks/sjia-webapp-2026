import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FaFacebook, FaInstagram, FaYoutube, FaWhatsapp, FaEnvelope, FaPhone,
    FaMapMarkerAlt, FaArrowUp, FaUsers, FaBook,
    FaChevronRight, FaPaperPlane, FaClock, FaHeart
} from 'react-icons/fa';
import { useCMSStore } from '../../store/cmsStore';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const { siteContent, fetchSiteContent } = useCMSStore();

    useEffect(() => {
        if (siteContent.length === 0) fetchSiteContent();
    }, [fetchSiteContent, siteContent.length]);

    useEffect(() => {
        const handleScroll = () => setShowScrollTop(window.scrollY > 500);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const getContent = (key: string, fallback: string) => {
        const c = siteContent.find((item) => item.key === key);
        return c ? c.value : fallback;
    };

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const quickLinks = [
        { name: 'About Us', href: '#about' },
        { name: 'Programs', href: '#programs' },
        { name: 'Faculty', href: '#faculty' },
        { name: 'Admissions', href: '#admissions' },
        { name: 'Campus Life', href: '#campus' },
    ];

    const services = [
        { name: 'Islamic Education', desc: 'Comprehensive academic programs' },
        { name: 'Spiritual Guidance', desc: 'Mentorship for spiritual growth' },
        { name: 'Community Outreach', desc: 'Social service initiatives' },
        { name: 'Cultural Events', desc: 'Celebrating Islamic heritage' },
    ];

    const achievements = [
        { icon: FaUsers, label: 'Students Enrolled', value: '1500+' },
        { icon: FaBook, label: 'Faculty Members', value: '50+' },
        { icon: FaClock, label: 'Years of Excellence', value: '30+' },
        { icon: FaHeart, label: 'Community Events', value: '200+' },
    ];

    // Get social URLs from CMS
    let socialYoutube = 'https://youtube.com/@vijayamargam8134?si=fz2oIv68ra9id0u5';
    let socialInstagram = 'https://www.instagram.com/jeelanistudiescentre';
    let socialFacebook = '#';
    let socialWhatsapp = '#';

    try {
        const socialJson = siteContent.find(c => c.key === 'social-links-json')?.value;
        if (socialJson) {
            const parsed = JSON.parse(socialJson);
            if (parsed.youtubeChannel) socialYoutube = parsed.youtubeChannel;
            if (parsed.instagramProfile) socialInstagram = parsed.instagramProfile;
            if (parsed.facebookPage) socialFacebook = parsed.facebookPage;
            if (parsed.whatsappNumber) socialWhatsapp = `https://wa.me/${parsed.whatsappNumber}`;
        }
    } catch { }

    const socialLinks = [
        { icon: FaInstagram, href: socialInstagram, label: 'Instagram', gradient: 'from-pink-500 to-rose-500' },
        { icon: FaYoutube, href: socialYoutube, label: 'YouTube', gradient: 'from-red-600 to-red-700' },
        { icon: FaFacebook, href: socialFacebook, label: 'Facebook', gradient: 'from-blue-500 to-blue-600' },
        { icon: FaWhatsapp, href: socialWhatsapp, label: 'WhatsApp', gradient: 'from-green-500 to-green-600' },
    ];

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newsletterEmail) {
            console.log('Newsletter subscription:', newsletterEmail);
            setIsSubscribed(true);
            setNewsletterEmail('');
            setTimeout(() => setIsSubscribed(false), 3000);
        }
    };

    return (
        <footer className="relative bg-gradient-to-br from-slate-900 to-emerald-900 text-white overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 overflow-hidden">
                <div className="absolute top-10 left-10 w-32 h-32 border-2 border-emerald-400 rotate-45 animate-pulse" />
                <div className="absolute top-40 right-20 w-24 h-24 border-2 border-teal-400 rotate-12 animate-pulse" />
                <div className="absolute bottom-20 left-1/4 w-28 h-28 border-2 border-emerald-300 -rotate-12 animate-pulse" />
                <div className="absolute bottom-40 right-1/3 w-20 h-20 border-2 border-teal-300 rotate-45 animate-pulse" />
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-emerald-400 rounded-full opacity-20"
                        animate={{
                            y: [-20, -80, -20],
                            x: [Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50],
                            opacity: [0.2, 0.5, 0.2]
                        }}
                        transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: Math.random() * 2
                        }}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`
                        }}
                    />
                ))}
            </div>

            <div className="container mx-auto px-6 py-16 relative z-10">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-2xl" style={{ fontFamily: 'Amiri, serif' }}>ج</span>
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                                Sheikh Jeelani Islamic Academy
                            </h3>
                            <p className="text-emerald-200 text-lg">Excellence in Islamic Education</p>
                        </div>
                    </div>
                    <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
                        Committed to fostering academic excellence and spiritual growth through Islamic education and community engagement.
                    </p>
                </div>

                {/* Achievements Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    {achievements.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-colors"
                        >
                            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                                <item.icon className="text-white" size={20} />
                            </div>
                            <div className="text-2xl font-bold text-emerald-400 mb-2">{item.value}</div>
                            <div className="text-gray-300 text-sm">{item.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Main Footer Content */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Quick Links */}
                    <div>
                        <h4 className="text-2xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                            Quick Links
                        </h4>
                        <ul className="space-y-4">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="flex items-center gap-2 text-gray-300 hover:text-emerald-400 transition-colors group"
                                    >
                                        <FaChevronRight className="text-xs transition-transform group-hover:translate-x-1" />
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-2xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                            Our Services
                        </h4>
                        <ul className="space-y-4">
                            {services.map((service) => (
                                <li key={service.name} className="text-gray-300">
                                    <div className="font-semibold hover:text-emerald-400 transition-colors">{service.name}</div>
                                    <div className="text-sm text-gray-400">{service.desc}</div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h4 className="text-2xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                            Contact Us
                        </h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-gray-300">
                                <FaEnvelope className="text-emerald-400" />
                                <span>{getContent('contact-email', 'info@sjia.edu')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                                <FaPhone className="text-emerald-400" />
                                <span>{getContent('contact-phone', '+91 1234567890')}</span>
                            </div>
                            <div className="flex items-start gap-2 text-gray-300">
                                <FaMapMarkerAlt className="text-emerald-400 mt-1 flex-shrink-0" />
                                <span>{getContent('contact-address', 'Mankery, Irimbiliyam, Malappuram, Kerala')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-2xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                            Newsletter
                        </h4>
                        <div className="space-y-4">
                            <p className="text-gray-300 text-sm">Stay updated with our latest news and events</p>
                            <form onSubmit={handleNewsletterSubmit} className="relative">
                                <input
                                    type="email"
                                    value={newsletterEmail}
                                    onChange={(e) => setNewsletterEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full py-3 px-4 bg-white/10 border border-white/20 rounded-xl text-gray-300 placeholder-gray-400 focus:outline-none focus:border-emerald-400 transition-colors"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-lg hover:scale-110 transition-transform"
                                >
                                    <FaPaperPlane className="text-white" size={14} />
                                </button>
                            </form>
                            {isSubscribed && (
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-emerald-400 text-sm"
                                >
                                    Thank you for subscribing!
                                </motion.p>
                            )}
                        </div>

                        {/* Social Links */}
                        <div className="mt-6">
                            <h5 className="text-lg font-semibold mb-4 text-gray-200">Follow Us</h5>
                            <div className="flex gap-3">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                        className={`w-10 h-10 bg-gradient-to-br ${social.gradient} rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform`}
                                    >
                                        <social.icon color='white' size={18} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="border-t border-white/10 pt-6 text-center">
                    <p className="text-sm text-gray-300">
                        © {currentYear} Sheikh Jeelani Islamic Academy. All rights reserved.
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                        Mankery, Irimbiliyam, Valanchery, Malappuram, Kerala, India
                    </p>
                </div>
            </div>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    aria-label="Scroll to top"
                >
                    <FaArrowUp size={18} />
                </motion.button>
            )}
        </footer>
    );
};

export default Footer;
