import { useState } from 'react';
import { Card, Input, Button, Table, Tag, Empty } from 'antd';
import { SearchOutlined, TrophyOutlined } from '@ant-design/icons';
import Navbar from '../../components/layouts/Navbar';
import Footer from '../../components/layouts/Footer';
import SectionWrapper from '../../components/common/SectionWrapper';
import { motion } from 'framer-motion';

const ResultViewPage = () => {
    const [searchId, setSearchId] = useState('');
    const [result, setResult] = useState<any>(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = () => {
        setSearched(true);
        if (searchId === '101') {
            setResult({
                studentName: 'John Doe',
                exam: 'SSLC Model Exam 2024',
                marks: [
                    { subject: 'Mathematics', obtained: 85, max: 100, grade: 'A' },
                    { subject: 'Physics', obtained: 40, max: 50, grade: 'B+' },
                    { subject: 'Chemistry', obtained: 45, max: 50, grade: 'A+' },
                ],
                total: 170,
                maxTotal: 200,
                percentage: 85.0
            });
        } else {
            setResult(null);
        }
    };

    const columns = [
        { title: 'Subject', dataIndex: 'subject', key: 'subject' },
        { title: 'Max Marks', dataIndex: 'max', key: 'max' },
        {
            title: 'Obtained',
            dataIndex: 'obtained',
            key: 'obtained',
            render: (val: number) => <span className="font-bold">{val}</span>
        },
        {
            title: 'Grade',
            dataIndex: 'grade',
            key: 'grade',
            render: (grade: string) => {
                let color = grade.startsWith('A') ? 'green' : grade.startsWith('B') ? 'blue' : 'orange';
                return <Tag color={color}>{grade}</Tag>;
            }
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="pt-20">
                <SectionWrapper background="white" className="py-20">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-bold text-gray-800 mb-4">Check Your Results</h1>
                            <div className="flex max-w-md mx-auto gap-2">
                                <Input
                                    placeholder="Enter Student ID (Try 101)"
                                    value={searchId}
                                    onChange={(e) => setSearchId(e.target.value)}
                                    prefix={<SearchOutlined />}
                                    size="large"
                                />
                                <Button
                                    type="primary"
                                    size="large"
                                    className="bg-primary"
                                    onClick={handleSearch}
                                >
                                    View Result
                                </Button>
                            </div>
                        </div>

                        {searched && !result && (
                            <Empty description="No result found for this ID" />
                        )}

                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Card className="shadow-lg border-2 border-primary/10">
                                    <div className="text-center mb-6 pb-6 border-b border-gray-100">
                                        <TrophyOutlined className="text-5xl text-yellow-500 mb-4" />
                                        <h2 className="text-2xl font-bold text-gray-800">{result.studentName}</h2>
                                        <p className="text-gray-500">{result.exam}</p>
                                    </div>

                                    <div className="mb-6">
                                        <Table
                                            dataSource={result.marks}
                                            columns={columns}
                                            pagination={false}
                                            summary={() => (
                                                <Table.Summary.Row className="bg-gray-50 font-bold">
                                                    <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
                                                    <Table.Summary.Cell index={1}>{result.maxTotal}</Table.Summary.Cell>
                                                    <Table.Summary.Cell index={2}>
                                                        <span className="text-primary text-lg">{result.total}</span>
                                                    </Table.Summary.Cell>
                                                    <Table.Summary.Cell index={3}>
                                                        {result.percentage}%
                                                    </Table.Summary.Cell>
                                                </Table.Summary.Row>
                                            )}
                                        />
                                    </div>
                                </Card>
                            </motion.div>
                        )}
                    </div>
                </SectionWrapper>
            </div>
            <Footer />
        </div>
    );
};

export default ResultViewPage;
