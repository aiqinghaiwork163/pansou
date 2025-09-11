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
  Space,
  Checkbox
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined,
  EyeInvisibleOutlined,
  EyeOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const AntdAuthPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // 添加记住我状态
  
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { login: userLogin, loading: userLoading, error: userError } = useUserAuth();

  const handleUserLogin = async (values: any) => {
    try {
      const success = await userLogin(values.username, values.password);
      
      if (success) {
        // 如果用户选择了"记住我"，将用户名和密码保存到localStorage
        if (values.remember) {
          localStorage.setItem('rememberedUsername', values.username);
          localStorage.setItem('rememberedPassword', values.password);
        } else {
          // 如果没有选择记住我，清除之前保存的用户名和密码
          localStorage.removeItem('rememberedUsername');
          localStorage.removeItem('rememberedPassword');
        }
        
        setIsAuthenticated(true);
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  // 在组件加载时检查是否有记住的用户名
  React.useEffect(() => {
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    const rememberedPassword = localStorage.getItem('rememberedPassword');
    
    if (rememberedUsername && rememberedPassword) {
      setUsername(rememberedUsername);
      setPassword(rememberedPassword);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-100 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <Title level={2} className="text-blue-600" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
            SoPan 智能网盘搜索系统
          </Title>
          <Text type="secondary" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
            用户登录
          </Text>
        </div>
        
        {userError && (
          <Alert 
            message={userError} 
            type="error" 
            showIcon 
            className="mb-6" 
          />
        )}
        
        <Form
          name="login"
          onFinish={handleUserLogin}
          layout="vertical"
          initialValues={{ 
            username: username,
            password: password,
            remember: rememberMe
          }}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
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
            rules={[{ required: true, message: '请输入密码!' }]}
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
          
          <Form.Item name="remember" valuePropName="checked">
            <Space className="w-full justify-between">
              <Checkbox>记住我</Checkbox>
            </Space>
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={userLoading}
              block
            >
              登录
            </Button>
          </Form.Item>
        </Form>
        
        <div className="text-center mt-6">
          <Text type="secondary">还没有账户? </Text>
          <Button type="link" onClick={() => navigate('/register')}>
            立即注册
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AntdAuthPage;