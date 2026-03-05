import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Tooltip, Card, Space, Modal, Input, Select } from 'antd';
import { EyeOutlined, DeleteOutlined, PlayCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import ExamCreateForm from '../../components/features/exam/ExamCreateForm';
import ExamDetailModal from '../../components/common/ExamDetailModal';
import { useExamStore } from '../../store/examStore';
import { Exam } from '../../services/api/exam.api';
import { message } from '../../components/common/AntdStaticProvider';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const { confirm } = Modal;

const ExamListPage: React.FC = () => {
    const { exams, loading, error, fetchAllExams, deleteExam, updateExamStatus } = useExamStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [detailModal, setDetailModal] = useState<{ open: boolean; exam: Exam | null }>({ open: false, exam: null });

    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchAllExams('admin');
    }, [fetchAllExams]);

    useEffect(() => {
        if (error) {
            message.error(error);
        }
    }, [error]);

    const handleDelete = (id: string, title: string) => {
        confirm({
            title: `Delete Exam`,
            content: `Are you sure you want to delete ${title}?`,
            okType: 'danger',
            onOk: async () => {
                await deleteExam(id);
                message.success('Exam deleted successfully');
            },
        });
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            await updateExamStatus(id, newStatus);
            message.success(`Exam marked as ${newStatus}`);
        } catch (error) {
            console.error(error);
        }
    };

    // Filter exams
    const filteredExams = (exams || []).filter((exam) => {
        const matchesSearch =
            searchText === '' ||
            exam.title.toLowerCase().includes(searchText.toLowerCase());

        const matchesStatus = statusFilter === 'all' || exam.status.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    const columns = [
        {
            title: 'Exam Title',
            dataIndex: 'title',
            key: 'title',
            render: (text: string) => <span className="font-medium text-gray-800">{text}</span>
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (text: string) => <Tag color="blue">{text}</Tag>
        },
        {
            title: 'Duration',
            key: 'duration',
            render: (_: any, record: Exam) => (
                <span className="text-sm text-gray-600">
                    {new Date(record.startDate).toLocaleDateString()} - {new Date(record.endDate).toLocaleDateString()}
                </span>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'default';
                if (status === 'Completed') color = 'success';
                if (status === 'Scheduled') color = 'processing';
                if (status === 'Ongoing') color = 'warning';
                return <Tag color={color}>{status}</Tag>;
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Exam) => (
                <Space size="small">
                    {record.status === 'Scheduled' && (
                        <Tooltip title="Start Exam">
                            <Button type="text" shape="circle" className="text-orange-500 hover:text-orange-700 hover:bg-orange-50" icon={<PlayCircleOutlined />} onClick={() => handleStatusChange(record._id, 'Ongoing')} />
                        </Tooltip>
                    )}
                    {record.status === 'Ongoing' && (
                        <Tooltip title="Complete Exam">
                            <Button type="text" shape="circle" className="text-green-500 hover:text-green-700 hover:bg-green-50" icon={<CheckCircleOutlined />} onClick={() => handleStatusChange(record._id, 'Completed')} />
                        </Tooltip>
                    )}
                    <Tooltip title="View Schedule">
                        <Button type="text" shape="circle" icon={<EyeOutlined />} onClick={() => setDetailModal({ open: true, exam: record })} />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button
                            type="text"
                            shape="circle"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record._id, record.title)}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Exam Management</h1>
                    <p className="text-gray-500">Schedule and manage examinations</p>
                </div>
                <Button
                    type="primary"
                    className="bg-primary"
                    onClick={() => setIsModalOpen(true)}
                >
                    Schedule Exam
                </Button>
            </div>

            <Card className="p-0 overflow-hidden border-none shadow-sm">
                <div className="p-4 border-b border-gray-100 flex gap-4">
                    <Input.Search
                        placeholder="Search exam title..."
                        className="max-w-xs"
                        onChange={e => setSearchText(e.target.value)}
                        value={searchText}
                        allowClear
                    />
                    <Select
                        value={statusFilter}
                        className="w-40"
                        onChange={setStatusFilter}
                    >
                        <Select.Option value="all">All Status</Select.Option>
                        <Select.Option value="scheduled">Scheduled</Select.Option>
                        <Select.Option value="ongoing">Ongoing</Select.Option>
                        <Select.Option value="completed">Completed</Select.Option>
                    </Select>
                </div>

                {loading && (!exams || exams.length === 0) ? (
                    <LoadingSpinner />
                ) : (
                    <Table
                        columns={columns}
                        dataSource={filteredExams}
                        rowKey="_id"
                        pagination={{ pageSize: 10 }}
                        className="glass-table"
                        loading={loading}
                    />
                )}
            </Card>

            <ExamCreateForm
                visible={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onSuccess={() => {
                    setIsModalOpen(false);
                    fetchAllExams('admin');
                    message.success('Exam scheduled successfully');
                }}
            />

            <ExamDetailModal
                exam={detailModal.exam}
                isOpen={detailModal.open}
                onClose={() => setDetailModal({ open: false, exam: null })}
            />
        </div>
    );
};

export default ExamListPage;
