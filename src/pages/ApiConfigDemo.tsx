import React from 'react';
import { useState, useEffect } from 'react';
import { Card, Button, Input, Form, message, Space, Switch, Typography, Divider } from 'antd';
import { SaveOutlined, SyncOutlined, DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons';
import apiConfig from '@/config/apiConfig';
import { useApiConfig } from '@/hooks/useApiConfigNew';

const { Title, Text } = Typography;

export default function ApiConfigDemo() {
  const [form] = Form.useForm();
  const { 
    customApiUrl, 
    isValidUrl, 
    loading, 
    error, 
    saveCustomApiUrl, 
    resetToDefault 
  } = useApiConfig();
  
  const [sites, setSites] = useState([
    { id: 'site1', name: '资源站1', url: 'https://api.example1.com', enabled: true },
    { id: 'site2', name: '资源站2', url: 'https://api.example2.com', enabled: true },
    { id: 'site3', name: '资源站3', url: 'https://api.example3.com', enabled: false },
  ]);
  
  const [selectedSites, setSelectedSites] = useState<string[]>(['site1', 'site2']);

  useEffect(() => {
    form.setFieldsValue({ customApiUrl });
  }, [customApiUrl, form]);

  const handleSave = async (values: { customApiUrl: string }) => {
    try {
      await saveCustomApiUrl(values.customApiUrl);
      message.success('API配置已保存');
    } catch (err) {
      message.error('保存失败: ' + (err as Error).message);
    }
  };

  const handleReset = async () => {
    try {
      await resetToDefault();
      form.resetFields();
      message.success('已重置为默认配置');
    } catch (err) {
      message.error('重置失败: ' + (err as Error).message);
    }
  };

  const toggleSite = (id: string) => {
    setSelectedSites(prev => 
      prev.includes(id) 
        ? prev.filter(siteId => siteId !== id) 
        : [...prev, id]
    );
  };

  const saveSiteConfig = () => {
    // 这里应该保存站点配置到后端或localStorage
    message.success('站点配置已保存');
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Title level={2}>API配置管理</Title>
      <Text type="secondary">配置和管理API端点</Text>
      
      <Divider />
      
      <Card title="自定义API配置" className="mb-6">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          autoComplete="off"
        >
          <Form.Item
            label="自定义API地址"
            name="customApiUrl"
            rules={[
              { 
                pattern: /^https?:\/\/.+/,
                message: '请输入有效的URL地址，必须包含http://或https://' 
              }
            ]}
          >
            <Input 
              placeholder="例如: https://api.example.com" 
              size="large"
              status={customApiUrl && !isValidUrl ? 'error' : ''}
            />
          </Form.Item>
          
          {customApiUrl && !isValidUrl && (
            <Text type="danger">请输入有效的URL地址</Text>
          )}
          
          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SaveOutlined />}
                loading={loading}
                size="large"
              >
                保存配置
              </Button>
              <Button 
                onClick={handleReset}
                icon={<SyncOutlined />}
                size="large"
              >
                重置默认
              </Button>
            </Space>
          </Form.Item>
        </Form>
        
        {error && (
          <Text type="danger">{error}</Text>
        )}
      </Card>
      
      <Card title="站点管理">
        <Text>选择可用的站点：</Text>
        <div className="my-4">
          {sites.map(site => (
            <div key={site.id} className="flex items-center justify-between p-3 border rounded mb-2">
              <div>
                <Text strong>{site.name}</Text>
                <br />
                <Text type="secondary" copyable>{site.url}</Text>
              </div>
              <Switch 
                checked={selectedSites.includes(site.id)}
                onChange={() => toggleSite(site.id)}
                checkedChildren={<CheckCircleOutlined />}
                unCheckedChildren={<DeleteOutlined />}
              />
            </div>
          ))}
        </div>
        
        <Button 
          type="primary" 
          onClick={saveSiteConfig}
          icon={<SaveOutlined />}
        >
          保存站点配置
        </Button>
      </Card>
    </div>
  );
}