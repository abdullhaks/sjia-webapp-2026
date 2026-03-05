import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLeaveStore } from '../../store/leaveStore';
import { useSalaryStore } from '../../store/salaryStore';
import { useAuthStore } from '../../store/authStore';
import { FaPlus, FaMoneyBillWave, FaCalendarAlt } from 'react-icons/fa';
import { Tabs, Table, Tag } from 'antd';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StaffLeavePage: React.FC = () => {
    const { leaves, loading: leaveLoading, fetchMyLeaves, createLeave } = useLeaveStore();
    const { salaries, loading: salaryLoading, fetchStaffSalaries } = useSalaryStore();
    const { user } = useAuthStore();

    const [isApplyOpen, setIsApplyOpen] = useState(false);
    const [applyData, setApplyData] = useState({ type: 'Sick Leave', startDate: '', endDate: '', reason: '' });

    useEffect(() => {
        fetchMyLeaves();
        if (user?.id) {
            fetchStaffSalaries(user.id);
        }
    }, [fetchMyLeaves, fetchStaffSalaries, user]);

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createLeave({
                ...applyData,
                role: 'staff' // Ensure backend handles this or dto allows
            });
            setIsApplyOpen(false);
            // fetchMyLeaves(); // Store updates automatically
        } catch (err) {
            alert('Failed to apply');
        }
    };

    const salaryColumns = [
        {
            title: 'Month',
            dataIndex: 'month',
            key: 'month',
            render: (text: string) => <span className="font-semibold text-gray-800">{new Date(text + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
        },
        {
            title: 'Base Salary',
            dataIndex: 'baseSalary',
            key: 'baseSalary',
            render: (val: number) => `₹${val.toLocaleString()}`
        },
        {
            title: 'Bonus',
            dataIndex: 'bonuses',
            key: 'bonuses',
            render: (val: number) => <span className="text-emerald-600">+₹{val.toLocaleString()}</span>
        },
        {
            title: 'Deductions',
            dataIndex: 'deductions',
            key: 'deductions',
            render: (val: number) => <span className="text-red-500">-₹{val.toLocaleString()}</span>
        },
        {
            title: 'Net Salary',
            dataIndex: 'netSalary',
            key: 'netSalary',
            render: (val: number) => <span className="font-bold text-gray-800">₹{val.toLocaleString()}</span>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'gold';
                if (status === 'Paid') color = 'green';
                return <Tag color={color}>{status}</Tag>;
            }
        },
        {
            title: 'Payment Date',
            dataIndex: 'paymentDate',
            key: 'paymentDate',
            render: (date: string) => date ? new Date(date).toLocaleDateString() : '-'
        }
    ];

    if (leaveLoading || salaryLoading) return <LoadingSpinner />;

    const leaveTabContent = (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">My Leave Applications</h2>
                <button onClick={() => setIsApplyOpen(true)} className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 flex items-center gap-2">
                    <FaPlus /> Apply Leave
                </button>
            </div>
            <div className="grid gap-4">
                {leaves.map((leave, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center">
                        <div>
                            <p className="font-bold text-gray-800">{leave.type || 'Leave'}</p>
                            <p className="text-sm text-gray-500">{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</p>
                            <p className="text-xs text-gray-400 mt-1">{leave.reason}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${leave.status === 'Approved' ? 'bg-green-100 text-green-700' :
                            leave.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                            {leave.status}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );

    const salaryTabContent = (
        <div className="space-y-6 flex flex-col pt-2">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <Table
                    columns={salaryColumns}
                    dataSource={salaries}
                    rowKey="_id"
                    pagination={false}
                />
            </div>
        </div>
    );

    const tabItems = [
        {
            key: 'leaves',
            label: (
                <span className="flex items-center gap-2 text-base px-2">
                    <FaCalendarAlt /> Leave Requests
                </span>
            ),
            children: leaveTabContent,
        },
        {
            key: 'salary',
            label: (
                <span className="flex items-center gap-2 text-base px-2">
                    <FaMoneyBillWave /> Salary History
                </span>
            ),
            children: salaryTabContent,
        },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">HR Actions</h1>
                <p className="text-gray-500">Manage your leaves and view salary slips</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <Tabs items={tabItems} defaultActiveKey="leaves" className="custom-tabs" />
            </div>

            {/* Apply Modal */}
            {isApplyOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                        <h2 className="text-xl font-bold mb-4">Apply for Leave</h2>
                        <form onSubmit={handleApply} className="space-y-4">
                            <select value={applyData.type} onChange={e => setApplyData({ ...applyData, type: e.target.value })} className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none">
                                <option>Sick Leave</option>
                                <option>Casual Leave</option>
                                <option>Emergency</option>
                            </select>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-xs text-gray-500 ml-1">Start Date</label><input type="date" value={applyData.startDate} onChange={e => setApplyData({ ...applyData, startDate: e.target.value })} className="w-full p-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 mt-1" required /></div>
                                <div><label className="text-xs text-gray-500 ml-1">End Date</label><input type="date" value={applyData.endDate} onChange={e => setApplyData({ ...applyData, endDate: e.target.value })} className="w-full p-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 mt-1" required /></div>
                            </div>
                            <textarea placeholder="Reason" value={applyData.reason} onChange={e => setApplyData({ ...applyData, reason: e.target.value })} className="w-full p-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 min-h-[100px]" required />
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setIsApplyOpen(false)} className="flex-1 p-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium rounded-xl transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 p-2.5 bg-emerald-600 text-white font-medium hover:bg-emerald-700 rounded-xl transition-colors">Submit Request</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default StaffLeavePage;
