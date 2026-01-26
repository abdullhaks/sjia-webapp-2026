import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Tooltip, Card, Space, Modal } from 'antd';
// import { EyeOutlined, DeleteOutlined, PlusOutlined, CalendarOutlined } from '@ant-design/icons';
import ExamCreateForm from '../../components/features/exam/ExamCreateForm';
import { useExamStore } from '../../store/examStore';
import { Exam } from '../../services/api/exam.api';
import { message } from '../../components/common/AntdStaticProvider';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const { confirm } = Modal;

const ExamListPage: React.FC = () => {
    const { exams, loading, error, fetchAllExams, deleteExam } = useExamStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

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
                    <Tooltip title="View Schedule">
                        <Button type="text" shape="circle" >View</Button>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button
                            type="text"
                            shape="circle"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(record._id, record.title)}
                        >Del</Button>
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
                {loading && exams.length === 0 ? (
                    <LoadingSpinner />
                ) : (
                    <Table
                        columns={columns}
                        dataSource={exams}
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
        </div>
    );
};

export default ExamListPage;
