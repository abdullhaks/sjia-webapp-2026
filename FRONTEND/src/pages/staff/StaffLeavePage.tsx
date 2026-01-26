import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLeaveStore } from '../../store/leaveStore';
import { FaPlus } from 'react-icons/fa';

const StaffLeavePage: React.FC = () => {
    const { leaves, loading, fetchMyLeaves, createLeave } = useLeaveStore();
    const [isApplyOpen, setIsApplyOpen] = useState(false);
    const [applyData, setApplyData] = useState({ type: 'Sick Leave', startDate: '', endDate: '', reason: '' });

    useEffect(() => {
        fetchMyLeaves();
    }, [fetchMyLeaves]);

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

    if (loading) return <div className="p-8 text-center">Loading leaves...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-1">Leave Management</h1>
                    <p className="text-gray-500">Track and apply for leaves</p>
                </div>
                <button onClick={() => setIsApplyOpen(true)} className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 flex items-center gap-2">
                    <FaPlus /> Apply Leave
                </button>
            </div>

            {/* Apply Modal */}
            {isApplyOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                        <h2 className="text-xl font-bold mb-4">Apply for Leave</h2>
                        <form onSubmit={handleApply} className="space-y-4">
                            <select value={applyData.type} onChange={e => setApplyData({ ...applyData, type: e.target.value })} className="w-full p-2 border rounded">
                                <option>Sick Leave</option>
                                <option>Casual Leave</option>
                                <option>Emergency</option>
                            </select>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-xs">Start Date</label><input type="date" value={applyData.startDate} onChange={e => setApplyData({ ...applyData, startDate: e.target.value })} className="w-full p-2 border rounded" required /></div>
                                <div><label className="text-xs">End Date</label><input type="date" value={applyData.endDate} onChange={e => setApplyData({ ...applyData, endDate: e.target.value })} className="w-full p-2 border rounded" required /></div>
                            </div>
                            <textarea placeholder="Reason" value={applyData.reason} onChange={e => setApplyData({ ...applyData, reason: e.target.value })} className="w-full p-2 border rounded" required />
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setIsApplyOpen(false)} className="flex-1 p-2 border rounded">Cancel</button>
                                <button type="submit" className="flex-1 p-2 bg-emerald-600 text-white rounded">Submit Request</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

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
};

export default StaffLeavePage;
