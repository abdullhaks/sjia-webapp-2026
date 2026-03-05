import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaBook, FaRegCheckSquare } from 'react-icons/fa';
import { Drawer, Radio, DatePicker, Button, Spin, Tag, Space } from 'antd';
import { message } from '../../components/common/AntdStaticProvider';
import dayjs from 'dayjs';

import { useTimetableStore } from '../../store/timetableStore';
import { useStudentStore } from '../../store/studentStore';
import { useAttendanceStore } from '../../store/attendanceStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StaffClassesPage: React.FC = () => {
    const { mySchedule, fetchMySchedule, loading: tableLoading } = useTimetableStore();
    const { students, fetchStudents, loading: studentLoading } = useStudentStore();
    const { markBulkAttendance, loading: attendanceLoading } = useAttendanceStore();

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<{ name: string; subject: string; period?: string } | null>(null);
    const [attendanceDate, setAttendanceDate] = useState(dayjs());
    const [attendanceStatus, setAttendanceStatus] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchMySchedule();
        fetchStudents();
    }, [fetchMySchedule, fetchStudents]);

    // Derive Unique Classes from Schedule.
    // Count exact matching students for each class
    const classes = Array.from(new Set(mySchedule.map(s => s.class + '|' + s.subject)))
        .map((key, index) => {
            const [className, subject] = key.split('|');
            const slot = mySchedule.find(s => s.class === className && s.subject === subject);
            const classStudents = students.filter(s => s.currentClass === className);

            return {
                id: index,
                name: className,
                subject: subject,
                period: slot ? `Period ${slot.period}` : undefined,
                studentsCount: classStudents.length,
                room: slot?.room || 'N/A'
            };
        });

    const handleOpenAttendance = (cls: any) => {
        setSelectedClass(cls);
        const classStudents = students.filter(s => s.currentClass === cls.name);

        // Initialize everything as Present natively to be extremely fast for teachers
        const initialStatus: Record<string, string> = {};
        classStudents.forEach(s => {
            initialStatus[s._id] = 'Present';
        });
        setAttendanceStatus(initialStatus);
        setIsDrawerOpen(true);
    };

    const handleBulkSubmit = async () => {
        if (!selectedClass) return;

        const records = Object.keys(attendanceStatus).map(studentId => ({
            studentId,
            date: attendanceDate.toISOString(),
            status: attendanceStatus[studentId],
            class: selectedClass.name,
            period: selectedClass.period
        }));

        try {
            await markBulkAttendance(records as any);
            message.success(`Attendance securely logged for ${selectedClass.name}`);
            setIsDrawerOpen(false);
        } catch (error) {
            // Handled natively by store.
        }
    };

    const activeStudents = selectedClass ? students.filter(s => s.currentClass === selectedClass.name) : [];

    if (tableLoading && classes.length === 0) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">My Classes</h1>
                <p className="text-gray-500">Manage class lists and quickly log daily attendance</p>
            </div>

            {classes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map((cls, index) => (
                        <motion.div
                            key={cls.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group relative overflow-hidden flex flex-col justify-between"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <FaUsers size={100} />
                            </div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                                        <FaBook size={24} />
                                    </div>
                                    <Tag color="green" className="rounded-full shadow-sm m-0 border-emerald-200 text-emerald-700">
                                        {cls.period || 'General'}
                                    </Tag>
                                </div>

                                <h3 className="text-xl font-bold text-gray-800 mb-1">{cls.subject}</h3>
                                <p className="text-gray-500 mb-4">{cls.name} • Room {cls.room}</p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 relative z-10 w-full">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <FaUsers />
                                    <span className="font-medium">{studentLoading ? <Spin size="small" /> : `${cls.studentsCount} Students`}</span>
                                </div>
                                <button
                                    disabled={studentLoading || cls.studentsCount === 0}
                                    onClick={() => handleOpenAttendance(cls)}
                                    className="px-4 py-2 bg-emerald-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 icon-flex"
                                >
                                    <FaRegCheckSquare /> Mark Attendance
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                    <p className="text-gray-500">No classes assigned yet.</p>
                </div>
            )}

            <Drawer
                title={`Mark Attendance: ${selectedClass?.name}`}
                placement="right"
                width={500}
                onClose={() => setIsDrawerOpen(false)}
                open={isDrawerOpen}
                extra={
                    <Space>
                        <DatePicker value={attendanceDate} onChange={(d) => d && setAttendanceDate(d)} allowClear={false} />
                        <Button type="primary" className="bg-emerald-600 font-bold px-6" onClick={handleBulkSubmit} loading={attendanceLoading}>
                            Save & Close
                        </Button>
                    </Space>
                }
            >
                <div className="mb-4 bg-emerald-50 p-4 border border-emerald-100 rounded-lg text-emerald-800 flex justify-between items-center">
                    <div>
                        <span className="font-bold block text-lg">{selectedClass?.subject}</span>
                        <span className="text-xs opacity-70">Marking for {attendanceDate.format('MMM DD, YYYY')}</span>
                    </div>
                </div>

                <div className="space-y-3">
                    {activeStudents.map((std: any) => (
                        <div key={std._id} className="flex justify-between items-center bg-gray-50 border border-gray-100 p-3 rounded-xl hover:bg-emerald-50 transition-colors">
                            <div className="flex flex-col">
                                <span className="font-bold text-gray-800">{std.firstName} {std.lastName}</span>
                                <span className="text-xs text-gray-500">Roll No: {std.rollNumber || std.admissionNumber || 'N/A'}</span>
                            </div>
                            <Radio.Group
                                buttonStyle="solid"
                                size="small"
                                value={attendanceStatus[std._id]}
                                onChange={(e) => setAttendanceStatus(prev => ({ ...prev, [std._id]: e.target.value }))}
                            >
                                <Radio.Button value="Present" className="text-emerald-600 border-emerald-500">P</Radio.Button>
                                <Radio.Button value="Absent" className="text-red-500 border-red-500">A</Radio.Button>
                                <Radio.Button value="Late" className="text-gold-500 border-yellow-500">L</Radio.Button>
                            </Radio.Group>
                        </div>
                    ))}
                </div>
            </Drawer>
        </div>
    );
};

export default StaffClassesPage;
