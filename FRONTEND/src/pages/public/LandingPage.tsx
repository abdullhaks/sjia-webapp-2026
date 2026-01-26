import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../../components/layouts/Navbar';
import Footer from '../../components/layouts/Footer';
import HeroSection from '../../components/features/public/HeroSection';
import AboutSection from '../../components/features/public/AboutSection';
import ProgramsSection from '../../components/features/public/ProgramsSection';
import AcademicExcellenceSection from '../../components/features/public/AcademicExcellenceSection';
import CampusSection from '../../components/features/public/CampusSection';
import StudentCouncilSection from '../../components/features/public/StudentCouncilSection';
import TestimonialsSection from '../../components/features/public/TestimonialsSection';
import ContactSection from '../../components/features/public/ContactSection';
import { useCMSStore } from '../../store/cmsStore';

const LandingPage: React.FC = () => {
    const { siteContent, fetchSiteContent } = useCMSStore();

    useEffect(() => {
        fetchSiteContent();
    }, [fetchSiteContent]);

    // Helper to get content by key
    const getContent = (key: string, fallback: string) => {
        const item = siteContent.find(c => c.key === key);
        return item ? item.value : fallback;
    };

    const pageTitle = getContent('hero-title', 'Sheikh Jeelani Islamic Academy');
    const pageDescription = getContent('hero-tagline', 'Excellence in Islamic Education Since 2002');

    return (
        <>
            <Helmet>
                <title>{pageTitle} - SJIA</title>
                <meta name="description" content={pageDescription} />
                <meta
                    name="keywords"
                    content="Islamic academy, Islamic education, Kerala, Malappuram, SSLC, Plus Two, Degree, PG, Islamic studies, Arabic"
                />

                {/* Open Graph */}
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://sjia.edu" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />
            </Helmet>

            <div className="min-h-screen bg-white">
                <Navbar />

                <main>
                    <HeroSection />
                    <AboutSection />
                    <ProgramsSection />
                    <AcademicExcellenceSection />
                    <CampusSection />
                    <StudentCouncilSection />
                    <TestimonialsSection />
                    <ContactSection />
                </main>

                <Footer />
            </div>
        </>
    );
};

export default LandingPage;
