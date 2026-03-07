import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, Button, Steps, Upload } from 'antd';
import { message } from '../../../components/common/AntdStaticProvider';
import { UploadOutlined, SolutionOutlined, UserOutlined, BookOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import admissionApi from '../../../services/api/admission.api';
import { sendAdmissionEmail } from '../../../utils/emailjs-service';
import { generateApplicationReceivedContent } from '../../../utils/email-content-generators';
import { useSettingsStore } from '../../../store/settingsStore';
import { useCMSStore } from '../../../store/cmsStore';

const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;

const AdmissionForm: React.FC = () => {
    const [current, setCurrent] = useState(0);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);
    const { getSettingValue, fetchSettings } = useSettingsStore();
    const { uploadFile } = useCMSStore();

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const programs = getSettingValue<string[]>('academic-programs', ['SSLC', 'Plus Two', 'Degree']);

    const onFinish = async (values: any) => {
        try {
            setUploading(true);
            const documents = [];

            // Upload files first if any
            if (fileList.length > 0) {
                for (const file of fileList) {
                    try {
                        const result = await uploadFile(file.originFileObj);
                        documents.push({
                            title: file.name,
                            url: result.url,
                            type: 'Document'
                        });
                    } catch (uploadError) {
                        console.error("File upload failed", uploadError);
                        message.error(`Failed to upload ${file.name}`);
                        setUploading(false);
                        return;
                    }
                }
            }

            const submissionData = {
                ...values,
                dateOfBirth: values.dateOfBirth.toISOString(),
                documents: documents,
                guardianDetails: values.guardianDetails,
                academicHistory: values.academicHistory,
                address: values.address,
                city: values.city,
                state: values.state,
                pincode: values.pincode
            };

            await admissionApi.createAdmission(submissionData);

            // Send EmailJS application received email
            const emailHtml = generateApplicationReceivedContent(
                `${values.firstName} ${values.lastName}`,
                values.guardianDetails?.name || 'Parent/Guardian'
            );
            await sendAdmissionEmail({
                studentName: `${values.firstName} ${values.lastName}`,
                parentName: values.guardianDetails?.name || 'Parent/Guardian',
                email: values.email,
                subject: 'Application Received - Sheikh Jeelani Islamic Academy',
                message: emailHtml,
            });

            message.success('Application Submitted Successfully! We will contact you soon.');
            form.resetFields();
            setCurrent(0);
            setFileList([]);
        } catch (error: any) {
            console.error('Submission failed:', error);
            message.error(error.response?.data?.message || 'Failed to submit application. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const next = async () => {
        try {
            await form.validateFields();
            setCurrent(current + 1);
        } catch (error) {
            console.log('Validation Failed:', error);
        }
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const steps = [
        {
            title: 'Personal Info',
            icon: <UserOutlined />,
            content: (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
                            <Input placeholder="John" />
                        </Form.Item>
                        <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
                            <Input placeholder="Doe" />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item name="dateOfBirth" label="Date of Birth" rules={[{ required: true }]}>
                            <DatePicker className="w-full" />
                        </Form.Item>
                        <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
                            <Select placeholder="Select Gender">
                                <Option value="Male">Male</Option>
                                <Option value="Female">Female</Option>
                            </Select>
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                            <Input placeholder="john@example.com" />
                        </Form.Item>
                        <Form.Item name="phone" label="Phone" rules={[{ required: true, pattern: /^[0-9]{10}$/, message: 'Must be 10 digits' }]}>
                            <Input placeholder="9876543210" />
                        </Form.Item>
                    </div>

                    <Form.Item name="program" label="Program Applying For" rules={[{ required: true }]}>
                        <Select placeholder="Select Program">
                            {programs.map(prog => (
                                <Option key={prog} value={prog}>{prog}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="address" label="Address" rules={[{ required: true }]}>
                        <TextArea rows={3} />
                    </Form.Item>

                    <div className="grid grid-cols-3 gap-4">
                        <Form.Item name="city" label="City" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="state" label="State" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="pincode" label="Pincode" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </div>
                </div>
            )
        },
        {
            title: 'Guardian & Academic',
            icon: <SolutionOutlined />,
            content: (
                <div className="space-y-6">
                    <h3 className="font-semibold text-lg">Guardian Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item name={['guardianDetails', 'name']} label="Guardian Name" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name={['guardianDetails', 'relation']} label="Relationship" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name={['guardianDetails', 'phone']} label="Guardian Phone" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name={['guardianDetails', 'occupation']} label="Occupation">
                            <Input />
                        </Form.Item>
                    </div>

                    <h3 className="font-semibold text-lg">Academic History</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item name={['academicHistory', 'previousSchool']} label="Previous School" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name={['academicHistory', 'lastExamPassed']} label="Last Exam Passed" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name={['academicHistory', 'percentage']} label="Percentage" rules={[{ required: true }]}>
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item name={['academicHistory', 'yearOfPassing']} label="Year of Passing" rules={[{ required: true }]}>
                            <Input type="number" />
                        </Form.Item>
                    </div>
                </div>
            )
        },
        {
            title: 'Documents',
            icon: <BookOutlined />,
            content: (
                <div className="space-y-4">
                    <p className="text-gray-500 mb-4">Please upload scanned copies of your certificates (Max 2MB, JPG/PNG/PDF).</p>
                    <Form.Item label="Upload Documents">
                        <Upload
                            fileList={fileList}
                            onChange={({ fileList }) => setFileList(fileList)}
                            beforeUpload={() => false} // Prevent auto upload
                            multiple
                            maxCount={5}
                        >
                            <Button icon={<UploadOutlined />}>Select Files</Button>
                        </Upload>
                    </Form.Item>
                </div>
            )
        }
    ];

    return (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 max-w-4xl mx-auto border border-white/50">
            <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Student Admission Application
            </h2>

            <Steps current={current} className="mb-8">
                {steps.map(item => (
                    <Step key={item.title} title={item.title} icon={item.icon} />
                ))}
            </Steps>

            <Form form={form} layout="vertical" onFinish={onFinish}>
                <motion.div
                    key={current}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {steps[current].content}
                </motion.div>

                <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-gray-200">
                    {current > 0 && (
                        <Button onClick={prev}>
                            Previous
                        </Button>
                    )}
                    {current < steps.length - 1 && (
                        <Button type="primary" onClick={next} className="bg-primary">
                            Next
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="bg-green-600 hover:bg-green-700"
                            loading={uploading}
                        >
                            Submit Application
                        </Button>
                    )}
                </div>
            </Form>
        </div>
    );
};

export default AdmissionForm;
