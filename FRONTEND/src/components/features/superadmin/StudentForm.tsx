import React, { useEffect } from 'react';
import { Form, Input, Select, DatePicker, Button, Row, Col, Divider, Upload } from 'antd';
import dayjs from 'dayjs';
import { FaSave, FaTimes, FaPlus } from 'react-icons/fa';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useSettingsStore } from '../../../store/settingsStore';


const { Option } = Select;

interface StudentFormProps {
    initialValues?: any;
    onFinish: (values: any) => void;
    onCancel: () => void;
    loading?: boolean;
}

const StudentForm: React.FC<StudentFormProps> = ({ initialValues, onFinish, onCancel, loading }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = React.useState<UploadFile[]>([]);
    const { fetchSettings, getSettingValue } = useSettingsStore();

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    // Fetch dynamic options with defaults
    const batches = getSettingValue<string[]>('academic-batches', ['2023-2024', '2024-2025', '2025-2026', '2026-2027']);
    const programs = getSettingValue<string[]>('academic-programs', ['SSLC', 'Plus Two', 'Degree', 'PG']);
    const classes = getSettingValue<string[]>('student-classes', ['10A', '10B', '11A', '11B', '12A', '12B']);

    // Convert date strings to dayjs objects for Ant Design DatePicker
    const processedInitialValues = initialValues ? {
        ...initialValues,
        dateOfBirth: initialValues.dateOfBirth ? dayjs(initialValues.dateOfBirth) : null,
        dateOfAdmission: initialValues.dateOfAdmission ? dayjs(initialValues.dateOfAdmission) : null,
    } : undefined;

    // Reset form when initialValues change
    useEffect(() => {
        if (processedInitialValues) {
            form.setFieldsValue(processedInitialValues);
        } else {
            form.resetFields();
        }
    }, [initialValues, form]);

    const handleUploadChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList.slice(-1)); // Only keep the last uploaded file
    };

    const handleFinish = (values: any) => {
        const formData = new FormData();
        Object.keys(values).forEach(key => {
            if (values[key]) {
                if (key === 'dateOfBirth' || key === 'dateOfAdmission') {
                    formData.append(key, values[key].toISOString());
                } else {
                    formData.append(key, values[key]);
                }
            }
        });

        if (fileList.length > 0 && fileList[0].originFileObj) {
            formData.append('file', fileList[0].originFileObj);
        }

        onFinish(formData); // Parent must handle FormData
    };

    const uploadButton = (
        <div className="flex flex-col items-center justify-center text-gray-500">
            <FaPlus className="text-xl mb-2" />
            <div>Upload Photo</div>
        </div>
    );

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={processedInitialValues}
            className="pb-20"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                    {initialValues ? 'Edit Student' : 'New Student Admission'}
                </h2>
            </div>

            <Row gutter={16} align="middle">
                <Col span={6}>
                    <Form.Item label="Student Photo">
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={handleUploadChange}
                            beforeUpload={() => false} // Prevent auto upload
                            maxCount={1}
                        >
                            {fileList.length >= 1 ? null : uploadButton}
                        </Upload>
                    </Form.Item>
                </Col>
                <Col span={18}>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-blue-700 text-sm">
                        <p><strong>Note:</strong> Upload a clear passport size photograph.</p>
                        <p>Allowed formats: JPG, PNG. Max size: 2MB.</p>
                    </div>
                </Col>
            </Row>

            <Divider orientation="left">Personal Information</Divider>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
                        <Input placeholder="John" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
                        <Input placeholder="Doe" />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={6}>
                    <Form.Item name="dateOfBirth" label="Date of Birth" rules={[{ required: true }]}>
                        <DatePicker className="w-full" />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item name="dateOfAdmission" label="Date of Admission" rules={[{ required: true }]}>
                        <DatePicker className="w-full" />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
                        <Select placeholder="Select Gender">
                            <Option value="Male">Male</Option>
                            <Option value="Female">Female</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item name="bloodGroup" label="Blood Group">
                        <Select placeholder="Select">
                            <Option value="A+">A+</Option>
                            <Option value="A-">A-</Option>
                            <Option value="B+">B+</Option>
                            <Option value="B-">B-</Option>
                            <Option value="O+">O+</Option>
                            <Option value="O-">O-</Option>
                            <Option value="AB+">AB+</Option>
                            <Option value="AB-">AB-</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Divider orientation="left">Academic Details</Divider>
            <Row gutter={16}>
                <Col span={6}>
                    <Form.Item name="admissionNumber" label="Admission No" rules={[{ required: true }]}>
                        <Input placeholder="SJIA..." />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item name="program" label="Program" rules={[{ required: true }]}>
                        <Select placeholder="Select Program">
                            {programs.map(prog => (
                                <Option key={prog} value={prog}>{prog}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item name="batch" label="Batch" rules={[{ required: true }]}>
                        <Select placeholder="Select Batch">
                            {batches.map(batch => (
                                <Option key={batch} value={batch}>{batch}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item name="currentClass" label="Current Class" rules={[{ required: true }]}>
                        <Select placeholder="Select Class">
                            {classes.map(cls => (
                                <Option key={cls} value={cls}>{cls}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Divider orientation="left">Contact Details</Divider>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="phone"
                        label="Phone Number"
                        rules={[
                            { required: true, message: 'Phone number is required' },
                            { pattern: /^[0-9]{10}$/, message: 'Phone number must be exactly 10 digits' }
                        ]}
                    >
                        <Input maxLength={10} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email' }]}>
                        <Input />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item name="address" label="Address" rules={[{ required: true }]}>
                <Input.TextArea rows={2} />
            </Form.Item>

            <Row gutter={16}>
                <Col span={8}>
                    <Form.Item name="city" label="City" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name="state" label="State" rules={[{ required: true }]}>
                        <Input defaultValue="Kerala" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="pincode"
                        label="Pincode"
                        rules={[
                            { required: true, message: 'Pincode is required' },
                            { pattern: /^[0-9]{6}$/, message: 'Pincode must be exactly 6 digits' }
                        ]}
                    >
                        <Input maxLength={6} />
                    </Form.Item>
                </Col>
            </Row>

            <Divider orientation="left">Guardian Details</Divider>
            <Row gutter={16}>
                <Col span={8}>
                    <Form.Item name="guardianName" label="Guardian Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name="guardianRelation" label="Relation">
                        <Select>
                            <Option value="Father">Father</Option>
                            <Option value="Mother">Mother</Option>
                            <Option value="Brother">Brother</Option>
                            <Option value="other">Other</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="guardianPhone"
                        label="Guardian Phone"
                        rules={[
                            { required: true, message: 'Guardian phone is required' },
                            { pattern: /^[0-9]{10}$/, message: 'Phone number must be exactly 10 digits' }
                        ]}
                    >
                        <Input maxLength={10} />
                    </Form.Item>
                </Col>
            </Row>

            {/* Fixed Footer Buttons */}
            <div className="flex justify-end gap-3 mt-8">
                <Button onClick={onCancel} icon={<FaTimes />}>
                    Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={loading} icon={<FaSave />} className="bg-primary">
                    Save Student
                </Button>
            </div>
        </Form>
    );
};

export default StudentForm;
