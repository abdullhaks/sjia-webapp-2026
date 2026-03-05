import { useState } from 'react';
import { Card, Input, Button, Table, Tag, Empty, message } from 'antd';
import { SearchOutlined, TrophyOutlined } from '@ant-design/icons';
import Navbar from '../../components/layouts/Navbar';
import Footer from '../../components/layouts/Footer';
import SectionWrapper from '../../components/common/SectionWrapper';
import { motion } from 'framer-motion';
import { useResultStore } from '../../store/resultStore';
import { Result } from '../../services/api/result.api';

const ResultViewPage = () => {
    const [searchId, setSearchId] = useState('');
    const [result, setResult] = useState<Result | null>(null);
    const [searched, setSearched] = useState(false);

    const { searchPublicResults, loading } = useResultStore();

    const handleSearch = async () => {
        if (!searchId.trim()) {
            message.warning('Please enter a valid credential');
            return;
        }

        setSearched(true);
        try {
            const results = await searchPublicResults(searchId);
            const completedResults = (results || []).filter((r: any) => r.examId?.status === 'Completed');

            if (completedResults && completedResults.length > 0) {
                // Return the most recent or highest precedence result, for now just taking the first one
                setResult(completedResults[0]);
            } else {
                setResult(null);
            }
        } catch (error) {
            setResult(null);
        }
    };

    const columns = [
        { title: 'Subject', dataIndex: 'subjectName', key: 'subjectName' },
        { title: 'Max Marks', dataIndex: 'maxMarks', key: 'maxMarks' },
        {
            title: 'Obtained',
            dataIndex: 'obtainedMarks',
            key: 'obtainedMarks',
            render: (val: number) => <span className="font-bold">{val}</span>
        },
        {
            title: 'Grade',
            dataIndex: 'grade',
            key: 'grade',
            render: (grade?: string) => {
                if (!grade) return <Tag color="default">N/A</Tag>;
                let color = grade.startsWith('A') ? 'green' : grade.startsWith('B') ? 'blue' : 'orange';
                return <Tag color={color}>{grade}</Tag>;
            }
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
            <Navbar />
            <div className="pt-20">
                <SectionWrapper background="white" className="py-20">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Check Your Results</h1>
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

                        {searched && !result && !loading && (
                            <Empty description="No result found for this credential" />
                        )}

                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Card className="shadow-lg border-2 border-primary/10 dark:border-slate-800 dark:bg-slate-900">
                                    <div className="text-center mb-6 pb-6 border-b border-gray-100 dark:border-slate-800">
                                        <TrophyOutlined className="text-5xl text-yellow-500 mb-4" />
                                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                            {result.studentId?.firstName} {result.studentId?.lastName}
                                        </h2>
                                        <p className="text-gray-500 dark:text-gray-400">{result.examId?.title}</p>
                                    </div>

                                    <div className="mb-6 overflow-x-auto">
                                        <Table
                                            dataSource={result.marks}
                                            columns={columns}
                                            rowKey="subjectName"
                                            pagination={false}
                                            summary={() => (
                                                <Table.Summary.Row className="bg-gray-50 dark:bg-slate-800/50 font-bold">
                                                    <Table.Summary.Cell index={0} className="dark:text-gray-300">Total</Table.Summary.Cell>
                                                    <Table.Summary.Cell index={1} className="dark:text-gray-300">{result.totalMaxMarks}</Table.Summary.Cell>
                                                    <Table.Summary.Cell index={2}>
                                                        <span className="text-primary dark:text-emerald-400 text-lg">{result.totalObtainedMarks}</span>
                                                    </Table.Summary.Cell>
                                                    <Table.Summary.Cell index={3} className="dark:text-gray-300">
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
