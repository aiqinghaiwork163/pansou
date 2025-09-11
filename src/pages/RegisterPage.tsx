import React, { useState } from 'react';
import { useAuth } from '@/contexts/authContext';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '@/hooks/useUserAuth';

const RegisterPage: React.FC = () => {
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 基本验证
    if (!username.trim() || !password.trim() || !authorizationCode.trim()) {
      setError('请填写所有必填字段');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }
    
    if (password.length < 6) {
      setError('密码长度至少6位');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);

      // 注册用户
      const success = await register(username, password, authorizationCode);
      
      if (success) {
        // 注册成功，自动登录
        setIsAuthenticated(true);
        // 注意：我们不再需要在 localStorage 中设置 isAuthenticated
        // 因为 AuthProvider 会检查 sessionStorage 中的认证状态
        navigate('/'); // 重定向到首页
      }
      // 错误信息已经在 useUserAuth 中处理
    } catch (err) {
      console.error('Registration error:', err);
      setError('注册过程中发生未知错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-100 to-blue-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-600 mb-2" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>SoPan 用户注册</h1>
          <p className="text-gray-500 text-sm" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>请输入信息完成注册</p>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="用户名"
              style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
              required
            />
          </div>
          
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="密码（至少6位）"
              style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
          
          <div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="确认密码"
              style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
              required
            />
          </div>
          
          <div>
            <input
              type="text"
              value={authorizationCode}
              onChange={(e) => setAuthorizationCode(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="授权码"
              style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
              required
            />
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center">
              <i className="fa-solid fa-exclamation-triangle mr-2"></i>
              <span style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>{error}</span>
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
          >
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                注册中...
              </>
            ) : (
              <>
                <i className="fa-solid fa-user-plus mr-2"></i>
                注册
              </>
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate('/auth')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
          >
            已有账户？立即登录
          </button>
        </div>

        {/* 添加用户管理导航链接 */}
        <div className="mt-4 text-center">
          <button 
            onClick={() => navigate('/admin')}
            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
            style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
          >
            <i className="fa-solid fa-users-gear mr-1"></i>
            用户管理
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;