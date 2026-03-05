import { Form, Input, Select, DatePicker, Button, Row, Col, Divider, InputNumber, Upload, Checkbox } from 'antd';
import dayjs from 'dayjs';
import { FaSave, FaTimes, FaPlus } from 'react-icons/fa';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useSettingsStore } from '../../../store/settingsStore';
import React, { useEffect } from 'react';

const { Option } = Select;

interface StaffFormProps {
    initialValues?: any;
    onFinish: (values: any) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

const StaffForm: React.FC<StaffFormProps> = ({ initialValues, onFinish, onCancel, loading }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = React.useState<UploadFile[]>([]);
    const { fetchSettings, getSettingValue } = useSettingsStore();

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const departments = getSettingValue<string[]>('staff-departments', ['Science', 'Maths', 'Humanities', 'Languages', 'Administration']);

    // Convert date string to dayjs object for Ant Design DatePicker
    const processedInitialValues = initialValues ? {
        ...initialValues,
        joiningDate: initialValues.joiningDate ? dayjs(initialValues.joiningDate) : null,
    } : undefined;

    // Reset form when initialValues change (important for modal reopening with different data)
    useEffect(() => {
        if (processedInitialValues) {
            form.setFieldsValue(processedInitialValues);
            if (processedInitialValues.photoUrl) {
                setFileList([{
                    uid: '-1',
                    name: 'Current Photo',
                    status: 'done',
                    url: processedInitialValues.photoUrl,
                }]);
            } else {
                setFileList([]);
            }
        } else {
            form.resetFields();
            setFileList([]);
        }
    }, [initialValues, form]);

    const handleUploadChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList.slice(-1));
    };

    const handleFinish = async (values: any) => {
        const formData = new FormData();
        Object.keys(values).forEach(key => {
            if (values[key]) {
                if (key === 'joiningDate') {
                    formData.append(key, values[key].toISOString());

                }

                else {
                    formData.append(key, values[key]);
                }
            }
        });

        if (fileList.length > 0 && fileList[0].originFileObj) {
            formData.append('file', fileList[0].originFileObj);
        }

        try {
            await onFinish(formData);
        } catch (error: any) {
            if (error?.response?.data?.errors) {
                const errorFields = Object.keys(error.response.data.errors).map(key => ({
                    name: key,
                    errors: [error.response.data.errors[key]],
                }));
                form.setFields(errorFields);
            }
        }
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
                    {initialValues ? 'Edit Staff' : 'New Staff Registration'}
                </h2>
            </div>

            <Row gutter={16} align="middle">
                <Col span={6}>
                    <Form.Item label="Staff Photo">
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={handleUploadChange}
                            beforeUpload={() => false}
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
                <Col span={12}>
                    <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email' }]}>
                        <Input />
                    </Form.Item>
                </Col>
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

            <Divider orientation="left">Professional Details</Divider>
            <Row gutter={16}>
                <Col span={8}>
                    <Form.Item name="employeeId" label="Employee ID" rules={[{ required: true }]}>
                        <Input placeholder="T..." />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name="joiningDate" label="Joining Date" rules={[{ required: true }]}>
                        <DatePicker className="w-full" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name="department" label="Department" rules={[{ required: true }]}>
                        <Select placeholder="Select">
                            {departments.map(dept => (
                                <Option key={dept} value={dept}>{dept}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={8}>
                    <Form.Item name="designation" label="Designation" rules={[{ required: true }]}>
                        <Select placeholder="Select">
                            <Option value="Principal">Principal</Option>
                            <Option value="Vice Principal">Vice Principal</Option>
                            <Option value="Teacher">Teacher</Option>
                            <Option value="Clerk">Clerk</Option>
                            <Option value="Office Assistant">Office Assistant</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name="qualification" label="Qualification">
                        <Input placeholder="MSc, BEd..." />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name="salary" label="Salary">
                        <InputNumber className="w-full" formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={8}>
                    <Form.Item name="status" label="Status" rules={[{ required: true }]} initialValue="Active">
                        <Select placeholder="Select Status">
                            <Option value="Active">Active</Option>
                            <Option value="On Leave">On Leave</Option>
                            <Option value="Resigned">Resigned</Option>
                            <Option value="Terminated">Terminated</Option>
                            <Option value="Retired">Retired</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            {!initialValues && (
                <>
                    <Divider orientation="left">Authentication</Divider>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="passwordMode" label="Password Generation Options" initialValue="default">
                                <Select>
                                    <Option value="default">Use Default (12341234)</Option>
                                    <Option value="auto">Auto-Generate Random</Option>
                                    <Option value="manual">Set Manually</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, currentValues) => prevValues.passwordMode !== currentValues.passwordMode}
                            >
                                {({ getFieldValue }) => {
                                    const mode = getFieldValue('passwordMode');
                                    if (mode === 'manual') {
                                        return (
                                            <Form.Item
                                                name="password"
                                                label="Custom Login Password"
                                                rules={[{ required: true, message: 'Please enter a password' }]}
                                            >
                                                <Input.Password placeholder="Enter manual password" />
                                            </Form.Item>
                                        );
                                    }
                                    return <div className="mt-8 text-gray-500 text-sm hidden md:block">{mode === 'auto' ? 'A secure random password will be generated.' : 'Password will be set to: 12341234'}</div>;
                                }}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item name="sendEmail" valuePropName="checked" initialValue={true}>
                                <Checkbox className="font-medium">Send Login Credentials automatically via Email</Checkbox>
                            </Form.Item>
                        </Col>
                    </Row>
                </>
            )}

            <div className="flex justify-end gap-3 mt-8">
                <Button onClick={onCancel} icon={<FaTimes />}>
                    Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={loading} icon={<FaSave />} className="bg-primary">
                    Save Staff
                </Button>
            </div>
        </Form>
    );
};

export default StaffForm;
