import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import axiosInstance from '../../services/axios/authAxios';

interface TimeSlot {
    time: string;
    subject: string;
    teacher: string;
}

interface DaySchedule {
    day: string;
    slots: TimeSlot[];
}

const StudentTimetablePage: React.FC = () => {
    const [schedule, setSchedule] = useState<DaySchedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                const response = await axiosInstance.get('/timetable/student/my-timetable');
                // Transform the grid data if necessary, assuming backend returns { gridData: [...] }
                // The service returns the Timetable document. gridData contains the slots.
                if (response.data && response.data.gridData) {
                    // Processing gridData to group by day might be needed if not already grouped
                    // Assuming gridData is flat list of slots with day, time, subject
                    const grid = response.data.gridData;
                    // Group by Day logic here or use as is if pre-grouped
                    // Simple mock transformation for now if structure is unknown, 
                    // but ideally backend sends a structured object.
                    // Let's assume the backend sends the standard Timetable object which has a gridData array.
                    setSchedule(processGridData(grid));
                }
            } catch (err) {
                setError('Failed to load timetable. Please contact admin if this persists.');
            } finally {
                setLoading(false);
            }
        };

        fetchTimetable();
    }, []);

    const processGridData = (gridData: any[]) => {
        // Helper to group flat slots by day
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        return days.map(day => ({
            day,
            slots: gridData.filter((slot: any) => slot.day === day).sort((a: any, b: any) => a.time.localeCompare(b.time))
        }));
    };

    if (loading) return <div className="p-8 text-center">Loading timetable...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">My Class Timetable</h1>
                <p className="text-gray-500">Weekly schedule</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schedule.map((day, index) => (
                    <motion.div
                        key={day.day}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
                    >
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
                            {day.day}
                        </h3>
                        <div className="space-y-3">
                            {day.slots.length > 0 ? (
                                day.slots.map((slot, idx) => (
                                    <div key={idx} className="flex items-start gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <div className="w-16 flex-shrink-0 text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded text-center">
                                            {slot.time}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{slot.subject}</p>
                                            <p className="text-xs text-gray-500">{slot.teacher}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400 italic">No classes scheduled</p>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default StudentTimetablePage;
