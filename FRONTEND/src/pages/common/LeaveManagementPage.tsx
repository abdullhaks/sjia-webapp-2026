import React, { useState } from 'react';
import { Tabs, Button, Card } from 'antd';
import { PlusOutlined, UnorderedListOutlined, HistoryOutlined } from '@ant-design/icons';
import LeaveRequestsTable from '../../components/features/leave/LeaveRequestsTable';
import MyLeaveHistory from '../../components/features/leave/MyLeaveHistory';
import LeaveApplyModal from '../../components/features/leave/LeaveApplyModal';

const { TabPane } = Tabs;

const LeaveManagementPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('requests'); // Default to requests (logic can be role based)

    // TODO: Get user role from auth context
    const userRole = 'SUPERADMIN'; // Mock for now

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
                <Card>
                    <div className="text-gray-500">Casual Leave</div>
                    <div className="text-2xl font-bold text-blue-600">12 / 12</div>
                </Card>
                <Card>
                    <div className="text-gray-500">Sick Leave</div>
                    <div className="text-2xl font-bold text-red-600">8 / 10</div>
                </Card>
                <Card>
                    <div className="text-gray-500">Pending Requests</div>
                    <div className="text-2xl font-bold text-amber-600">1</div>
                </Card>
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
