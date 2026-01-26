import React, { useState } from 'react';
import { Card, Form, Input, Button, Avatar, Upload, Tabs } from 'antd';
import { message } from '../../components/common/AntdStaticProvider';
import { UserOutlined, UploadOutlined, SafetyCertificateOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

const ProfilePage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        setLoading(true);
        console.log('Update Profile:', values);
        setTimeout(() => {
            message.success('Profile updated successfully!');
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="md:col-span-1 text-center shadow-sm">
                    <div className="flex flex-col items-center space-y-4">
                        <Avatar size={100} icon={<UserOutlined />} className="bg-primary/10 text-primary" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Administrator</h2>
                            <p className="text-gray-500">Super Admin</p>
                        </div>
                        <Upload showUploadList={false}>
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
                                    onFinish={onFinish}
                                    initialValues={{
                                        name: 'Administrator',
                                        email: 'admin@sjia.edu',
                                        phone: '+91 9876543210'
                                    }}
                                >
                                    <Form.Item label="Full Name" name="name" rules={[{ required: true }]}>
                                        <Input prefix={<UserOutlined />} />
                                    </Form.Item>
                                    <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                                        <Input prefix={<MailOutlined />} disabled />
                                    </Form.Item>
                                    <Form.Item label="Phone Number" name="phone">
                                        <Input prefix={<PhoneOutlined />} />
                                    </Form.Item>
                                    <Button type="primary" htmlType="submit" loading={loading}>
                                        Save Changes
                                    </Button>
                                </Form>
                            )
                        },
                        {
                            key: '2',
                            label: 'Security',
                            children: (
                                <Form layout="vertical" onFinish={onFinish}>
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
                                    <Button type="primary" htmlType="submit" loading={loading} danger>
                                        Update Password
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
