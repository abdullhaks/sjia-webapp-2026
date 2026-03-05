import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, Select, Button } from 'antd';
import { message } from '../../../components/common/AntdStaticProvider';
import { CalendarOutlined } from '@ant-design/icons';
import { useLeaveStore } from '../../../store/leaveStore';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface LeaveApplyModalProps {
    visible: boolean;
    onCancel: () => void;
    onSuccess: () => void;
}

const LeaveApplyModal: React.FC<LeaveApplyModalProps> = ({ visible, onCancel, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const { createLeave } = useLeaveStore();

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                type: values.type,
                startDate: values.dates[0].format('YYYY-MM-DD'),
                endDate: values.dates[1].format('YYYY-MM-DD'),
                reason: values.reason,
            };

            await createLeave(payload);

            message.success('Leave applied successfully!');
            form.resetFields();
            onSuccess();
            onCancel();
        } catch (error) {
            message.error('Failed to apply for leave');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 text-primary">
                    <CalendarOutlined /> Apply for Leave
                </div>
            }
            open={visible}
            onCancel={onCancel}
            footer={null}
            destroyOnClose
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item name="type" label="Leave Type" rules={[{ required: true }]}>
                    <Select placeholder="Select leave type">
                        <Option value="Sick Leave">Sick Leave</Option>
                        <Option value="Casual Leave">Casual Leave</Option>
                        <Option value="Emergency Leave">Emergency Leave</Option>
                    </Select>
                </Form.Item>

                <Form.Item name="dates" label="Duration" rules={[{ required: true }]}>
                    <RangePicker className="w-full" />
                </Form.Item>

                <Form.Item name="reason" label="Reason" rules={[{ required: true }]}>
                    <TextArea rows={4} placeholder="Please mention the reason for leave" />
                </Form.Item>

                <div className="flex justify-end gap-2">
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button type="primary" htmlType="submit" loading={loading} className="bg-primary">
                        Submit Application
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default LeaveApplyModal;
