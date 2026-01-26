import React, { useState, useEffect } from 'react';
import { Card, Form, Select, Input, Button, Table, Tag } from 'antd';
import { message } from '../../components/common/AntdStaticProvider';
import { SaveOutlined } from '@ant-design/icons';
import { useExamStore } from '../../store/examStore';
import { useStudentStore } from '../../store/studentStore';
import { useResultStore } from '../../store/resultStore';


const { Option } = Select;

const ResultEntryPage: React.FC = () => {
    const { exams, fetchAllExams } = useExamStore();
    const { students, fetchStudents } = useStudentStore();
    const { createResult, loading } = useResultStore();

    const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [marks, setMarks] = useState<{ [key: string]: number }>({});

    // Derived state
    const selectedExam = exams.find(e => e._id === selectedExamId);
    // Filter students based on exam's participating classes if possible. 
    // Assuming exam has a 'classes' array as per create form, but need to verify if it's in the interface.
    // If not in interface, we might display all students or need adjustments.
    // For now, filtering if 'classes' exists, otherwise showing all.
    const eligibleStudents = selectedExam && (selectedExam as any).classes
        ? students.filter(s => (selectedExam as any).classes.includes(s.currentClass))
        : students;

    const subjects = selectedExam && (selectedExam as any).schedule
        ? (selectedExam as any).schedule.map((s: any) => ({
            name: s.subjectName,
            maxMarks: s.maxMarks || 100 // Default to 100 if not specified
        }))
        : [];

    useEffect(() => {
        fetchAllExams('admin');
        fetchStudents();
    }, [fetchAllExams, fetchStudents]);


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

    const { obtained, max, percentage } = calculateTotal();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Result Management</h1>

            <Card className="shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item label="Select Exam">
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
                            {exams.map(e => <Option key={e._id} value={e._id}>{e.title}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Select Student">
                        <Select
                            placeholder="Choose Student"
                            onChange={setSelectedStudentId}
                            value={selectedStudentId}
                            className="w-full"
                            disabled={!selectedExamId}
                            showSearch
                            optionFilterProp="children"
                        >
                            {eligibleStudents.map(s => <Option key={s._id} value={s._id}>{s.firstName} {s.lastName} ({s.currentClass})</Option>)}
                        </Select>
                    </Form.Item>
                </div>
            </Card>

            {selectedStudentId && (
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
            )}
        </div>
    );
};

export default ResultEntryPage;
