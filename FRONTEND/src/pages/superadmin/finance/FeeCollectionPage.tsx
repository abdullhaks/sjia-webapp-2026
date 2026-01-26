
import React, { useState, useEffect } from 'react';
import { Card, Form, Select, Button, InputNumber, DatePicker, Table, Tag, Input } from 'antd';
import { useFinanceStore } from '../../../store/financeStore';
import { useStudentStore } from '../../../store/studentStore';
import { message } from '../../../components/common/AntdStaticProvider';
import { UserOutlined, FileTextOutlined } from '@ant-design/icons';

const { Option } = Select;

const FeeCollectionPage: React.FC = () => {
    const { fees, studentPayments, fetchFees, fetchStudentPayments, recordPayment, loading } = useFinanceStore();
    const { students, fetchStudents } = useStudentStore();

    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [selectedFeeId, setSelectedFeeId] = useState<string | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchStudents();
        fetchFees();
    }, [fetchStudents, fetchFees]);

    useEffect(() => {
        if (selectedStudentId) {
            fetchStudentPayments(selectedStudentId);
        }
    }, [selectedStudentId, fetchStudentPayments]);

    const handlePayment = async (values: any) => {
        try {
            await recordPayment({
                ...values,
                studentId: selectedStudentId,
                paymentDate: values.paymentDate.toISOString()
            });
            message.success('Payment Recorded Successfully');
            form.resetFields();
        } catch (error) {
            console.error(error);
        }
    };

    const paymentColumns = [
        { title: 'Fee', dataIndex: ['feeStructure', 'title'], key: 'fee' },
        { title: 'Amount', dataIndex: 'amountPaid', key: 'amount', render: (val: number) => `₹${val}` },
        { title: 'Date', dataIndex: 'paymentDate', key: 'date', render: (d: string) => new Date(d).toLocaleDateString() },
        { title: 'Method', dataIndex: 'method', key: 'method' },
        { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color="green">{s}</Tag> }
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
                <Card title="Record Payment" className="shadow-sm border-gray-100">
                    <Form form={form} layout="vertical" onFinish={handlePayment}>
                        <Form.Item label="Select Student" required>
                            <Select
                                showSearch
                                placeholder="Search Student"
                                optionFilterProp="children"
                                onChange={setSelectedStudentId}
                                suffixIcon={<UserOutlined />}
                            >
                                {students.map(s => (
                                    <Option key={s._id} value={s._id}>{s.firstName} {s.lastName} ({s.currentClass})</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item name="feeStructureId" label="Select Fee Type" rules={[{ required: true }]}>
                            <Select
                                placeholder="Choose Fee"
                                onChange={(value) => {
                                    setSelectedFeeId(value);
                                    const fee = fees.find(f => f._id === value);
                                    if (fee) {
                                        form.setFieldsValue({ amountPaid: fee.amount });
                                    }
                                }}
                            >
                                {fees.map(f => (
                                    <Option key={f._id} value={f._id}>{f.title} - ₹{f.amount}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item name="amountPaid" label="Amount Paid" rules={[{ required: true }]}>
                            <InputNumber
                                className="w-full"
                                min={1}
                            // Optional prefill logic based on fee selection
                            />
                        </Form.Item>

                        <Form.Item name="method" label="Payment Method" initialValue="Cash" rules={[{ required: true }]}>
                            <Select>
                                <Option value="Cash">Cash</Option>
                                <Option value="Online">Online</Option>
                                <Option value="Check">Check</Option>
                                <Option value="Transfer">Transfer</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item name="paymentDate" label="Date" rules={[{ required: true }]}>
                            <DatePicker className="w-full" />
                        </Form.Item>
                        <Form.Item name="remarks" label="Remarks">
                            <Input.TextArea rows={2} />
                        </Form.Item>

                        <Button type="primary" htmlType="submit" className="w-full" loading={loading} disabled={!selectedStudentId}>
                            Record Payment
                        </Button>
                    </Form>
                </Card>
            </div>

            <div className="lg:col-span-2">
                <Card title="Payment History" className="shadow-sm border-gray-100 min-h-[500px]">
                    {selectedStudentId ? (
                        <Table
                            dataSource={studentPayments}
                            columns={paymentColumns}
                            rowKey="_id"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <FileTextOutlined className="text-4xl mb-2" />
                            <p>Select a student to view payment history</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default FeeCollectionPage;
