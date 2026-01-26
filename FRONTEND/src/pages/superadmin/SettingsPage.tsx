import React, { useState } from 'react';
import { Card, Form, Input, Button, Switch, Tabs, Select } from 'antd';
import { message } from '../../components/common/AntdStaticProvider';
import { SettingOutlined, BellOutlined, GlobalOutlined } from '@ant-design/icons';

const { Option } = Select;

const SettingsPage: React.FC = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = (values: any) => {
        setLoading(true);
        console.log('Update Settings:', values);
        setTimeout(() => {
            message.success('Settings updated successfully!');
            setLoading(false);
        }, 1000);
    };

    const generalSettings = (
        <Form layout="vertical" onFinish={onFinish} initialValues={{ siteName: 'Sheikh Jeelani Islamic Academy', maintenanceMode: false }}>
            <Form.Item label="Site Name" name="siteName" rules={[{ required: true }]}>
                <Input prefix={<GlobalOutlined />} />
            </Form.Item>
            <Form.Item label="Maintenance Mode" name="maintenanceMode" valuePropName="checked">
                <Switch />
            </Form.Item>
            <Form.Item label="Language" name="language" initialValue="en">
                <Select>
                    <Option value="en">English</Option>
                    <Option value="ar">Arabic</Option>
                    <Option value="ml">Malayalam</Option>
                </Select>
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>Save General Settings</Button>
        </Form>
    );

    const notificationSettings = (
        <Form layout="vertical" onFinish={onFinish} initialValues={{ emailAlerts: true, smsAlerts: false }}>
            <Form.Item label="Email Alerts" name="emailAlerts" valuePropName="checked" help="Receive notifications via email">
                <Switch />
            </Form.Item>
            <Form.Item label="SMS Alerts" name="smsAlerts" valuePropName="checked" help="Receive critical alerts via SMS (charges apply)">
                <Switch />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>Save Notification Preferences</Button>
        </Form>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <SettingOutlined className="text-2xl text-primary" />
                <h1 className="text-2xl font-bold text-gray-800 mb-0">System Settings</h1>
            </div>
            <p className="text-gray-500">Manage global application configurations.</p>

            <Card className="shadow-sm">
                <Tabs items={[
                    {
                        key: '1',
                        label: (<span><GlobalOutlined /> General</span>),
                        children: generalSettings
                    },
                    {
                        key: '2',
                        label: (<span><BellOutlined /> Notifications</span>),
                        children: notificationSettings
                    }
                ]} />
            </Card>
        </div>
    );
};

export default SettingsPage;
