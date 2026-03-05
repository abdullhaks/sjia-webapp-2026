import React, { useState, useEffect, useMemo } from 'react';
import { Card, Form, Select, Input, Button, Table, Tag } from 'antd';
import { message } from '../../components/common/AntdStaticProvider';
import { SaveOutlined } from '@ant-design/icons';
import { useExamStore } from '../../store/examStore';
import { useStudentStore } from '../../store/studentStore';
import { useResultStore } from '../../store/resultStore';
import { useTimetableStore } from '../../store/timetableStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const { Option } = Select;

const StaffExamAppraisalsPage: React.FC = () => {
    const { exams, fetchAllExams, loading: examLoading } = useExamStore();
    const { students, fetchStudents, loading: studentLoading } = useStudentStore();
    const { createResult, loading } = useResultStore();
    const { mySchedule, fetchMySchedule, loading: timetableLoading } = useTimetableStore();

    const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [marks, setMarks] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        fetchAllExams('Ongoing');
        fetchStudents();
        fetchMySchedule();
    }, [fetchAllExams, fetchStudents, fetchMySchedule]);

    // Build specific matrices of what this staff actively teaches this semester.
    const { taughtClasses, taughtSubjectsByClass } = useMemo(() => {
        const classes = new Set<string>();
        const subjectMap: Record<string, Set<string>> = {};

        mySchedule.forEach(slot => {
            classes.add(slot.class);
            if (!subjectMap[slot.class]) subjectMap[slot.class] = new Set();
            subjectMap[slot.class].add(slot.subject);
        });

        return { taughtClasses: Array.from(classes), taughtSubjectsByClass: subjectMap };
    }, [mySchedule]);

    // Filter exams: Only 'Ongoing' and only those targeting a class this staff teaches.
    const relevantExams = exams.filter(e => {
        if (e.status !== 'Ongoing') return false;
        const examClasses = (e as any).classes || [];
        return examClasses.some((c: string) => taughtClasses.includes(c));
    });

    const selectedExam = relevantExams.find(e => e._id === selectedExamId);

    // Filter students: Must be in the exam's scopes AND taught by the staff locally.
    const eligibleStudents = selectedExam && (selectedExam as any).classes
        ? students.filter(s =>
            (selectedExam as any).classes.includes(s.currentClass) &&
            taughtClasses.includes(s.currentClass)
        )
        : [];

    const selectedStudent = students.find(s => s._id === selectedStudentId);

    // Limit the input boxes heavily so a math teacher cannot type english marks.
    const subjects = selectedExam && (selectedExam as any).schedule && selectedStudent
        ? (selectedExam as any).schedule
            .filter((s: any) => taughtSubjectsByClass[selectedStudent.currentClass]?.has(s.subjectName))
            .map((s: any) => ({
                name: s.subjectName,
                maxMarks: s.maxMarks || 100 // Default to 100 if not specified
            }))
        : [];

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
            status: parseFloat(percentage as string) >= 40 ? 'Passed' : 'Failed'
        };

        try {
            await createResult(resultPayload);
            message.success('Marks Saved Successfully!');
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
                    className="w-24 border-emerald-500 focus:ring-emerald-500"
                    disabled={!selectedStudentId}
                />
            )
        }
    ];

    const { obtained, max, percentage } = calculateTotal();

    if (examLoading || studentLoading || timetableLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Exam Appraisals</h1>
            <p className="text-gray-500">Enter marks for progressing examinations</p>

            <Card className="shadow-sm border-gray-100 rounded-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item label="Select Ongoing Exam" className="mb-0">
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
                            {relevantExams.map(e => <Option key={e._id} value={e._id}>{e.title}</Option>)}
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
                            {eligibleStudents.map(s => <Option key={s._id} value={s._id}>{s.firstName} {s.lastName} ({s.currentClass})</Option>)}
                        </Select>
                    </Form.Item>
                </div>
            </Card>

            {selectedStudentId && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <Card title="Enter Marks" className="shadow-sm border-gray-100 rounded-2xl overflow-hidden">
                            {subjects.length > 0 ? (
                                <Table
                                    dataSource={subjects}
                                    columns={columns}
                                    rowKey="name"
                                    pagination={false}
                                />
                            ) : <div className="p-4 text-center text-gray-500">No subjects assigned for this exam.</div>}
                        </Card>
                    </div>
                    <div>
                        <Card title="Summary" className="sticky top-6 shadow-sm border-gray-100 rounded-2xl">
                            <div className="space-y-4 text-center">
                                <div>
                                    <div className="text-gray-500">Total Obtained</div>
                                    <div className="text-3xl font-bold text-emerald-600">{obtained} / {max}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Percentage</div>
                                    <div className="text-2xl font-bold text-emerald-600">{percentage}%</div>
                                </div>
                                <Button
                                    type="primary"
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-lg border-emerald-600 font-bold"
                                    onClick={handleSave}
                                    loading={loading}
                                    icon={<SaveOutlined />}
                                >
                                    Submit Marks
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffExamAppraisalsPage;
