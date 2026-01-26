
import SectionWrapper from '../../components/common/SectionWrapper';
import AdmissionForm from '../../components/features/admission/AdmissionForm';
import Navbar from '../../components/layouts/Navbar';
import Footer from '../../components/layouts/Footer';
import { motion } from 'framer-motion';

const AdmissionPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="pt-20">
                <SectionWrapper background="gradient" className="py-20">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <AdmissionForm />
                        </motion.div>
                    </div>
                </SectionWrapper>
            </div>
            <Footer />
        </div>
    );
};

export default AdmissionPage;
