
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useFinanceStore } from '../../../store/financeStore';

import { FaMoneyBillWave, FaExclamationCircle, FaChartLine } from 'react-icons/fa';
import { Card, Table, Tag } from 'antd';

const FinanceDashboardPage: React.FC = () => {
    const { stats, fees, fetchStats, fetchFees } = useFinanceStore();

    useEffect(() => {
        fetchStats();
        fetchFees();
    }, [fetchStats, fetchFees]);

    // Mock recent transactions for dashboard visualization if real ones aren't separate endpoint yet
    // In real app, we might want 'recent payments' endpoint.
    // For now, let's just show Stats and Fee Structures.

    const columns = [
        { title: 'Title', dataIndex: 'title', key: 'title' },
        { title: 'Class', dataIndex: 'class', key: 'class', render: (text: string) => <Tag color="blue">{text}</Tag> },
        { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (val: number) => `₹${val.toLocaleString()}` },
        { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate', render: (val: string) => new Date(val).toLocaleDateString() },
        { title: 'Frequency', dataIndex: 'frequency', key: 'frequency' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Finance Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-green-50 rounded-xl text-green-600">
                        <FaMoneyBillWave size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Collected</p>
                        <h3 className="text-2xl font-bold text-gray-800">₹{stats?.totalCollected.toLocaleString() || 0}</h3>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-red-50 rounded-xl text-red-600">
                        <FaExclamationCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Pending Fees</p>
                        <h3 className="text-2xl font-bold text-gray-800">₹{stats?.pendingFees.toLocaleString() || 0}</h3>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-blue-50 rounded-xl text-blue-600">
                        <FaChartLine size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Active Fee Structures</p>
                        <h3 className="text-2xl font-bold text-gray-800">{fees.length}</h3>
                    </div>
                </motion.div>
            </div>

            {/* Fee Structures List */}
            <Card title="Fee Structures" className="shadow-sm rounded-2xl border-gray-100">
                <Table
                    dataSource={fees}
                    columns={columns}
                    rowKey="_id"
                    pagination={{ pageSize: 5 }}
                />
            </Card>
        </div>
    );
};

export default FinanceDashboardPage;
