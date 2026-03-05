import React, { useState } from 'react';
import { Tabs, Button, Card } from 'antd';
import { PlusOutlined, UnorderedListOutlined, HistoryOutlined } from '@ant-design/icons';
import LeaveRequestsTable from '../../components/features/leave/LeaveRequestsTable';
import MyLeaveHistory from '../../components/features/leave/MyLeaveHistory';
import LeaveApplyModal from '../../components/features/leave/LeaveApplyModal';
import { useAuthStore } from '../../store/authStore';
import { useLeaveStore } from '../../store/leaveStore';

const { TabPane } = Tabs;

const LeaveManagementPage: React.FC = () => {
    const { user } = useAuthStore();
    const userRole = user?.role?.toUpperCase() || '';

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(userRole === 'SUPERADMIN' ? 'requests' : 'my-leaves');

    const { leaves, fetchAllLeaves } = useLeaveStore();

    React.useEffect(() => {
        if (userRole === 'SUPERADMIN') {
            fetchAllLeaves();
        }
    }, [userRole, fetchAllLeaves]);

    // Derived stats
    const pendingCount = leaves.filter(l => l.status === 'Pending').length;
    const approvedCount = leaves.filter(l => l.status === 'Approved').length;
    const rejectedCount = leaves.filter(l => l.status === 'Rejected').length;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Leave Management</h1>
                    <p className="text-gray-500">Manage leaves and approvals</p>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    className="bg-primary"
                    onClick={() => setIsModalOpen(true)}
                >
                    Apply Leave
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {userRole === 'SUPERADMIN' ? (
                    <>
                        <Card>
                            <div className="text-gray-500">Total Pending</div>
                            <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
                        </Card>
                        <Card>
                            <div className="text-gray-500">Total Approved</div>
                            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
                        </Card>
                        <Card>
                            <div className="text-gray-500">Total Rejected</div>
                            <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
                        </Card>
                    </>
                ) : (
                    <>
                        <Card>
                            <div className="text-gray-500">Casual Leave</div>
                            <div className="text-2xl font-bold text-blue-600">12 / 12</div>
                        </Card>
                        <Card>
                            <div className="text-gray-500">Sick Leave</div>
                            <div className="text-2xl font-bold text-red-600">8 / 10</div>
                        </Card>
                        <Card>
                            <div className="text-gray-500">My Pending</div>
                            <div className="text-2xl font-bold text-amber-600">0</div>
                        </Card>
                    </>
                )}
            </div>

            <Card className="p-4">
                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    {userRole === 'SUPERADMIN' && (
                        <TabPane
                            tab={<span><UnorderedListOutlined /> Leave Requests</span>}
                            key="requests"
                        >
                            <div className="pt-4">
                                <LeaveRequestsTable />
                            </div>
                        </TabPane>
                    )}
                    <TabPane
                        tab={<span><HistoryOutlined /> My Leaves</span>}
                        key="my-leaves"
                    >
                        <div className="pt-4">
                            <MyLeaveHistory />
                        </div>
                    </TabPane>
                </Tabs>
            </Card>

            <LeaveApplyModal
                visible={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onSuccess={() => {/* Refresh Data */ }}
            />
        </div>
    );
};

export default LeaveManagementPage;
