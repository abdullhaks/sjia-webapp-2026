import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, Select, Button, Space, TimePicker } from 'antd';
import { message } from '../../../components/common/AntdStaticProvider';
import { useExamStore } from '../../../store/examStore';


const { Option } = Select;
const { TextArea } = Input;

interface ExamCreateFormProps {
    visible: boolean;
    onCancel: () => void;
    onSuccess: () => void;
}

const ExamCreateForm: React.FC<ExamCreateFormProps> = ({ visible, onCancel, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const { createExam } = useExamStore();

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            // Transform date objects to strings
            const payload = {
                ...values,
                startDate: values.startDate.format('YYYY-MM-DD'),
                endDate: values.endDate.format('YYYY-MM-DD'),
                schedule: values.schedule ? values.schedule.map((s: any) => ({
                    ...s,
                    date: s.date.format('YYYY-MM-DD'),
                    startTime: s.startTime.format('HH:mm'),
                })) : []
            };

            console.log('Creating Exam Payload:', payload);
            await createExam(payload);

            message.success('Exam Scheduled Successfully!');
            form.resetFields();
            onSuccess();
            onCancel(); // Close modal on success
        } catch (error) {
            console.error(error);
            message.error('Failed to schedule exam');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 text-primary text-xl">
                    Schedule New Exam
                </div>
            }
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={800}
            destroyOnClose
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item name="title" label="Exam Title" rules={[{ required: true }]}>
                        <Input placeholder="e.g. Mid-Term Examination 2024" />
                    </Form.Item>
                    <Form.Item name="type" label="Exam Type" rules={[{ required: true }]}>
                        <Select placeholder="Select Type">
                            <Option value="Internal">Internal</Option>
                            <Option value="Semester">Semester</Option>
                            <Option value="External">External</Option>
                        </Select>
                    </Form.Item>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item name="startDate" label="Start Date" rules={[{ required: true }]}>
                        <DatePicker className="w-full" />
                    </Form.Item>
                    <Form.Item name="endDate" label="End Date" rules={[{ required: true }]}>
                        <DatePicker className="w-full" />
                    </Form.Item>
                </div>

                <Form.Item name="classes" label="Participating Classes" rules={[{ required: true }]}>
                    <Select mode="multiple" placeholder="Select Classes">
                        <Option value="SSLC">SSLC</Option>
                        <Option value="Plus Two - Science">Plus Two - Science</Option>
                        <Option value="Plus Two - Commerce">Plus Two - Commerce</Option>
                        <Option value="Degree">Degree</Option>
                    </Select>
                </Form.Item>

                <Form.Item label="Subject Schedule" className="mb-0">
                    <Form.List name="schedule">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline" className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'subjectName']}
                                            rules={[{ required: true, message: 'Missing subject' }]}
                                            className="mb-0 w-40"
                                        >
                                            <Input placeholder="Subject" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'date']}
                                            rules={[{ required: true, message: 'Missing date' }]}
                                            className="mb-0 w-32"
                                        >
                                            <DatePicker placeholder="Date" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'startTime']}
                                            rules={[{ required: true, message: 'Missing time' }]}
                                            className="mb-0 w-28"
                                        >
                                            <TimePicker format="HH:mm" placeholder="Time" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'duration']}
                                            rules={[{ required: true, message: 'Missing duration' }]}
                                            className="mb-0 w-24"
                                        >
                                            <Input placeholder="Duration" />
                                        </Form.Item>
                                        <Button danger onClick={() => remove(name)} className="text-red-500 hover:text-red-700">Remove</Button>
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block >
                                        Add Subject
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form.Item>

                <Form.Item name="description" label="Description">
                    <TextArea rows={2} />
                </Form.Item>

                <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button type="primary" htmlType="submit" loading={loading} className="bg-primary">
                        Create Schedule
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default ExamCreateForm;
