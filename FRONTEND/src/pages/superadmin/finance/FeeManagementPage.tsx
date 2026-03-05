
import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, InputNumber, Select, DatePicker, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useFinanceStore } from '../../../store/financeStore';
// import { useStaffStore } from '../../../store/staffStore'; // If classes list needed, but usually harcoded or fetched from separate util
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const { Option } = Select;

const FeeManagementPage: React.FC = () => {
    const { fees, loading, fetchFees, createFee } = useFinanceStore();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchFees();
    }, [fetchFees]);

    const handleCreate = async (values: any) => {
        try {
            await createFee({
                ...values,
                dueDate: values.dueDate.toISOString()
            });
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.error(error);
        }
    };

    const columns = [
        { title: 'Fee Title', dataIndex: 'title', key: 'title' },
        { title: 'Class', dataIndex: 'class', key: 'class', render: (text: string) => <Tag color="blue">{text}</Tag> },
        { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (val: number) => `₹${val.toLocaleString()}` },
        { title: 'Frequency', dataIndex: 'frequency', key: 'frequency' },
        { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate', render: (val: string) => new Date(val).toLocaleDateString() },
        {
            title: 'Actions', key: 'actions', render: () => (
                <div className="flex gap-2">
                    <Button icon={<EditOutlined />} size="small" />
                    <Button icon={<DeleteOutlined />} size="small" danger />
                </div>
            )
        }
    ];

    if (loading && (!fees || fees.length === 0)) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Fee Structures</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
                    Create New Fee
                </Button>
            </div>

            <Card className="shadow-sm rounded-2xl border-gray-100">
                <Table dataSource={fees} columns={columns} rowKey="_id" />
            </Card>

            <Modal
                title="Create New Fee Structure"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleCreate}>
                    <Form.Item name="title" label="Fee Title" rules={[{ required: true }]}>
                        <Input placeholder="e.g. Term 1 Tuition Fee" />
                    </Form.Item>
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="amount" label="Amount (₹)" rules={[{ required: true }]}>
                            <InputNumber className="w-full" min={0} />
                        </Form.Item>
                        <Form.Item name="class" label="Class" rules={[{ required: true }]}>
                            <Select placeholder="Select Class">
                                <Option value="All">All Classes</Option>
                                <Option value="Class 10-A">Class 10-A</Option>
                                <Option value="Class 9-B">Class 9-B</Option>
                                {/* Populate dynamically if needed */}
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="frequency" label="Frequency" rules={[{ required: true }]}>
                            <Select>
                                <Option value="One Time">One Time</Option>
                                <Option value="Monthly">Monthly</Option>
                                <Option value="Term">Term</Option>
                                <Option value="Yearly">Yearly</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="dueDate" label="Due Date" rules={[{ required: true }]}>
                            <DatePicker className="w-full" />
                        </Form.Item>
                    </div>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" className="w-full h-10">
                        Create Fee Structure
                    </Button>
                </Form>
            </Modal>
        </div>
    );
};

export default FeeManagementPage;
