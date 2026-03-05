import { Table, Tag, Button, Tooltip, Input, Select, Card, Space, Modal, DatePicker } from 'antd';
import { EyeOutlined, CheckOutlined, CloseOutlined, SearchOutlined, DeleteOutlined, CalendarOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useAdmissionStore } from '../../store/admissionStore';
import { Admission } from '../../services/api/admission.api';
import { message } from '../../components/common/AntdStaticProvider';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { FaInbox } from 'react-icons/fa';
import AdmissionDetailModal from '../../components/common/AdmissionDetailModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import dayjs from 'dayjs';

const { Option } = Select;

const AdmissionListPage = () => {
    const { admissions, loading, error, fetchAdmissions, updateAdmissionStatus, deleteAdmission } = useAdmissionStore();
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [detailModal, setDetailModal] = useState<{ open: boolean; admission: Admission | null }>({ open: false, admission: null });
    const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; admission: Admission | null }>({ open: false, admission: null });

    // Status action modal
    const [statusModal, setStatusModal] = useState<{ open: boolean; admission: Admission | null; type: 'InterviewScheduled' | 'Approved' | 'Rejected' }>({ open: false, admission: null, type: 'Approved' });
    const [statusNotes, setStatusNotes] = useState('');
    const [interviewDate, setInterviewDate] = useState<dayjs.Dayjs | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => { fetchAdmissions(); }, [fetchAdmissions]);
    useEffect(() => { if (error) message.error(error); }, [error]);

    const handleScheduleInterview = (record: Admission) => {
        setStatusModal({ open: true, admission: record, type: 'InterviewScheduled' });
        setStatusNotes(''); setInterviewDate(null);
    };
    const handleApprove = (record: Admission) => {
        setStatusModal({ open: true, admission: record, type: 'Approved' });
        setStatusNotes('');
    };
    const handleReject = (record: Admission) => {
        setStatusModal({ open: true, admission: record, type: 'Rejected' });
        setRejectionReason(''); setStatusNotes('');
    };

    const handleStatusConfirm = async () => {
        if (!statusModal.admission) return;
        try {
            const payload: any = { status: statusModal.type };
            if (statusModal.type === 'InterviewScheduled') {
                if (!interviewDate) return message.error('Please select interview date & time');
                payload.interviewDate = interviewDate.toISOString();
                payload.notes = statusNotes;
            } else if (statusModal.type === 'Approved') {
                payload.notes = statusNotes;
            } else {
                if (!rejectionReason.trim()) return message.error('Rejection reason is required');
                payload.rejectionReason = rejectionReason;
                payload.notes = statusNotes;
            }
            await updateAdmissionStatus(statusModal.admission._id, payload);
            const actionLabel = statusModal.type === 'InterviewScheduled' ? 'Interview scheduled' : statusModal.type === 'Approved' ? 'Approved' : 'Rejected';
            message.success(`Application ${actionLabel} — email sent to applicant`);
            setStatusModal({ open: false, admission: null, type: 'Approved' });
        } catch { message.error('Failed to update application status'); }
    };

    const confirmDelete = async () => {
        if (deleteConfirm.admission) {
            try {
                await deleteAdmission(deleteConfirm.admission._id);
                message.success('Application deleted');
                setDeleteConfirm({ open: false, admission: null });
            } catch { message.error('Failed to delete'); }
        }
    };

    const filteredAdmissions = (admissions || []).filter((a) => {
        const matchesSearch = searchText === '' ||
            a.applicationId.toLowerCase().includes(searchText.toLowerCase()) ||
            a.studentName.toLowerCase().includes(searchText.toLowerCase()) ||
            a.parentName.toLowerCase().includes(searchText.toLowerCase());
        const matchesStatus = statusFilter === 'all' || a.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved': return 'success';
            case 'Rejected': return 'error';
            case 'InterviewScheduled': return 'warning';
            default: return 'processing';
        }
    };

    const columns = [
        { title: 'App ID', dataIndex: 'applicationId', key: 'applicationId', render: (t: string) => <span className="font-mono text-xs text-gray-500">{t}</span> },
        { title: 'Student Name', dataIndex: 'studentName', key: 'studentName', render: (t: string) => <span className="font-medium text-gray-800">{t}</span> },
        { title: 'Parent Name', dataIndex: 'parentName', key: 'parentName' },
        { title: 'Class', dataIndex: 'preferredClass', key: 'preferredClass' },
        { title: 'Phone', dataIndex: 'phone', key: 'phone' },
        { title: 'Date', dataIndex: 'createdAt', key: 'date', render: (d: string) => new Date(d).toLocaleDateString() },
        {
            title: 'Status', dataIndex: 'status', key: 'status',
            render: (status: string, record: Admission) => (
                <div>
                    <Tag color={getStatusColor(status)}>{status === 'InterviewScheduled' ? 'INTERVIEW' : status.toUpperCase()}</Tag>
                    {status === 'InterviewScheduled' && record.interviewDate && (
                        <div className="text-xs text-gray-500 mt-1">📅 {new Date(record.interviewDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                    )}
                </div>
            )
        },
        {
            title: 'Actions', key: 'actions',
            render: (_: any, record: Admission) => (
                <Space size="small">
                    <Tooltip title="View Details"><Button type="text" shape="circle" icon={<EyeOutlined />} onClick={() => setDetailModal({ open: true, admission: record })} /></Tooltip>
                    {(record.status === 'Pending' || record.status === 'InterviewScheduled') && (
                        <>
                            {record.status === 'Pending' && (
                                <Tooltip title="Schedule Interview"><Button type="text" shape="circle" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50" icon={<CalendarOutlined />} onClick={() => handleScheduleInterview(record)} /></Tooltip>
                            )}
                            <Tooltip title="Approve"><Button type="text" shape="circle" className="text-green-600 hover:text-green-700 hover:bg-green-50" icon={<CheckOutlined />} onClick={() => handleApprove(record)} /></Tooltip>
                            <Tooltip title="Reject"><Button type="text" shape="circle" className="text-red-600 hover:text-red-700 hover:bg-red-50" icon={<CloseOutlined />} onClick={() => handleReject(record)} /></Tooltip>
                        </>
                    )}
                    <Tooltip title="Delete"><Button type="text" shape="circle" className="text-gray-500 hover:text-red-600 hover:bg-red-50" icon={<DeleteOutlined />} onClick={() => setDeleteConfirm({ open: true, admission: record })} /></Tooltip>
                </Space>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Admission Applications</h1>
                    <p className="text-gray-500">Manage, schedule interviews, and review student applications</p>
                </div>
            </div>

            <Card className="p-6">
                <div className="flex flex-wrap gap-4 mb-6">
                    <Input prefix={<SearchOutlined className="text-gray-400" />} placeholder="Search by ID, Student or Parent Name" className="max-w-xs rounded-full bg-gray-50 border-none px-4 py-2" onChange={e => setSearchText(e.target.value)} value={searchText} />
                    <Select value={statusFilter} className="w-48" bordered={false} style={{ backgroundColor: '#f9fafb', borderRadius: '9999px' }} onChange={setStatusFilter}>
                        <Option value="all">All Status</Option>
                        <Option value="pending">Pending</Option>
                        <Option value="interviewscheduled">Interview Scheduled</Option>
                        <Option value="approved">Approved</Option>
                        <Option value="rejected">Rejected</Option>
                    </Select>
                </div>

                {loading && (!admissions || admissions.length === 0) ? <LoadingSpinner /> : (!filteredAdmissions || filteredAdmissions.length === 0) ? (
                    <EmptyState icon={<FaInbox />} title="No Applications Found" description={searchText || statusFilter !== 'all' ? "Try adjusting your filters" : "No admission applications received yet."} />
                ) : (
                    <Table columns={columns} dataSource={filteredAdmissions} rowKey="_id" pagination={{ pageSize: 10 }} className="glass-table" loading={loading} />
                )}
            </Card>

            <AdmissionDetailModal admission={detailModal.admission} isOpen={detailModal.open} onClose={() => setDetailModal({ open: false, admission: null })} />
            <ConfirmDialog open={deleteConfirm.open} title="Delete Application" message={`Delete application for ${deleteConfirm.admission?.studentName}? This cannot be undone.`} onConfirm={confirmDelete} onCancel={() => setDeleteConfirm({ open: false, admission: null })} loading={loading} danger />

            {/* Status Action Modal */}
            <Modal
                title={statusModal.type === 'InterviewScheduled' ? '📅 Schedule Interview' : statusModal.type === 'Approved' ? '✅ Approve Application' : '❌ Reject Application'}
                open={statusModal.open}
                onOk={handleStatusConfirm}
                onCancel={() => setStatusModal({ open: false, admission: null, type: 'Approved' })}
                confirmLoading={loading}
                okText={statusModal.type === 'InterviewScheduled' ? 'Schedule & Send Email' : statusModal.type === 'Approved' ? 'Approve & Send Email' : 'Reject & Send Email'}
                okButtonProps={{ danger: statusModal.type === 'Rejected' }}
            >
                <div className="py-4 space-y-4">
                    <p>
                        {statusModal.type === 'InterviewScheduled' ? 'Schedule an interview for' : statusModal.type === 'Approved' ? 'Approve application for' : 'Reject application for'}
                        {' '}<strong>{statusModal.admission?.studentName}</strong>?
                    </p>
                    <p className="text-gray-500 text-sm">An email will be sent to <strong>{statusModal.admission?.email}</strong> automatically.</p>

                    {statusModal.type === 'InterviewScheduled' && (
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">Interview Date & Time *</label>
                            <DatePicker showTime format="YYYY-MM-DD HH:mm" className="w-full" value={interviewDate} onChange={(date) => setInterviewDate(date)} placeholder="Select date and time" />
                        </div>
                    )}

                    {statusModal.type === 'Rejected' && (
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">Reason for Rejection *</label>
                            <Input.TextArea rows={3} placeholder="Enter rejection reason..." value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} />
                        </div>
                    )}

                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Notes (Optional)</label>
                        <Input.TextArea rows={3} placeholder="Additional notes for the applicant..." value={statusNotes} onChange={e => setStatusNotes(e.target.value)} />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdmissionListPage;
