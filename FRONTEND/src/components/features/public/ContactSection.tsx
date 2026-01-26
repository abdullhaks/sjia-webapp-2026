import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import { message } from '../../common/AntdStaticProvider';
import SectionWrapper from '../../common/SectionWrapper';
import AnimatedHeading from '../../common/AnimatedHeading';
import Card from '../../common/Card';
import Button from '../../common/Button';

const contactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    subject: z.string().min(5, 'Subject must be at least 5 characters'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactSection: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true);
        try {
            // TODO: Implement actual API call
            console.log('Contact form data:', data);
            await new Promise((resolve) => setTimeout(resolve, 1500));
            message.success('Message sent successfully! We will get back to you soon.');
            reset();
        } catch (error) {
            message.error('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        {
            icon: FaMapMarkerAlt,
            title: 'Address',
            content: 'Mankery, Irimbiliyam, Malappuram, Kerala',
            color: 'text-primary',
        },
        {
            icon: FaPhone,
            title: 'Phone',
            content: '+91 1234567890',
            color: 'text-accent',
        },
        {
            icon: FaEnvelope,
            title: 'Email',
            content: 'info@sjia.edu',
            color: 'text-success',
        },
    ];

    return (
        <SectionWrapper id="contact" background="gradient">
            <div className="text-center mb-16">
                <AnimatedHeading level={2} gradient center className="mb-4 pt-16">
                    Get In Touch
                </AnimatedHeading>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-lg text-gray-600 max-w-3xl mx-auto"
                >
                    Have questions about admissions or our programs? We're here to help!
                </motion.p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-12">
                {contactInfo.map((info, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card variant="white" hover className="p-6 text-center h-full">
                            <div className={`w-16 h-16 ${info.color} bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4`}>
                                <info.icon className={`text-3xl ${info.color}`} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {info.title}
                            </h3>
                            <p className="text-gray-600">{info.content}</p>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-12 pb-16">
                {/* Contact Form */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <Card variant="white" className="p-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">
                            Send Us a Message
                        </h3>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name *
                                </label>
                                <input
                                    {...register('name')}
                                    type="text"
                                    className="input-field"
                                    placeholder="Your full name"
                                />
                                {errors.name && (
                                    <p className="text-error text-sm mt-1">{errors.name.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    {...register('email')}
                                    type="email"
                                    className="input-field"
                                    placeholder="your.email@example.com"
                                />
                                {errors.email && (
                                    <p className="text-error text-sm mt-1">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone *
                                </label>
                                <input
                                    {...register('phone')}
                                    type="tel"
                                    className="input-field"
                                    placeholder="+91 1234567890"
                                />
                                {errors.phone && (
                                    <p className="text-error text-sm mt-1">{errors.phone.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject *
                                </label>
                                <input
                                    {...register('subject')}
                                    type="text"
                                    className="input-field"
                                    placeholder="How can we help you?"
                                />
                                {errors.subject && (
                                    <p className="text-error text-sm mt-1">{errors.subject.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Message *
                                </label>
                                <textarea
                                    {...register('message')}
                                    rows={5}
                                    className="input-field resize-none"
                                    placeholder="Tell us more about your inquiry..."
                                />
                                {errors.message && (
                                    <p className="text-error text-sm mt-1">{errors.message.message}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full"
                                isLoading={isSubmitting}
                                icon={<FaPaperPlane />}
                            >
                                Send Message
                            </Button>
                        </form>
                    </Card>
                </motion.div>

                {/* Map */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <Card variant="white" className="h-full overflow-hidden">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3913.4!2d76.0!3d11.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDAwJzAwLjAiTiA3NsKwMDAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
                            width="100%"
                            height="100%"
                            style={{ border: 0, minHeight: '500px' }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="SJIA Location"
                        ></iframe>
                    </Card>
                </motion.div>
            </div>
        </SectionWrapper>
    );
};

export default ContactSection;
