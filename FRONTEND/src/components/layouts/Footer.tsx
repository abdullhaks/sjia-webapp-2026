import React from 'react';
import { FaFacebook, FaInstagram, FaYoutube, FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: 'About Us', href: '#about' },
        { name: 'Programs', href: '#programs' },
        { name: 'Admissions', href: '#contact' },
        { name: 'Campus Life', href: '#campus' },
    ];

    const socialLinks = [
        { icon: FaFacebook, href: '#', label: 'Facebook' },
        { icon: FaInstagram, href: '#', label: 'Instagram' },
        { icon: FaYoutube, href: '#', label: 'YouTube' },
        { icon: FaWhatsapp, href: '#', label: 'WhatsApp' },
    ];

    return (
        <footer className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white pattern-islamic">
            <div className="container-custom py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* About */}
                    <div>
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                                <span className="text-accent font-bold text-xl font-arabic">ج</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-500">SJIA</h3>
                                <p className="text-sm text-gray-500">Since 2002</p>
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Sheikh Jeelani Islamic Academy - Empowering students with Islamic values and modern education for a brighter future.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-gray-500 hover:text-accent transition-colors duration-200 text-sm"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3 text-sm">
                                <FaMapMarkerAlt className="text-accent mt-1 flex-shrink-0" />
                                <span className="text-gray-500">
                                    Mankery, Irimbiliyam<br />
                                    Malappuram, Kerala
                                </span>
                            </li>
                            <li className="flex items-center space-x-3 text-sm">
                                <FaPhone className="text-accent flex-shrink-0" />
                                <span className="text-gray-500">+91 1234567890</span>
                            </li>
                            <li className="flex items-center space-x-3 text-sm">
                                <FaEnvelope className="text-accent flex-shrink-0" />
                                <span className="text-gray-500">info@sjia.edu</span>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent hover:scale-110 transition-all duration-500"
                                >
                                    <social.icon size={20} />
                                </a>
                            ))}
                        </div>
                        <p className="text-gray-500 text-sm mt-4">
                            Stay connected with us on social media for updates and announcements.
                        </p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-gray-500 text-sm">
                            © {currentYear} Sheikh Jeelani Islamic Academy. All rights reserved.
                        </p>
                        <div className="flex space-x-6 text-sm">
                            <a href="#" className="text-gray-500 hover:text-accent transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-gray-500 hover:text-accent transition-colors">
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
