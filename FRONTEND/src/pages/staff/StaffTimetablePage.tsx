import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTimetableStore } from '../../store/timetableStore';

interface TimeSlot {
    day: string;
    period: number;
    subject: string;
    class: string;
    startTime: string;
    endTime: string;
}

const StaffTimetablePage: React.FC = () => {
    const { mySchedule, fetchMySchedule, loading } = useTimetableStore();
    const [schedule, setSchedule] = useState<any[]>([]); // Grouped by day

    useEffect(() => {
        fetchMySchedule();
    }, [fetchMySchedule]);

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

    if (loading) return <div className="p-8 text-center">Loading timetable...</div>;

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">My Teaching Schedule</h1>
                <p className="text-gray-500">Weekly classes allocation</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schedule.map((day, index) => (
                    <motion.div key={day.day} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">{day.day}</h3>
                        <div className="space-y-3">
                            {day.slots.length > 0 ? (
                                day.slots.map((slot: TimeSlot, idx: number) => (
                                    <div key={idx} className="flex gap-4 p-3 rounded-xl bg-gray-50">
                                        <div className="w-16 text-center font-bold text-emerald-600 bg-emerald-50 rounded p-1 text-sm flex flex-col justify-center">
                                            <span>Period {slot.period}</span>
                                            <span className="text-xs font-normal opacity-75">{slot.startTime}</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{slot.subject}</p>
                                            <p className="text-xs text-gray-500">{slot.class}</p>
                                        </div>
                                    </div>
                                ))
                            ) : <p className="text-gray-400 italic text-sm">No classes</p>}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default StaffTimetablePage;
