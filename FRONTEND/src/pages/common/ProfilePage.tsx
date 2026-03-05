import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Avatar, Upload, Tabs, Tag } from 'antd';
import { message } from '../../components/common/AntdStaticProvider';
import { UserOutlined, UploadOutlined, SafetyCertificateOutlined, MailOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
import authApi from '../../services/api/auth.api';

const ProfilePage: React.FC = () => {
    const { user, checkAuth } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [pwdLoading, setPwdLoading] = useState(false);
    const [form] = Form.useForm();
    const [pwdForm] = Form.useForm();
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            });
            if (user.photoUrl) setPreviewUrl(user.photoUrl);
        }
    }, [user, form]);

    const handleProfileSubmit = async (values: any) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('firstName', values.firstName);
            formData.append('lastName', values.lastName);
            if (file) {
                formData.append('photo', file);
            }

            await authApi.updateProfile(formData);
            message.success('Profile updated successfully!');
            await checkAuth(); // Re-fetch updated auth state
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (values: any) => {
        setPwdLoading(true);
        try {
            await authApi.changePassword({
                oldPassword: values.currentPassword,
                newPassword: values.newPassword,
            });
            message.success('Password updated successfully!');
            pwdForm.resetFields();
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setPwdLoading(false);
        }
    };

    const beforeUpload = (file: File) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
            return Upload.LIST_IGNORE;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
            return Upload.LIST_IGNORE;
        }
        setFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        return false; // Prevent auto upload
    };

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="md:col-span-1 text-center shadow-sm">
                    <div className="flex flex-col items-center space-y-4">
                        <Avatar size={120} src={previewUrl} icon={!previewUrl && <UserOutlined />} className="bg-primary/10 text-primary" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">{user.firstName} {user.lastName}</h2>
                            <Tag color="green" className="mt-2 uppercase tracking-widest">{user.role}</Tag>
                        </div>
                        <Upload showUploadList={false} beforeUpload={beforeUpload}>
                            <Button icon={<UploadOutlined />}>Change Avatar</Button>
                        </Upload>
                    </div>
                </Card>

                {/* Edit Details */}
                <Card className="md:col-span-2 shadow-sm">
                    <Tabs defaultActiveKey="1" items={[
                        {
                            key: '1',
                            label: 'Personal Details',
                            children: (
                                <Form
                                    layout="vertical"
                                    form={form}
                                    onFinish={handleProfileSubmit}
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}>
                                            <Input prefix={<UserOutlined />} />
                                        </Form.Item>
                                        <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
                                            <Input prefix={<UserOutlined />} />
                                        </Form.Item>
                                    </div>
                                    <Form.Item label="Email Account (Locked)" name="email">
                                        <Input prefix={<MailOutlined />} disabled />
                                    </Form.Item>
                                    <Button type="primary" htmlType="submit" loading={loading} className="w-full mt-4">
                                        Save Profile Changes
                                    </Button>
                                </Form>
                            )
                        },
                        {
                            key: '2',
                            label: 'Security & Password',
                            children: (
                                <Form layout="vertical" form={pwdForm} onFinish={handlePasswordSubmit}>
                                    <Form.Item label="Current Password" name="currentPassword" rules={[{ required: true }]}>
                                        <Input.Password prefix={<SafetyCertificateOutlined />} />
                                    </Form.Item>
                                    <Form.Item label="New Password" name="newPassword" rules={[{ required: true, min: 6 }]}>
                                        <Input.Password prefix={<SafetyCertificateOutlined />} />
                                    </Form.Item>
                                    <Form.Item
                                        label="Confirm Password"
                                        name="confirmPassword"
                                        dependencies={['newPassword']}
                                        rules={[
                                            { required: true },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('newPassword') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('Passwords do not match!'));
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password prefix={<SafetyCertificateOutlined />} />
                                    </Form.Item>
                                    <Button type="primary" htmlType="submit" loading={pwdLoading} danger className="w-full mt-4">
                                        Update Password Protection
                                    </Button>
                                </Form>
                            )
                        }
                    ]} />
                </Card>
            </div>
        </div>
    );
};

export default ProfilePage;
