import { useState, useEffect } from 'react';
import { Table, Tag, Input, Select, Button, Tooltip, Modal } from 'antd';
import Avatar from '../../components/common/Avatar';

import {
    FaChalkboardTeacher,
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
import StaffForm from '../../components/features/superadmin/StaffForm';
import StaffDetailModal from '../../components/common/StaffDetailModal';
import { useStaffStore } from '../../store/staffStore';
import { Staff } from '../../services/api/staff.api';
import { message } from '../../components/common/AntdStaticProvider';

const StaffListPage = () => {
    const [searchText, setSearchText] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('active');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; staff: Staff | null }>({
        open: false,
        staff: null,
    });
    const [detailModal, setDetailModal] = useState<{ open: boolean; staff: Staff | null }>({
        open: false,
        staff: null,
    });

    const { staff, loading, error, fetchStaff, createStaff, updateStaff, deleteStaff } = useStaffStore();

    useEffect(() => {
        fetchStaff();
    }, [fetchStaff]);

    useEffect(() => {
        if (error) {
            message.error(error);
        }
    }, [error]);

    const handleAddStaff = () => {
        setEditingStaff(null);
        setIsModalOpen(true);
    };

    const handleEditStaff = (staffMember: Staff) => {
        setEditingStaff(staffMember);
        setIsModalOpen(true);
    };

    const handleViewStaff = (staffMember: Staff) => {
        setDetailModal({ open: true, staff: staffMember });
    };

    const handleDeleteStaff = (staffMember: Staff) => {
        setDeleteConfirm({ open: true, staff: staffMember });
    };

    const confirmDelete = async () => {
        if (deleteConfirm.staff) {
            try {
                await deleteStaff(deleteConfirm.staff._id);
                message.success('Staff member deleted successfully');
                setDeleteConfirm({ open: false, staff: null });
            } catch (error) {
                message.error('Failed to delete staff member');
            }
        }
    };

    const handleFormSubmit = async (values: any) => {
        try {
            if (editingStaff) {
                await updateStaff(editingStaff._id, values);
                message.success('Staff member updated successfully');
            } else {
                await createStaff(values);
                message.success('Staff member created successfully');
            }
            setIsModalOpen(false);
            setEditingStaff(null);
        } catch (error) {
            // Error already handled in store
        }
    };

    const handleFormCancel = () => {
        setIsModalOpen(false);
        setEditingStaff(null);
    };

    // Filter staff based on search and filters
    const filteredStaff = staff.filter((member) => {
        const matchesSearch =
            searchText === '' ||
            member.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
            member.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
            member.employeeId.toLowerCase().includes(searchText.toLowerCase());

        const matchesDepartment = departmentFilter === 'all' || member.department === departmentFilter;
        const matchesStatus = statusFilter === 'active' ? member.status === 'Active' : member.status === statusFilter;

        return matchesSearch && matchesDepartment && matchesStatus;
    });

    const columns = [
        {
            title: 'Emp. ID',
            dataIndex: 'employeeId',
            key: 'employeeId',
            render: (text: string) => <span className="font-semibold text-primary">{text}</span>
        },
        {
            title: 'Name',
            dataIndex: 'firstName',
            key: 'name',
            render: (_: string, record: Staff) => (
                <div className="flex items-center gap-2">
                    <Avatar
                        src={record.photoUrl}
                        alt={`${record.firstName} ${record.lastName}`}
                        size="sm"
                        className="bg-purple-100 text-purple-600 border-none shadow-none"
                    />
                    <span className="font-medium text-gray-700">{`${record.firstName} ${record.lastName}`}</span>
                </div>
            )
        },
        {
            title: 'Designation',
            dataIndex: 'designation',
            key: 'designation',
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
            render: (text: string) => <Tag color="cyan">{text || 'N/A'}</Tag>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'green';
                if (status === 'Resigned') color = 'gray';
                if (status === 'Terminated') color = 'red';
                if (status === 'On Leave') color = 'orange';
                return <Tag color={color}>{status || 'Active'}</Tag>;
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Staff) => (
                <div className="flex gap-2">
                    <Tooltip title="View Details">
                        <Button
                            type="text"
                            shape="circle"
                            icon={<FaEye className="text-gray-500" />}
                            onClick={() => handleViewStaff(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button
                            type="text"
                            shape="circle"
                            icon={<FaEdit className="text-blue-500" />}
                            onClick={() => handleEditStaff(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button
                            type="text"
                            shape="circle"
                            icon={<FaTrash className="text-red-500" />}
                            onClick={() => handleDeleteStaff(record)}
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
                        <FaChalkboardTeacher className="text-primary" /> Staff Management
                    </h1>
                    <p className="text-gray-500">Manage teachers, administrators, and support staff records.</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        type="primary"
                        size="large"
                        className="bg-primary hover:bg-primary-600 flex items-center gap-2"
                        onClick={handleAddStaff}
                    >
                        <FaPlus /> Add Staff
                    </Button>
                </div>
            </div>

            <Card className="p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <Input
                        prefix={<FaSearch className="text-gray-400" />}
                        placeholder="Search by name or emp ID..."
                        className="md:w-64"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <Select
                        value={departmentFilter}
                        className="md:w-40"
                        onChange={setDepartmentFilter}
                        options={[
                            { value: 'all', label: 'All Depts' },
                            { value: 'Science', label: 'Science' },
                            { value: 'Maths', label: 'Maths' },
                            { value: 'Administration', label: 'Admin' },
                        ]}
                    />
                    <Select
                        value={statusFilter}
                        className="md:w-32"
                        onChange={setStatusFilter}
                        options={[
                            { value: 'active', label: 'Active' },
                            { value: 'On Leave', label: 'On Leave' },
                        ]}
                    />
                    <Button icon={<FaFilter />}>More Filters</Button>
                </div>

                {loading && staff.length === 0 ? (
                    <LoadingSpinner size="lg" />
                ) : filteredStaff.length === 0 ? (
                    <EmptyState
                        icon={<FaInbox />}
                        title="No Staff Found"
                        description={
                            searchText || departmentFilter !== 'all' || statusFilter !== 'active'
                                ? 'Try adjusting your filters'
                                : 'Start by adding your first staff member'
                        }
                        action={
                            searchText || departmentFilter !== 'all' || statusFilter !== 'active' ? null : (
                                <Button type="primary" className="bg-primary" onClick={handleAddStaff}>
                                    <FaPlus className="inline mr-2" />
                                    Add First Staff Member
                                </Button>
                            )
                        }
                    />
                ) : (
                    <Table
                        columns={columns}
                        dataSource={filteredStaff}
                        rowKey="_id"
                        pagination={{ pageSize: 10 }}
                        className="glass-table"
                        loading={loading}
                    />
                )}
            </Card>

            {/* Staff Form Modal */}
            <Modal
                open={isModalOpen}
                onCancel={handleFormCancel}
                footer={null}
                width={800}
                destroyOnClose
            >
                <StaffForm
                    initialValues={editingStaff || undefined}
                    onFinish={handleFormSubmit}
                    onCancel={handleFormCancel}
                    loading={loading}
                />
            </Modal>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={deleteConfirm.open}
                title="Delete Staff Member"
                message={`Are you sure you want to delete ${deleteConfirm.staff?.firstName} ${deleteConfirm.staff?.lastName}? This action cannot be undone.`}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteConfirm({ open: false, staff: null })}
                loading={loading}
                danger
            />

            {/* Detail Modal */}
            <StaffDetailModal
                staff={detailModal.staff}
                isOpen={detailModal.open}
                onClose={() => setDetailModal({ open: false, staff: null })}
            />
        </div>
    );
};

export default StaffListPage;
