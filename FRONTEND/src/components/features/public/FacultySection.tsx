import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserTie, FaChalkboardTeacher, FaUsers } from 'react-icons/fa';
import SectionWrapper from '../../common/SectionWrapper';
import AnimatedHeading from '../../common/AnimatedHeading';
import Card from '../../common/Card';
import { useCMSStore } from '../../../store/cmsStore';
import LoadingSpinner from '../../common/LoadingSpinner';

interface StaffMember {
    id: string;
    name: string;
    position: string;
    category: string; // 'authority' | 'hod' | 'teacher'
    qualification?: string;
    experience?: string;
    specialization?: string;
    photoUrl?: string;
    order: number;
}

interface StaffData {
    authorities: StaffMember[];
    hods: StaffMember[];
    teachers: StaffMember[];
}

const positionTabs = [
    { key: 'authorities', label: 'Supreme Authorities', icon: FaUserTie, desc: 'Distinguished leaders guiding our institution' },
    { key: 'hods', label: 'Heads of Department', icon: FaChalkboardTeacher, desc: 'Academic leaders managing their departments' },
    { key: 'teachers', label: 'Faculty Members', icon: FaUsers, desc: 'Dedicated educators nurturing student growth' },
];

const FacultySection: React.FC = () => {
    const { siteContent, fetchSiteContent } = useCMSStore();
    const [staffData, setStaffData] = useState<StaffData>({ authorities: [], hods: [], teachers: [] });
    const [activeCategory, setActiveCategory] = useState<string>('authorities');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (siteContent.length === 0) fetchSiteContent();
    }, [fetchSiteContent, siteContent.length]);

    useEffect(() => {
        const content = siteContent.find((c) => c.key === 'faculty-staff-json');
        if (content && content.value) {
            try {
                const parsed: StaffData = JSON.parse(content.value);
                setStaffData(parsed);
            } catch (e) {
                console.error('Failed to parse faculty-staff-json', e);
                setStaffData(defaultStaffData);
            }
        } else {
            setStaffData(defaultStaffData);
        }
        setLoading(false);
    }, [siteContent]);

    const defaultStaffData: StaffData = {
        authorities: [
            {
                id: '1', name: 'Sheikh Usthad Abdhu Raheem Musliyar Valapuram', position: 'Principal',
                qualification: '', experience: '30+ years',
                specialization: '', category: 'authority', order: 1
            },
            {
                id: '2', name: 'Abdullah Musliyar karaaparambu', position: 'Vice Principal',
                qualification: '', experience: '30+ years',
                specialization: '', category: 'authority', order: 2
            },
            {
                id: '3', name: 'Sheikh Hamza Usthad Moonakkal', position: '',
                qualification: '', experience: '30+ years',
                specialization: '', category: 'authority', order: 3
            },
        ],
        hods: [
            {
                id: '4', name: 'Sheikh Fazlullah faizy valiyora', position: '',
                qualification: 'faizy', experience: '10+ years',
                specialization: '', category: '', order: 1
            },
            {
                id: '5', name: 'Sheikh Abdul Majeed Hudavi', position: '',
                qualification: 'Hudavi', experience: '10+ years',
                specialization: '', category: '', order: 2
            },
            {
                id: '6', name: 'Sheikh Sulaiman Hudavi', position: '',
                qualification: 'Hudavi', experience: '10+ years',
                specialization: '', category: '', order: 3
            },
        ],
        teachers: [
            {
                id: '7', name: 'Musthafa Hudavi', position: '',
                qualification: 'Hudavi', experience: '10+ years',
                specialization: '', category: '', order: 1
            },
            {
                id: '8', name: 'Rafeeq Hudavi', position: '',
                qualification: 'Hudavi', experience: '10+ years',
                specialization: '', category: '', order: 2
            },
            {
                id: '9', name: 'Riyas Master', position: '',
                qualification: 'msw', experience: '5+ years',
                specialization: '', category: '', order: 3
            },
        ],
    };

    const currentTab = positionTabs.find(t => t.key === activeCategory)!;
    const currentMembers = staffData[activeCategory as keyof StaffData] || [];

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    };

    return (
        <SectionWrapper id="faculty" background="pattern">
            <div className="text-center mb-16 pt-16">
                <AnimatedHeading level={2} gradient center className="mb-4">
                    Our Leadership & Faculty
                </AnimatedHeading>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-lg text-gray-600 max-w-3xl mx-auto"
                >
                    Distinguished scholars and administrators guiding our institution towards excellence
                    in Islamic education and modern academics.
                </motion.p>
            </div>

            {/* Category Tabs */}
            <div className="flex justify-center mb-12">
                <div className="inline-flex bg-white/80 backdrop-blur-md rounded-2xl p-2 shadow-lg flex-wrap justify-center gap-2">
                    {positionTabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveCategory(tab.key)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeCategory === tab.key
                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                                        : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                                    }`}
                            >
                                <Icon size={18} />
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Category Description */}
            <motion.p
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-500 mb-10 text-lg"
            >
                {currentTab.desc}
            </motion.p>

            {/* Members Grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="pb-16"
                >
                    {loading ? (
                        <LoadingSpinner />
                    ) : currentMembers.length === 0 ? (
                        <div className="text-center text-gray-500 py-10">
                            No members listed in this category yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {currentMembers
                                .sort((a, b) => a.order - b.order)
                                .map((member, index) => (
                                    <motion.div
                                        key={member.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        whileHover={{ y: -8 }}
                                    >
                                        <Card variant="white" hover className="overflow-hidden h-full group">
                                            <div className="p-6">
                                                {/* Avatar */}
                                                <div className="flex justify-center mb-5">
                                                    {member.photoUrl ? (
                                                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-100 shadow-lg group-hover:border-emerald-300 transition-colors">
                                                            <img
                                                                src={member.photoUrl}
                                                                alt={member.name}
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                            {getInitials(member.name)}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Info */}
                                                <h3 className="text-xl font-bold text-gray-800 text-center mb-1">
                                                    {member.name}
                                                </h3>
                                                <p className="text-emerald-600 font-semibold text-center mb-4">
                                                    {member.position}
                                                </p>

                                                {/* Details */}
                                                <div className="space-y-2 text-sm text-gray-600">
                                                    {member.qualification && (
                                                        <p>
                                                            <strong className="text-gray-700">Education:</strong>{' '}
                                                            {member.qualification}
                                                        </p>
                                                    )}
                                                    {member.experience && (
                                                        <p>
                                                            <strong className="text-gray-700">Experience:</strong>{' '}
                                                            {member.experience}
                                                        </p>
                                                    )}
                                                    {member.specialization && (
                                                        <p>
                                                            <strong className="text-gray-700">Specialization:</strong>{' '}
                                                            {member.specialization}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </SectionWrapper>
    );
};

export default FacultySection;
