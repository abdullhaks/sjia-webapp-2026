import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, InputNumber, Select, Tag, DatePicker } from 'antd';
import { PlusOutlined, DeleteOutlined, CreditCardOutlined } from '@ant-design/icons';
import { useSalaryStore } from '../../../store/salaryStore';
import { useStaffStore } from '../../../store/staffStore';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { message } from '../../../components/common/AntdStaticProvider';

const { Option } = Select;

const SalaryManagementPage: React.FC = () => {
    const { salaries, loading: salaryLoading, fetchSalaries, createSalary, updateSalary, deleteSalary } = useSalaryStore();
    const { staff, loading: staffLoading, fetchStaff } = useStaffStore();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchSalaries();
        fetchStaff();
    }, [fetchSalaries, fetchStaff]);

    const handleCreate = async (values: any) => {
        try {
            const date = values.paymentDate ? values.paymentDate.toISOString() : undefined;
            await createSalary({
                ...values,
                paymentDate: date,
            });
            setIsModalVisible(false);
            form.resetFields();
            message.success('Salary record created successfully');
        } catch (error) {
            console.error(error);
        }
    };

    const handleMarkAsPaid = async (id: string) => {
        try {
            await updateSalary(id, { status: 'Paid', paymentDate: new Date().toISOString() });
            message.success('Salary marked as paid');
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteSalary(id);
            message.success('Salary record deleted');
        } catch (error) {
            console.error(error);
        }
    };

    const columns = [
        {
            title: 'Staff Member',
            key: 'staff',
            render: (_: any, record: any) => record.staffId ? `${record.staffId.firstName} ${record.staffId.lastName}` : 'Unknown'
        },
        { title: 'Month', dataIndex: 'month', key: 'month' },
        { title: 'Net Salary', dataIndex: 'netSalary', key: 'netSalary', render: (val: number) => `₹${val?.toLocaleString()}` },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => <Tag color={status === 'Paid' ? 'green' : 'orange'}>{status}</Tag>
        },
        { title: 'Payment Date', dataIndex: 'paymentDate', key: 'paymentDate', render: (val: string) => val ? new Date(val).toLocaleDateString() : 'Pending' },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <div className="flex gap-2">
                    {record.status === 'Pending' && (
                        <Button icon={<CreditCardOutlined />} size="small" type="primary" onClick={() => handleMarkAsPaid(record._id)}>
                            Pay
                        </Button>
                    )}
                    <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleDelete(record._id)} />
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Salary Management</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)} className="bg-primary hover:bg-primary-600">
                    Generate Salary
                </Button>
            </div>

            <Card className="shadow-sm rounded-2xl border-gray-100">
                {(salaryLoading || staffLoading) && (!salaries || salaries.length === 0) ? (
                    <LoadingSpinner />
                ) : (
                    <Table dataSource={salaries} columns={columns} rowKey="_id" />
                )}
            </Card>

            <Modal
                title="Generate Salary Record"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreate}
                    onValuesChange={(changedValues, allValues) => {
                        if (changedValues.baseSalary !== undefined || changedValues.bonuses !== undefined || changedValues.deductions !== undefined) {
                            const net = (allValues.baseSalary || 0) + (allValues.bonuses || 0) - (allValues.deductions || 0);
                            form.setFieldsValue({ netSalary: net });
                        }
                    }}
                >
                    <Form.Item name="staffId" label="Staff Member" rules={[{ required: true }]}>
                        <Select showSearch placeholder="Select Staff" optionFilterProp="children">
                            {staff.map(s => (
                                <Option key={s._id} value={s._id}>{s.firstName} {s.lastName} - {s.designation}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="month" label="Month (YYYY-MM)" rules={[{ required: true }]}>
                            <DatePicker picker="month" className="w-full" />
                        </Form.Item>
                        <Form.Item name="baseSalary" label="Base Salary (₹)" rules={[{ required: true }]}>
                            <InputNumber className="w-full" min={0} />
                        </Form.Item>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="bonuses" label="Bonuses (₹)" initialValue={0}>
                            <InputNumber className="w-full" min={0} />
                        </Form.Item>
                        <Form.Item name="deductions" label="Deductions (₹)" initialValue={0}>
                            <InputNumber className="w-full" min={0} />
                        </Form.Item>
                    </div>
                    <Form.Item name="netSalary" label="Net Salary (₹)" rules={[{ required: true }]}>
                        <InputNumber className="w-full" min={0} readOnly />
                    </Form.Item>
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="status" label="Status" initialValue="Pending">
                            <Select>
                                <Option value="Pending">Pending</Option>
                                <Option value="Paid">Paid</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="paymentMethod" label="Payment Method">
                            <Select allowClear>
                                <Option value="Cash">Cash</Option>
                                <Option value="Transfer">Transfer</Option>
                                <Option value="Cheque">Cheque</Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <Button type="primary" htmlType="submit" className="w-full h-10">
                        Generate Salary
                    </Button>
                </Form>
            </Modal>
        </div>
    );
};

export default SalaryManagementPage;
