import { Table, Tag, Button, Tooltip, Input, Select, Card, Space, Modal } from 'antd';
import { EyeOutlined, CheckOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useAdmissionStore } from '../../store/admissionStore';
import { Admission } from '../../services/api/admission.api';
import { message } from '../../components/common/AntdStaticProvider';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { FaInbox } from 'react-icons/fa';

const { Option } = Select;
const { confirm } = Modal;

const AdmissionListPage = () => {
    const { admissions, loading, error, fetchAdmissions, updateAdmissionStatus } = useAdmissionStore();
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchAdmissions();
    }, [fetchAdmissions]);

    useEffect(() => {
        if (error) {
            message.error(error);
        }
    }, [error]);

    const handleApprove = (id: string) => {
        confirm({
            title: 'Approve Application',
            content: 'Are you sure you want to approve this application? This will allow student enrollment.',
            onOk: async () => {
                await updateAdmissionStatus(id, { status: 'Approved' });
                message.success('Application approved successfully');
            },
        });
    };

    const handleReject = (id: string) => {
        confirm({
            title: 'Reject Application',
            content: 'Are you sure you want to reject this application?',
            okType: 'danger',
            onOk: async () => {
                await updateAdmissionStatus(id, { status: 'Rejected' });
                message.success('Application rejected');
            },
        });
    };

    // Filter admissions
    const filteredAdmissions = admissions.filter((admission) => {
        const matchesSearch =
            searchText === '' ||
            admission.applicationId.toLowerCase().includes(searchText.toLowerCase()) ||
            `${admission.firstName} ${admission.lastName}`.toLowerCase().includes(searchText.toLowerCase());

        const matchesStatus = statusFilter === 'all' || admission.status.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    const columns = [
        {
            title: 'App ID',
            dataIndex: 'applicationId',
            key: 'applicationId',
            render: (text: string) => <span className="font-mono text-xs text-gray-500">{text}</span>
        },
        {
            title: 'Applicant Name',
            key: 'name',
            render: (_: any, record: Admission) => (
                <span className="font-medium text-gray-800">{`${record.firstName} ${record.lastName}`}</span>
            )
        },
        {
            title: 'Program',
            dataIndex: 'program',
            key: 'program',
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'date',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'default';
                if (status === 'Approved') color = 'success';
                if (status === 'Rejected') color = 'error';
                if (status === 'Pending') color = 'processing';
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Admission) => (
                <Space size="small">
                    <Tooltip title="View Details">
                        <Button type="text" shape="circle" icon={<EyeOutlined />} />
                    </Tooltip>
                    {record.status === 'Pending' && (
                        <>
                            <Tooltip title="Approve">
                                <Button
                                    type="text"
                                    shape="circle"
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                    icon={<CheckOutlined />}
                                    onClick={() => handleApprove(record._id)}
                                />
                            </Tooltip>
                            <Tooltip title="Reject">
                                <Button
                                    type="text"
                                    shape="circle"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    icon={<CloseOutlined />}
                                    onClick={() => handleReject(record._id)}
                                />
                            </Tooltip>
                        </>
                    )}
                </Space>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Admission Applications</h1>
                    <p className="text-gray-500">Manage and review student applications</p>
                </div>
            </div>

            <Card className="p-6">
                <div className="flex flex-wrap gap-4 mb-6">
                    <Input
                        prefix={<SearchOutlined className="text-gray-400" />}
                        placeholder="Search by ID or Name"
                        className="max-w-xs rounded-full bg-gray-50 border-none px-4 py-2"
                        onChange={e => setSearchText(e.target.value)}
                        value={searchText}
                    />
                    <Select
                        value={statusFilter}
                        className="w-40"
                        bordered={false}
                        style={{ backgroundColor: '#f9fafb', borderRadius: '9999px' }}
                        onChange={setStatusFilter}
                    >
                        <Option value="all">All Status</Option>
                        <Option value="pending">Pending</Option>
                        <Option value="approved">Approved</Option>
                        <Option value="rejected">Rejected</Option>
                    </Select>
                </div>

                {loading && admissions.length === 0 ? (
                    <LoadingSpinner />
                ) : filteredAdmissions.length === 0 ? (
                    <EmptyState
                        icon={<FaInbox />}
                        title="No Applications Found"
                        description={searchText || statusFilter !== 'all' ? "Try adjusting your filters" : "No admission applications received yet."}
                    />
                ) : (
                    <Table
                        columns={columns}
                        dataSource={filteredAdmissions}
                        rowKey="_id"
                        pagination={{ pageSize: 10 }}
                        className="glass-table"
                        loading={loading}
                    />
                )}
            </Card>
        </div>
    );
};

export default AdmissionListPage;
