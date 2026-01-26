import React, { useEffect } from 'react';
import { Table, Tag, Button, Tooltip, Space, Modal } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useLeaveStore } from '../../../store/leaveStore';
import { Leave } from '../../../services/api/leave.api';
import { message } from '../../common/AntdStaticProvider';
import LoadingSpinner from '../../common/LoadingSpinner';

const LeaveRequestsTable: React.FC = () => {
    const { leaves, loading, error, fetchAllLeaves, updateLeaveStatus } = useLeaveStore();

    useEffect(() => {
        fetchAllLeaves();
    }, [fetchAllLeaves]);

    useEffect(() => {
        if (error) {
            message.error(error);
        }
    }, [error]);

    const handleAction = (id: string, action: 'Approved' | 'Rejected') => {
        Modal.confirm({
            title: `Are you sure you want to ${action} this request?`,
            onOk: async () => {
                await updateLeaveStatus(id, action);
                message.success(`Leave request ${action.toLowerCase()} successfully`);
            }
        });
    };

    const columns = [
        {
            title: 'Applicant',
            key: 'applicant',
            render: (_: any, record: Leave) => (
                <div>
                    <div className="font-medium">{`${record.firstName} ${record.lastName}`}</div>
                    <div className="text-xs text-gray-500">{record.role}</div>
                </div>
            )
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (text: string) => <Tag>{text}</Tag>
        },
        {
            title: 'Dates',
            key: 'dates',
            render: (_: any, record: Leave) => (
                <span className="text-sm">
                    {new Date(record.startDate).toLocaleDateString()} to {new Date(record.endDate).toLocaleDateString()}
                </span>
            )
        },
        {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',
            ellipsis: true,
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
            render: (_: any, record: Leave) => (
                <Space size="small">
                    {record.status === 'Pending' && (
                        <>
                            <Tooltip title="Approve">
                                <Button
                                    type="text"
                                    shape="circle"
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                    icon={<CheckOutlined />}
                                    onClick={() => handleAction(record._id, 'Approved')}
                                />
                            </Tooltip>
                            <Tooltip title="Reject">
                                <Button
                                    type="text"
                                    shape="circle"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    icon={<CloseOutlined />}
                                    onClick={() => handleAction(record._id, 'Rejected')}
                                />
                            </Tooltip>
                        </>
                    )}
                </Space>
            )
        }
    ];

    if (loading && leaves.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <Table
            columns={columns}
            dataSource={leaves}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            className="glass-table"
        />
    );
};

export default LeaveRequestsTable;
