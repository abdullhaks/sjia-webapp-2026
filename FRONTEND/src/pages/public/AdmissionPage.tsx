import { useEffect } from 'react';
import SectionWrapper from '../../components/common/SectionWrapper';
import AdmissionForm from '../../components/features/admission/AdmissionForm';
import Navbar from '../../components/layouts/Navbar';
import Footer from '../../components/layouts/Footer';
import { motion } from 'framer-motion';
import { useSettingsStore } from '../../store/settingsStore';
import { Spin } from 'antd';

const AdmissionPage = () => {
    const { fetchSettings, getSettingValue, loading } = useSettingsStore();

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const isAdmissionOpen = getSettingValue<boolean>('admission-open', false);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
            <Navbar />
            <div className="pt-20 flex-grow flex items-center justify-center">
                <SectionWrapper background="gradient" className="py-20 w-full h-full flex items-center justify-center">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {loading ? (
                                <div className="flex justify-center flex-col items-center min-h-[50vh]">
                                    <Spin size="large" />
                                    <p className="mt-4 text-white font-medium">Checking admission status...</p>
                                </div>
                            ) : isAdmissionOpen ? (
                                <AdmissionForm />
                            ) : (
                                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-xl p-12 max-w-2xl mx-auto text-center border border-white/50 dark:border-slate-800">
                                    <div className="text-6xl mb-6">🔒</div>
                                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Admissions Closed</h2>
                                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                                        We are not currently accepting new applications. Please check back later or contact the administration for more information.
                                    </p>
                                    <a href="/#contact" className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-md">
                                        Contact Us
                                    </a>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </SectionWrapper>
            </div>
            <Footer />
        </div>
    );
};

export default AdmissionPage;
