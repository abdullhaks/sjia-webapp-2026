import React, { useEffect } from 'react';
import { Table, Tag } from 'antd';
import { useLeaveStore } from '../../../store/leaveStore';
import LoadingSpinner from '../../common/LoadingSpinner';

const MyLeaveHistory: React.FC = () => {
    const { leaves, loading, fetchMyLeaves } = useLeaveStore();

    useEffect(() => {
        fetchMyLeaves();
    }, [fetchMyLeaves]);

    const calculateDays = (start: string, end: string) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
    };

    const columns = [
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Duration',
            key: 'duration',
            render: (_: any, record: any) => (
                <span>
                    {new Date(record.startDate).toLocaleDateString()} to {new Date(record.endDate).toLocaleDateString()}{' '}
                    ({calculateDays(record.startDate, record.endDate)} days)
                </span>
            )
        },
        {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string, record: any) => {
                let color = 'default';
                if (status === 'Approved') color = 'success';
                if (status === 'Rejected') color = 'error';
                if (status === 'Pending') color = 'processing';
                return (
                    <div className="flex flex-col gap-1">
                        <Tag color={color} className="w-fit">{status}</Tag>
                        {status === 'Rejected' && record.rejectionReason && (
                            <span className="text-xs text-red-500 block truncate max-w-xs" title={record.rejectionReason}>
                                {record.rejectionReason}
                            </span>
                        )}
                    </div>
                );
            }
        },
    ];

    if (loading && leaves.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <Table
            columns={columns}
            dataSource={leaves}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
            className="glass-table"
        />
    );
};

export default MyLeaveHistory;
