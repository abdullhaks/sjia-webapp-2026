import React from 'react';
import { Table, Tag } from 'antd';

const MyLeaveHistory: React.FC = () => {
    // Mock Data
    const data = [
        {
            key: '1',
            type: 'Sick Leave',
            startDate: '2024-01-10',
            endDate: '2024-01-12',
            days: 3,
            status: 'Approved',
            reason: 'High Fever',
        },
        {
            key: '2',
            type: 'Casual Leave',
            startDate: '2024-02-05',
            endDate: '2024-02-05',
            days: 1,
            status: 'Pending',
            reason: 'Personal work',
        }
    ];

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
                <span>{record.startDate} to {record.endDate} ({record.days} days)</span>
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
            render: (status: string) => {
                let color = 'default';
                if (status === 'Approved') color = 'success';
                if (status === 'Rejected') color = 'error';
                if (status === 'Pending') color = 'processing';
                return <Tag color={color}>{status}</Tag>;
            }
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 5 }}
            className="glass-table"
        />
    );
};

export default MyLeaveHistory;
