import React, { useState, useEffect } from 'react';
import { Card, Form, Select, Input, Button, Table, Tag, Tabs } from 'antd';
import { message } from '../../components/common/AntdStaticProvider';
import { SaveOutlined } from '@ant-design/icons';
import { useExamStore } from '../../store/examStore';
import { useStudentStore } from '../../store/studentStore';
import { useResultStore } from '../../store/resultStore';


const { Option } = Select;
const { TabPane } = Tabs;

const ResultEntryPage: React.FC = () => {
    const { exams, fetchAllExams } = useExamStore();
    const { students, fetchStudents } = useStudentStore();
    const { createResult, loading, results, fetchAllResults } = useResultStore();

    const [activeTab, setActiveTab] = useState('entry');

    const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [marks, setMarks] = useState<{ [key: string]: number }>({});

    // Derived state
    const selectedExam = exams.find(e => e._id === selectedExamId);
    // Filter students based on exam's participating classes if possible. 
    // Assuming exam has a 'classes' array as per create form, but need to verify if it's in the interface.
    // If not in interface, we might display all students or need adjustments.
    // For now, filtering if 'classes' exists, otherwise showing all.
    const eligibleStudents = selectedExam && Array.isArray((selectedExam as any).classes)
        ? (Array.isArray(students) ? students : []).filter(s => (selectedExam as any).classes.includes(s.currentClass))
        : (Array.isArray(students) ? students : []);

    const subjects = selectedExam && Array.isArray((selectedExam as any).schedule)
        ? (selectedExam as any).schedule.map((s: any) => ({
            name: s.subjectName,
            maxMarks: s.maxMarks || 100 // Default to 100 if not specified
        }))
        : [];

    useEffect(() => {
        fetchAllExams('admin');
        fetchStudents();
        fetchAllResults();
    }, [fetchAllExams, fetchStudents, fetchAllResults]);


    const handleMarkChange = (subjectName: string, value: string) => {
        setMarks(prev => ({ ...prev, [subjectName]: parseFloat(value) || 0 }));
    };

    const calculateTotal = () => {
        let obtained = 0;
        let max = 0;
        subjects.forEach((sub: any) => {
            obtained += marks[sub.name] || 0;
            max += sub.maxMarks;
        });
        return {
            obtained,
            max,
            percentage: max > 0 ? ((obtained / max) * 100).toFixed(2) : '0.00'
        };
    };

    const handleSave = async () => {
        if (!selectedExamId || !selectedStudentId) {
            message.error('Please select exam and student');
            return;
        }

        const { obtained, max, percentage } = calculateTotal();
        const resultPayload = {
            examId: selectedExamId,
            studentId: selectedStudentId,
            marks: Object.entries(marks).map(([subject, score]) => ({
                subjectName: subject,
                obtainedMarks: score,
                maxMarks: subjects.find((s: any) => s.name === subject)?.maxMarks || 100
            })),
            totalObtainedMarks: obtained,
            totalMaxMarks: max,
            percentage: parseFloat(percentage as string),
            status: parseFloat(percentage as string) >= 40 ? 'Passed' : 'Failed' // Simple logic
        };

        try {
            await createResult(resultPayload);
            message.success('Result Saved Successfully!');
            setMarks({});
            setSelectedStudentId(null);
        } catch (error) {
            console.error(error);
        }
    };

    const columns = [
        {
            title: 'Subject',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Max Marks',
            dataIndex: 'maxMarks',
            key: 'maxMarks',
            render: (val: number) => <Tag>{val}</Tag>
        },
        {
            title: 'Obtained Marks',
            key: 'obtained',
            render: (_: any, record: any) => (
                <Input
                    type="number"
                    max={record.maxMarks}
                    value={marks[record.name] || ''}
                    onChange={(e) => handleMarkChange(record.name, e.target.value)}
                    className="w-24"
                    disabled={!selectedStudentId}
                />
            )
        }
    ];

    const viewColumns = [
        {
            title: 'Exam',
            key: 'exam',
            render: (_: any, record: any) => {
                const exam = exams.find(e => e._id === (record.examId?._id || record.examId));
                return <span className="font-medium">{exam ? exam.title : 'Unknown'}</span>;
            }
        },
        {
            title: 'Student',
            key: 'student',
            render: (_: any, record: any) => {
                const sid = record.studentId?._id || record.studentId;
                const student = students.find(s => s._id === sid);
                return <span>{student ? `${student.firstName} ${student.lastName}` : 'Unknown'}</span>;
            }
        },
        {
            title: 'Percentage',
            dataIndex: 'percentage',
            key: 'percentage',
            render: (val: number) => <span className="font-bold">{val}%</span>
        },
        {
            title: 'Result Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const color = status === 'Passed' ? 'success' : status === 'Failed' ? 'error' : 'default';
                return <Tag color={color}>{status || 'Published'}</Tag>;
            }
        }
    ];

    // Filter results if exam selected on 'view' tab? For now show all, or filter if exam selected contextually.
    const filteredResults = activeTab === 'view' && selectedExamId
        ? (results || []).filter((r: any) => (r.examId?._id || r.examId) === selectedExamId)
        : (results || []);

    const { obtained, max, percentage } = calculateTotal();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Result Management</h1>

            <Tabs activeKey={activeTab} onChange={setActiveTab} className="bg-white p-4 rounded-xl shadow-sm">
                <TabPane tab="Enter Marks" key="entry">
                    <Card className="shadow-sm border-none mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item label="Select Exam" className="mb-0">
                                <Select
                                    placeholder="Choose Exam"
                                    onChange={(val) => {
                                        setSelectedExamId(val);
                                        setSelectedStudentId(null);
                                        setMarks({});
                                    }}
                                    className="w-full"
                                    value={selectedExamId}
                                >
                                    {(Array.isArray(exams) ? exams : []).map(e => <Option key={e._id} value={e._id}>{e.title}</Option>)}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Select Student" className="mb-0">
                                <Select
                                    placeholder="Choose Student"
                                    onChange={setSelectedStudentId}
                                    value={selectedStudentId}
                                    className="w-full"
                                    disabled={!selectedExamId}
                                    showSearch
                                    optionFilterProp="children"
                                >
                                    {(Array.isArray(eligibleStudents) ? eligibleStudents : []).map(s => <Option key={s._id} value={s._id}>{s.firstName} {s.lastName} ({s.currentClass})</Option>)}
                                </Select>
                            </Form.Item>
                        </div>
                    </Card>

                    {selectedStudentId ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <Card title="Enter Marks">
                                    {subjects.length > 0 ? (
                                        <Table
                                            dataSource={subjects}
                                            columns={columns}
                                            rowKey="name"
                                            pagination={false}
                                        />
                                    ) : <div className="p-4 text-center text-gray-500">No subjects scheduled for this exam.</div>}
                                </Card>
                            </div>
                            <div>
                                <Card title="Summary" className="sticky top-6">
                                    <div className="space-y-4 text-center">
                                        <div>
                                            <div className="text-gray-500">Total Obtained</div>
                                            <div className="text-3xl font-bold text-primary">{obtained} / {max}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Percentage</div>
                                            <div className="text-2xl font-bold text-green-600">{percentage}%</div>
                                        </div>
                                        <Button
                                            type="primary"
                                            className="w-full bg-primary h-12 text-lg"
                                            onClick={handleSave}
                                            loading={loading}
                                            icon={<SaveOutlined />}
                                        >
                                            Save Result
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400">
                            Please select an exam and a student to enter marks.
                        </div>
                    )}
                </TabPane>

                <TabPane tab="View Results" key="view">
                    <Card className="shadow-sm border-none mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item label="Filter by Exam" className="mb-0">
                                <Select
                                    placeholder="All Exams"
                                    onChange={(val) => setSelectedExamId(val)}
                                    className="w-full"
                                    value={selectedExamId}
                                    allowClear
                                >
                                    {(exams || []).map(e => <Option key={e._id} value={e._id}>{e.title}</Option>)}
                                </Select>
                            </Form.Item>
                        </div>
                    </Card>

                    <Table
                        columns={viewColumns}
                        dataSource={filteredResults}
                        rowKey="_id"
                        pagination={{ pageSize: 10 }}
                        loading={loading}
                        className="glass-table"
                    />
                </TabPane>
            </Tabs>
        </div>
    );
};

export default ResultEntryPage;
