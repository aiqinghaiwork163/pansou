import React, { useState } from 'react';
import { useAuth } from '@/contexts/authContext';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '@/hooks/useUserAuth';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Alert,
  Space
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined,
  KeyOutlined,
  EyeInvisibleOutlined,
  EyeOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const AntdRegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authorizationCode, setAuthorizationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { register } = useUserAuth();

  const handleRegister = async (values: any) => {
    // 基本验证
    if (values.password !== values.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }
    
    if (values.password.length < 6) {
      setError('密码长度至少6位');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);

      // 注册用户
      const success = await register(values.username, values.password, values.authorizationCode);
      
      if (success) {
        // 注册成功，自动登录
        setIsAuthenticated(true);
        navigate('/'); // 重定向到首页
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-100 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <Title level={2} className="text-blue-600" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
            SoPan 智能网盘搜索系统
          </Title>
          <Text type="secondary" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
            用户注册
          </Text>
        </div>
        
        {error && (
          <Alert 
            message={error} 
            type="error" 
            showIcon 
            className="mb-6" 
          />
        )}
        
        <Form
          name="register"
          onFinish={handleRegister}
          layout="vertical"
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              { required: true, message: '请输入用户名!' },
              { min: 3, message: '用户名至少3个字符' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Item>
          
          <Form.Item
            label="密码"
            name="password"
            rules={[
              { required: true, message: '请输入密码!' },
              { min: 6, message: '密码至少6个字符' }
            ]}
          >
            <Input
              prefix={<LockOutlined />}
              type={showPassword ? "text" : "password"}
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              suffix={
                <Button 
                  type="text" 
                  icon={showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                  onClick={() => setShowPassword(!showPassword)}
                />
              }
            />
          </Form.Item>
          
          <Form.Item
            label="确认密码"
            name="confirmPassword"
            rules={[
              { required: true, message: '请确认密码!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致!'));
                },
              }),
            ]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="请再次输入密码"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Item>
          
          <Form.Item
            label="授权码"
            name="authorizationCode"
            rules={[{ required: true, message: '请输入授权码!' }]}
          >
            <Input
              prefix={<KeyOutlined />}
              placeholder="请输入授权码"
              value={authorizationCode}
              onChange={(e) => setAuthorizationCode(e.target.value)}
            />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
            >
              注册
            </Button>
          </Form.Item>
        </Form>
        
        <div className="text-center mt-6">
          <Text type="secondary">已有账户? </Text>
          <Button type="link" onClick={() => navigate('/auth')}>
            立即登录
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AntdRegisterPage;