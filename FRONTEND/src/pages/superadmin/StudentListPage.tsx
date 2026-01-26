import { useState, useEffect } from 'react';
import { Table, Tag, Input, Select, Button, Tooltip, Modal } from 'antd';
import Avatar from '../../components/common/Avatar';

import {
    FaUserGraduate,
    FaPlus,
    FaSearch,
    FaEdit,
    FaTrash,
    FaFilter,
    FaInbox,
    FaEye
} from 'react-icons/fa';
import Card from '../../components/common/Card';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StudentForm from '../../components/features/superadmin/StudentForm';
import StudentDetailModal from '../../components/common/StudentDetailModal';
import { useStudentStore } from '../../store/studentStore';
import { Student } from '../../services/api/student.api';
import { message } from '../../components/common/AntdStaticProvider';

const StudentListPage = () => {
    const [searchText, setSearchText] = useState('');
    const [programFilter, setProgramFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('active');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; student: Student | null }>({
        open: false,
        student: null,
    });
    const [detailModal, setDetailModal] = useState<{ open: boolean; student: Student | null }>({
        open: false,
        student: null,
    });
    const [councilModal, setCouncilModal] = useState<{ student: Student | null; position: string }>({
        student: null,
        position: '',
    });

    const { students, loading, error, fetchStudents, createStudent, updateStudent, deleteStudent } = useStudentStore();

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    useEffect(() => {
        if (error) {
            message.error(error);
        }
    }, [error]);

    const handleAddStudent = () => {
        setEditingStudent(null);
        setIsModalOpen(true);
    };

    const handleEditStudent = (student: Student) => {
        setEditingStudent(student);
        setIsModalOpen(true);
    };

    const handleViewStudent = (student: Student) => {
        setDetailModal({ open: true, student });
    };

    const handleDeleteStudent = (student: Student) => {
        setDeleteConfirm({ open: true, student });
    };

    const confirmDelete = async () => {
        if (deleteConfirm.student) {
            try {
                await deleteStudent(deleteConfirm.student._id);
                message.success('Student deleted successfully');
                setDeleteConfirm({ open: false, student: null });
            } catch (error) {
                message.error('Failed to delete student');
            }
        }
    };

    const handleFormSubmit = async (values: any) => {
        try {
            if (editingStudent) {
                await updateStudent(editingStudent._id, values);
                message.success('Student updated successfully');
            } else {
                await createStudent(values);
                message.success('Student created successfully');
            }
            setIsModalOpen(false);
            setEditingStudent(null);
        } catch (error) {
            // Error already handled in store
        }
    };

    const handleFormCancel = () => {
        setIsModalOpen(false);
        setEditingStudent(null);
    };

    // Filter students based on search and filters
    const filteredStudents = students.filter((student) => {
        const matchesSearch =
            searchText === '' ||
            student.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
            student.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
            student.admissionNumber.toLowerCase().includes(searchText.toLowerCase());

        const matchesProgram = programFilter === 'all' || student.program === programFilter;
        const matchesStatus = statusFilter === 'active' ? student.status === 'Active' : student.status === statusFilter;

        return matchesSearch && matchesProgram && matchesStatus;
    });

    const columns = [
        {
            title: 'Adm. No',
            dataIndex: 'admissionNumber',
            key: 'admissionNumber',
            render: (text: string) => <span className="font-semibold text-primary">{text}</span>
        },
        {
            title: 'Name',
            dataIndex: 'firstName',
            key: 'name',
            render: (_: string, record: Student) => (
                <div className="flex items-center gap-2">
                    <Avatar
                        src={record.photoUrl}
                        alt={`${record.firstName} ${record.lastName}`}
                        size="sm"
                        className="bg-primary/10 text-primary border-none shadow-none"
                    />
                    <div>
                        <div className="font-medium text-gray-700">{`${record.firstName} ${record.lastName}`}</div>
                        {record.councilPosition && (
                            <Tag color="gold" className="text-[10px] mt-0.5">{record.councilPosition}</Tag>
                        )}
                    </div>
                </div>
            )
        },
        {
            title: 'Program',
            dataIndex: 'program',
            key: 'program',
        },
        {
            title: 'Batch',
            dataIndex: 'batch',
            key: 'batch',
            render: (text: string) => <Tag color="blue">{text}</Tag>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'green';
                if (status === 'Graduated') color = 'purple';
                if (status === 'Suspended') color = 'red';
                if (status === 'Left') color = 'orange';
                return <Tag color={color}>{status || 'Active'}</Tag>;
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Student) => (
                <div className="flex gap-2">
                    <Tooltip title="Assign Council Role">
                        <Button
                            type="text"
                            shape="circle"
                            className="text-amber-500 hover:text-amber-600 hover:bg-amber-50"
                            icon={<FaUserGraduate />}
                            onClick={() => setCouncilModal({ student: record, position: record.councilPosition || '' })}
                        />
                    </Tooltip>
                    <Tooltip title="View Details">
                        <Button
                            type="text"
                            shape="circle"
                            icon={<FaEye className="text-gray-500" />}
                            onClick={() => handleViewStudent(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button
                            type="text"
                            shape="circle"
                            icon={<FaEdit className="text-blue-500" />}
                            onClick={() => handleEditStudent(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button
                            type="text"
                            shape="circle"
                            icon={<FaTrash className="text-red-500" />}
                            onClick={() => handleDeleteStudent(record)}
                        />
                    </Tooltip>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaUserGraduate className="text-primary" /> Student Management
                    </h1>
                    <p className="text-gray-500">Manage all student records, admissions, and academic details.</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        type="primary"
                        size="large"
                        className="bg-primary hover:bg-primary-600 flex items-center gap-2"
                        onClick={handleAddStudent}
                    >
                        <FaPlus /> Add Student
                    </Button>
                </div>
            </div>

            <Card className="p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <Input
                        prefix={<FaSearch className="text-gray-400" />}
                        placeholder="Search by name or admission no..."
                        className="md:w-64"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <Select
                        value={programFilter}
                        className="md:w-40"
                        onChange={setProgramFilter}
                        options={[
                            { value: 'all', label: 'All Programs' },
                            { value: 'SSLC', label: 'SSLC' },
                            { value: 'Plus Two', label: 'Plus Two' },
                            { value: 'Degree', label: 'Degree' },
                        ]}
                    />
                    <Select
                        value={statusFilter}
                        className="md:w-32"
                        onChange={setStatusFilter}
                        options={[
                            { value: 'active', label: 'Active' },
                            { value: 'Graduated', label: 'Graduated' },
                            { value: 'Suspended', label: 'Suspended' },
                        ]}
                    />
                    <Button icon={<FaFilter />}>More Filters</Button>
                </div>

                {loading && students.length === 0 ? (
                    <LoadingSpinner size="lg" />
                ) : filteredStudents.length === 0 ? (
                    <EmptyState
                        icon={<FaInbox />}
                        title="No Students Found"
                        description={
                            searchText || programFilter !== 'all' || statusFilter !== 'active'
                                ? 'Try adjusting your filters'
                                : 'Start by adding your first student'
                        }
                        action={
                            searchText || programFilter !== 'all' || statusFilter !== 'active' ? null : (
                                <Button type="primary" className="bg-primary" onClick={handleAddStudent}>
                                    <FaPlus className="inline mr-2" />
                                    Add First Student
                                </Button>
                            )
                        }
                    />
                ) : (
                    <Table
                        columns={columns}
                        dataSource={filteredStudents}
                        rowKey="_id"
                        pagination={{ pageSize: 10 }}
                        className="glass-table"
                        loading={loading}
                    />
                )}
            </Card>

            {/* Student Form Modal */}
            <Modal
                open={isModalOpen}
                onCancel={handleFormCancel}
                footer={null}
                width={800}
                destroyOnClose
            >
                <StudentForm
                    initialValues={editingStudent || undefined}
                    onFinish={handleFormSubmit}
                    onCancel={handleFormCancel}
                    loading={loading}
                />
            </Modal>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={deleteConfirm.open}
                title="Delete Student"
                message={`Are you sure you want to delete ${deleteConfirm.student?.firstName} ${deleteConfirm.student?.lastName}? This action cannot be undone.`}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteConfirm({ open: false, student: null })}
                loading={loading}
                danger
            />

            {/* Detail Modal */}
            <StudentDetailModal
                student={detailModal.student}
                isOpen={detailModal.open}
                onClose={() => setDetailModal({ open: false, student: null })}
            />

            {/* Council Assignment Modal */}
            <Modal
                title="Assign Council Position"
                open={!!councilModal.student}
                onCancel={() => setCouncilModal({ student: null, position: '' })}
                onOk={async () => {
                    if (councilModal.student) {
                        try {
                            await updateStudent(councilModal.student._id, { councilPosition: councilModal.position });
                            message.success('Council position assigned successfully');
                            setCouncilModal({ student: null, position: '' });
                            fetchStudents(); // Refresh list
                        } catch (error) {
                            message.error('Failed to assign position');
                        }
                    }
                }}
            >
                <div className="py-4">
                    <p className="mb-2 text-gray-600">Assign a leadership role to <strong>{councilModal.student?.firstName} {councilModal.student?.lastName}</strong></p>
                    <Input
                        placeholder="e.g. Chairman, General Secretary"
                        value={councilModal.position}
                        onChange={(e) => setCouncilModal({ ...councilModal, position: e.target.value })}
                    />
                    <p className="mt-2 text-xs text-gray-400">Leave empty to remove position.</p>
                </div>
            </Modal>
        </div>
    );
};

export default StudentListPage;
