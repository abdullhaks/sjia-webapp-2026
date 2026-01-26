import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import SectionWrapper from '../../common/SectionWrapper';
import AnimatedHeading from '../../common/AnimatedHeading';
import Card from '../../common/Card';
import { useCMSStore } from '../../../store/cmsStore';

interface Testimonial {
    id: number;
    name: string;
    batch: string;
    currentPosition: string;
    testimonial: string;
    rating: number;
    avatar: string;
}

const TestimonialsSection: React.FC = () => {
    const { siteContent, fetchSiteContent } = useCMSStore();
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

    useEffect(() => {
        if (siteContent.length === 0) fetchSiteContent();
    }, [fetchSiteContent, siteContent.length]);

    useEffect(() => {
        const content = siteContent.find((c) => c.key === 'testimonials-json');
        if (content && content.value) {
            try {
                const parsedTestimonials = JSON.parse(content.value);
                setTestimonials(parsedTestimonials);
            } catch (e) {
                console.error("Failed to parse testimonials-json", e);
                setTestimonials(defaultTestimonials);
            }
        } else {
            setTestimonials(defaultTestimonials);
        }
    }, [siteContent]);

    const defaultTestimonials: Testimonial[] = [
        {
            id: 1,
            name: 'Mohammed Rashid',
            batch: 'Batch 2018',
            currentPosition: 'Software Engineer at Tech Corp',
            testimonial: 'SJIA provided me with not just academic excellence but also strong moral values. The combination of Islamic education and modern curriculum prepared me perfectly for both professional success and spiritual growth.',
            rating: 5,
            avatar: '👨‍🎓',
        },
        {
            id: 2,
            name: 'Fatima Zahra',
            batch: 'Batch 2019',
            currentPosition: 'Medical Student at Kerala University',
            testimonial: 'The supportive environment and dedicated faculty at SJIA helped me achieve my dreams. The Islamic values I learned here guide me in every aspect of my life.',
            rating: 5,
            avatar: '👩‍🎓',
        },
        {
            id: 3,
            name: 'Abdul Rahman',
            batch: 'Batch 2017',
            currentPosition: 'Business Owner',
            testimonial: 'SJIA taught me the importance of integrity and hard work. The education I received here laid a strong foundation for my entrepreneurial journey.',
            rating: 5,
            avatar: '👨‍💼',
        },
        {
            id: 4,
            name: 'Aisha Begum',
            batch: 'Batch 2020',
            currentPosition: 'Teacher at International School',
            testimonial: 'The quality of education and the caring teachers at SJIA made my learning journey memorable. I am proud to be an alumna of this prestigious institution.',
            rating: 5,
            avatar: '👩‍🏫',
        },
        {
            id: 5,
            name: 'Yusuf Ali',
            batch: 'Batch 2016',
            currentPosition: 'Civil Engineer',
            testimonial: 'SJIA is more than just a school - it\'s a family. The values and knowledge I gained here continue to benefit me in my professional and personal life.',
            rating: 5,
            avatar: '👨‍🔬',
        },
    ];

    const getContent = (key: string, fallback: string) => {
        const content = siteContent.find((c) => c.key === key);
        return content ? content.value : fallback;
    };

    return (
        <SectionWrapper id="testimonials" background="gradient">
            <div className="text-center mb-16">
                <AnimatedHeading level={2} gradient center className="mb-4 py-4 pt-16">
                    What Our Alumni Say
                </AnimatedHeading>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-lg text-gray-600 max-w-3xl mx-auto"
                >
                    Hear from our successful alumni about their experiences at SJIA
                    and how it shaped their futures.
                </motion.p>
            </div>

            <div className="max-w-5xl mx-auto">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    breakpoints={{
                        768: {
                            slidesPerView: 2,
                        },
                        1024: {
                            slidesPerView: 3,
                        },
                    }}
                    className="pb-16"
                >
                    {testimonials.map((testimonial) => (
                        <SwiperSlide key={testimonial.id}>
                            <Card variant="white" className="p-6 h-full">
                                {/* Quote Icon */}
                                <div className="text-primary-300 mb-4">
                                    <FaQuoteLeft size={32} />
                                </div>

                                {/* Rating */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, index) => (
                                        <FaStar key={index} className="text-accent" size={18} />
                                    ))}
                                </div>

                                {/* Testimonial Text */}
                                <p className="text-gray-600 mb-6 leading-relaxed line-clamp-6">
                                    "{testimonial.testimonial}"
                                </p>

                                {/* Author Info */}
                                <div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-100">
                                    <div className="w-14 h-14 bg-gradient-primary rounded-full flex items-center justify-center text-3xl flex-shrink-0">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">
                                            {testimonial.name}
                                        </h4>
                                        <p className="text-sm text-primary-600 font-medium">
                                            {testimonial.batch}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {testimonial.currentPosition}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Success Stats */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 pb-16"
            >
                {[
                    { number: getContent('stat-alumni-count', '2500') + '+', label: 'Successful Alumni' },
                    { number: getContent('stat-placement-rate', '95') + '%', label: 'Placement Rate' },
                    { number: getContent('stat-companies', '100') + '+', label: 'Top Companies' },
                    { number: getContent('stat-countries', '50') + '+', label: 'Countries Worldwide' },
                ].map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card variant="white" hover className="p-6 text-center">
                            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                                {stat.number}
                            </div>
                            <div className="text-gray-600 text-sm md:text-base">
                                {stat.label}
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
        </SectionWrapper>
    );
};

export default TestimonialsSection;
