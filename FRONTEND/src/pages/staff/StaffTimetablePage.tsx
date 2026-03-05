import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTimetableStore } from '../../store/timetableStore';
import { useStaffStore } from '../../store/staffStore';
import { Modal, Select, Input, Button, Tabs, Tag, Spin } from 'antd';
import { FaExchangeAlt, FaCheck, FaTimes } from 'react-icons/fa';
import { message } from '../../components/common/AntdStaticProvider';

const { Option } = Select;

interface TimeSlot {
    timetableId: string;
    day: string;
    period: number;
    subject: string;
    class: string;
    startTime: string;
    endTime: string;
}

const StaffTimetablePage: React.FC = () => {
    const { mySchedule, fetchMySchedule, swapRequests, fetchSwapRequests, sendSwapRequest, respondSwapRequest, loading } = useTimetableStore();
    const { staff, fetchStaff } = useStaffStore();
    const [schedule, setSchedule] = useState<any[]>([]); // Grouped by day

    // Swap Modal State
    const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [swapTargetStaff, setSwapTargetStaff] = useState<string | null>(null);
    const [swapReason, setSwapReason] = useState('');

    useEffect(() => {
        fetchMySchedule();
        fetchStaff();
        fetchSwapRequests();
    }, [fetchMySchedule, fetchStaff, fetchSwapRequests]);

    useEffect(() => {
        if (mySchedule.length > 0) {
            setSchedule(processGridData(mySchedule));
        }
    }, [mySchedule]);

    const processGridData = (gridData: TimeSlot[]) => {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        return days.map(day => ({
            day,
            slots: gridData.filter(slot => slot.day === day).sort((a, b) => a.period - b.period)
        }));
    };

    const handleSwapRequest = async () => {
        if (!swapTargetStaff || !swapReason || !selectedSlot) {
            message.error('Please select a target staff and provide a reason');
            return;
        }

        try {
            await sendSwapRequest({
                timetableId: selectedSlot.timetableId,
                day: selectedSlot.day,
                period: selectedSlot.period,
                className: selectedSlot.class,
                subject: selectedSlot.subject,
                toStaffId: swapTargetStaff,
                reason: swapReason
            });
            message.success(`Swap request sent successfully`);
            setIsSwapModalOpen(false);
            setSwapTargetStaff(null);
            setSwapReason('');
        } catch (error) {
            // Error managed by store
        }
    };

    const handleRespond = async (id: string, action: 'approve' | 'reject') => {
        try {
            await respondSwapRequest(id, action);
            message.success(`Request ${action}d successfully`);
        } catch (error) { }
    }

    if (loading && !mySchedule.length) return <div className="p-8 text-center flex justify-center"><Spin size="large" /></div>;

    const ScheduleTab = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {schedule.map((day, index) => (
                <motion.div key={day.day} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">{day.day}</h3>
                    <div className="space-y-3">
                        {day.slots.length > 0 ? (
                            day.slots.map((slot: TimeSlot, idx: number) => (
                                <div key={idx} className="flex gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-emerald-200 transition-colors group relative">
                                    <div className="w-16 text-center font-bold text-emerald-600 bg-emerald-50 rounded p-1 text-sm flex flex-col justify-center shrink-0">
                                        <span>Period {slot.period}</span>
                                        <span className="text-xs font-normal opacity-75">{slot.startTime}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-800 truncate">{slot.subject}</p>
                                        <p className="text-xs text-gray-500 truncate">{slot.class}</p>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-3 top-1/2 -translate-y-1/2">
                                        <button
                                            onClick={() => {
                                                setSelectedSlot(slot);
                                                setIsSwapModalOpen(true);
                                            }}
                                            className="p-2 bg-white rounded-lg border border-gray-200 text-gray-600 hover:text-emerald-600 hover:border-emerald-300 shadow-sm"
                                            title="Request Period Swap"
                                        >
                                            <FaExchangeAlt />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : <p className="text-gray-400 italic text-sm text-center py-4 bg-gray-50 rounded-xl">No classes</p>}
                    </div>
                </motion.div>
            ))}
        </div>
    );

    const SwapRequestsTab = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Incoming Requests</h3>
                <div className="space-y-3">
                    {swapRequests?.received?.length > 0 ? swapRequests.received.map((req: any) => (
                        <div key={req._id} className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                            <p className="font-semibold text-blue-900">{req.className} | {req.subject} <Tag className="ml-2">Period {req.period}</Tag></p>
                            <p className="text-sm text-blue-700 mt-1">From: {req.fromStaffId?.firstName} {req.fromStaffId?.lastName}</p>
                            <p className="text-sm italic text-gray-500 mt-1">"{req.reason}"</p>
                            <div className="mt-3 flex gap-2">
                                <Button size="small" type="primary" onClick={() => handleRespond(req._id, 'approve')} className="bg-emerald-500 hover:bg-emerald-600 border-none icon-flex"><FaCheck /> Accept</Button>
                                <Button size="small" danger onClick={() => handleRespond(req._id, 'reject')} className="icon-flex"><FaTimes /> Reject</Button>
                            </div>
                        </div>
                    )) : <p className="text-gray-400 text-sm">No incoming requests</p>}
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Sent Requests</h3>
                <div className="space-y-3">
                    {swapRequests?.sent?.length > 0 ? swapRequests.sent.map((req: any) => (
                        <div key={req._id} className="p-3 bg-gray-50 border border-gray-100 rounded-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-gray-700">{req.className} | {req.subject} <Tag className="ml-2">Period {req.period}</Tag></p>
                                    <p className="text-sm text-gray-500 mt-1">To: {req.toStaffId?.firstName} {req.toStaffId?.lastName}</p>
                                </div>
                                <div>
                                    {req.status === 'Pending' && <Tag color="gold">Pending</Tag>}
                                    {req.status === 'Approved' && <Tag color="green">Approved</Tag>}
                                    {req.status === 'Rejected' && <Tag color="red">Rejected</Tag>}
                                </div>
                            </div>
                        </div>
                    )) : <p className="text-gray-400 text-sm">No sent requests</p>}
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">My Teaching Schedule</h1>
                    <p className="text-gray-500">Weekly classes allocation & Period Swapping</p>
                </div>
            </div>

            <Tabs
                defaultActiveKey="1"
                items={[
                    { key: '1', label: 'My Timetable', children: <ScheduleTab /> },
                    { key: '2', label: 'Period Exchange', children: <SwapRequestsTab /> }
                ]}
            />

            <Modal
                title="Period Exchange Request"
                open={isSwapModalOpen}
                onCancel={() => setIsSwapModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsSwapModalOpen(false)}>Cancel</Button>,
                    <Button key="submit" type="primary" className="bg-emerald-600" onClick={handleSwapRequest} loading={loading}>Send Request</Button>,
                ]}
            >
                <div className="space-y-4 pt-4">
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                        <p className="text-sm text-emerald-800">
                            <strong>Slot:</strong> {selectedSlot?.day} - Period {selectedSlot?.period} <br />
                            <strong>Class:</strong> {selectedSlot?.class} ({selectedSlot?.subject})
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Target Staff</label>
                        <Select
                            className="w-full"
                            placeholder="Select a teacher to request swap"
                            showSearch
                            optionFilterProp="children"
                            value={swapTargetStaff}
                            onChange={setSwapTargetStaff}
                        >
                            {staff?.map((staffItem: any) => (
                                <Option key={staffItem._id} value={staffItem._id}>{staffItem.firstName} {staffItem.lastName} ({staffItem.department})</Option>
                            ))}
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason / Note</label>
                        <Input.TextArea
                            rows={3}
                            placeholder="Will you take my proxy? I have emergency..."
                            value={swapReason}
                            onChange={(e) => setSwapReason(e.target.value)}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default StaffTimetablePage;
