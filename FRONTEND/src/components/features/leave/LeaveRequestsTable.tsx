import React, { useEffect } from 'react';
import { Table, Tag, Button, Tooltip, Space, Modal, Input } from 'antd';
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

    const [rejectModal, setRejectModal] = React.useState<{ open: boolean; id: string | null }>({ open: false, id: null });
    const [rejectionReason, setRejectionReason] = React.useState('');

    const handleApprove = (id: string) => {
        Modal.confirm({
            title: `Approve Leave Request`,
            content: 'Are you sure you want to approve this leave request?',
            onOk: async () => {
                await updateLeaveStatus(id, 'Approved');
                message.success(`Leave request approved successfully`);
            }
        });
    };

    const handleRejectClick = (id: string) => {
        setRejectModal({ open: true, id });
        setRejectionReason('');
    };

    const confirmReject = async () => {
        if (!rejectModal.id) return;
        if (!rejectionReason.trim()) {
            message.error('Please provide a rejection reason');
            return;
        }
        await updateLeaveStatus(rejectModal.id, 'Rejected', rejectionReason);
        message.success('Leave request rejected');
        setRejectModal({ open: false, id: null });
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
                                    onClick={() => handleApprove(record._id)}
                                />
                            </Tooltip>
                            <Tooltip title="Reject">
                                <Button
                                    type="text"
                                    shape="circle"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    icon={<CloseOutlined />}
                                    onClick={() => handleRejectClick(record._id)}
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
        <>
            <Table
                columns={columns}
                dataSource={leaves}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
                className="glass-table"
            />
            <Modal
                title="Reject Leave Request"
                open={rejectModal.open}
                onOk={confirmReject}
                onCancel={() => setRejectModal({ open: false, id: null })}
                okText="Yes, Reject"
                okButtonProps={{ danger: true }}
            >
                <div>
                    <p className="mb-2">Please provide a reason for rejecting this leave request:</p>
                    <Input.TextArea
                        rows={4}
                        placeholder="Rejection reason..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                    />
                </div>
            </Modal>
        </>
    );
};

export default LeaveRequestsTable;
