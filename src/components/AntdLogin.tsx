import React, { useState } from 'react';
import { useAuth } from '@/contexts/authContext';
import { Form, Input, Button, Alert, Card, Typography, Space } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

interface AntdLoginProps {
  onLoginSuccess: () => void;
}

const { Title, Text } = Typography;

const AntdLogin: React.FC<AntdLoginProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { setIsAuthenticated } = useAuth();

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // 支持多个密码的验证（包含中文密码）
      // 优先使用localStorage中存储的密码，如果没有则使用默认密码列表
      const storedPassword = localStorage.getItem('accessPassword');
      let validPasswords = ['20251010', '网盘搜索', '智能搜索2025']; // 默认密码（包含中文密码）
      
      // 如果有存储的密码，将其添加到有效密码列表中
      if (storedPassword) {
        validPasswords.push(storedPassword);
      }
      
      // 验证密码
      if (validPasswords.includes(password)) {
        // 登录成功
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
        onLoginSuccess();
      } else {
        setError('密码错误');
      }
    } catch (err) {
      setError('验证过程中发生错误');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <Card 
        className="w-full max-w-md"
        style={{ 
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <div className="text-center mb-8">
          <Title level={2} style={{ color: 'white', marginBottom: 8 }}>访问授权</Title>
          <Text type="secondary" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>请输入密码以访问系统</Text>
        </div>
        
        {error && (
          <Alert 
            message={error} 
            type="error" 
            showIcon 
            className="mb-6" 
          />
        )}
        
        <Form onFinish={handleLogin} layout="vertical">
          <Form.Item
            label={<span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>访问密码</span>}
            name="password"
            rules={[{ required: true, message: '请输入访问密码!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入访问密码"
              size="large"
              style={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'white'
              }}
            />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={isLoading}
              size="large"
              block
              style={{
                background: 'linear-gradient(90deg, #06b6d4, #3b82f6)',
                borderColor: 'transparent'
              }}
            >
              {isLoading ? '验证中...' : '验证访问'}
            </Button>
          </Form.Item>
        </Form>
        
        <div className="mt-6 text-center">
          <Text type="secondary" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            默认密码: 20251010, 网盘搜索, 智能搜索2025
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default AntdLogin;