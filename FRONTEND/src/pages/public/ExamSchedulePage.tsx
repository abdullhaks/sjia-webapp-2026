import { Card, Timeline, Tag } from 'antd';
import { ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import Navbar from '../../components/layouts/Navbar';
import Footer from '../../components/layouts/Footer';
import SectionWrapper from '../../components/common/SectionWrapper';
import { motion } from 'framer-motion';

const ExamSchedulePage = () => {
    // Mock Data
    const exams = [
        {
            title: "SSLC Model Examination 2024",
            dates: "March 1st - March 10th",
            schedule: [
                { date: "2024-03-01", time: "10:00 AM", subject: "Mathematics", duration: "2.5 Hrs" },
                { date: "2024-03-03", time: "10:00 AM", subject: "Physics", duration: "2 Hrs" },
                { date: "2024-03-05", time: "10:00 AM", subject: "Chemistry", duration: "2 Hrs" },
            ]
        },
        {
            title: "First Semester Degree Exams",
            dates: "April 15th - April 22nd",
            schedule: [
                { date: "2024-04-15", time: "09:30 AM", subject: "English Literature", duration: "3 Hrs" },
                { date: "2024-04-17", time: "09:30 AM", subject: "History of Islam", duration: "3 Hrs" },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="pt-20">
                <SectionWrapper background="gradient" className="py-20">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="text-center mb-16">
                                <Tag color="blue" className="mb-4 text-sm font-medium px-3 py-1 uppercase tracking-wider">Academics</Tag>
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                                    Examination Schedules
                                </h1>
                                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                    Prepare for your upcoming assessments. Check dates, times, and subjects below.
                                </p>
                            </div>

                            <div className="space-y-8">
                                {exams.map((exam, index) => (
                                    <Card key={index} className="shadow-lg border-0 overflow-hidden relative group hover:shadow-xl transition-shadow duration-300">
                                        <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
                                        <div className="p-2 md:p-6">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-gray-100">
                                                <div>
                                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{exam.title}</h2>
                                                    <div className="flex items-center text-gray-500">
                                                        <CalendarOutlined className="mr-2" /> {exam.dates}
                                                    </div>
                                                </div>
                                            </div>

                                            <Timeline mode="left" className="ml-4">
                                                {exam.schedule.map((item, i) => (
                                                    <Timeline.Item key={i} label={item.date} color="blue">
                                                        <div className="bg-blue-50/50 p-4 rounded-lg ml-4 border border-blue-100 hover:bg-blue-50 transition-colors">
                                                            <div className="flex flex-wrap justify-between items-center gap-2">
                                                                <h4 className="font-bold text-lg text-gray-800">{item.subject}</h4>
                                                                <Tag icon={<ClockCircleOutlined />} color="default">{item.time} ({item.duration})</Tag>
                                                            </div>
                                                        </div>
                                                    </Timeline.Item>
                                                ))}
                                            </Timeline>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </SectionWrapper>
            </div>
            <Footer />
        </div>
    );
};

export default ExamSchedulePage;
