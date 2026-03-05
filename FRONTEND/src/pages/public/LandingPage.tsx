import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../../components/layouts/Navbar';
import Footer from '../../components/layouts/Footer';
import HeroSection from '../../components/features/public/HeroSection';
import AboutSection from '../../components/features/public/AboutSection';
import ProgramsSection from '../../components/features/public/ProgramsSection';
import VideoSection from '../../components/features/public/VideoSection';
import AcademicExcellenceSection from '../../components/features/public/AcademicExcellenceSection';
import CampusSection from '../../components/features/public/CampusSection';
import FacultySection from '../../components/features/public/FacultySection';
import StudentCouncilSection from '../../components/features/public/StudentCouncilSection';
import TestimonialsSection from '../../components/features/public/TestimonialsSection';
import AdmissionsSection from '../../components/features/public/AdmissionsSection';
import SocialMediaSection from '../../components/features/public/SocialMediaSection';
import { useCMSStore } from '../../store/cmsStore';

const LandingPage: React.FC = () => {
    const { siteContent, fetchSiteContent } = useCMSStore();

    useEffect(() => {
        fetchSiteContent();
    }, [fetchSiteContent]);

    const getContent = (key: string, fallback: string) => {
        const item = siteContent.find(c => c.key === key);
        return item ? item.value : fallback;
    };

    const pageTitle = getContent('hero-title', 'Sheikh Jeelani Islamic Academy');
    const pageDescription = getContent('hero-tagline', 'Excellence in Islamic Education');

    return (
        <>
            <Helmet>
                <title>{pageTitle} - SJIA</title>
                <meta name="description" content={pageDescription} />
                <meta name="keywords" content="Islamic academy, Islamic education, Kerala, Malappuram, SSLC, Plus Two, Degree, PG, Islamic studies, Arabic" />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-slate-950 dark:to-emerald-950 transition-colors duration-300">
                <Navbar />

                <main>
                    <HeroSection />
                    <AboutSection />
                    <VideoSection />
                    <ProgramsSection />
                    <AcademicExcellenceSection />
                    <CampusSection />
                    <FacultySection />
                    <StudentCouncilSection />
                    <TestimonialsSection />
                    <SocialMediaSection />
                    <AdmissionsSection />
                </main>

                <Footer />
            </div>
        </>
    );
};

export default LandingPage;
