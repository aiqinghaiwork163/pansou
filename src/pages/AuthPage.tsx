import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/authContext';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '@/hooks/useUserAuth'; // 仅保留用户认证 hook

const AuthPage: React.FC = () => {
  const [username, setUsername] = useState(''); // 用户名状态
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // 添加记住我状态
  
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { login: userLogin, loading: userLoading, error: userError } = useUserAuth(); // 仅获取用户登录函数

  // 在组件加载时检查是否有记住的用户名和密码
  useEffect(() => {
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    const rememberedPassword = localStorage.getItem('rememberedPassword');
    
    if (rememberedUsername && rememberedPassword) {
      setUsername(rememberedUsername);
      setPassword(rememberedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      return;
    }
    
    try {
      const success = await userLogin(username, password);
      
      if (success) {
        // 如果用户选择了"记住我"，将用户名和密码保存到localStorage
        if (rememberMe) {
          localStorage.setItem('rememberedUsername', username);
          localStorage.setItem('rememberedPassword', password);
        } else {
          // 如果没有选择记住我，清除之前保存的用户名和密码
          localStorage.removeItem('rememberedUsername');
          localStorage.removeItem('rememberedPassword');
        }
        
        // 登录成功
        setIsAuthenticated(true);
        // 注意：我们不再需要在 localStorage 中设置 isAuthenticated
        // 因为 AuthProvider 会检查 sessionStorage 中的认证状态
        navigate('/'); // 重定向到首页
      }
      // 错误信息已经在 useUserAuth 中处理
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-100 to-blue-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-600 mb-2" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>SoPan 智能网盘搜索系统</h1>
          <p className="text-gray-500 text-sm" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
            用户登录
          </p>
        </div>
        
        {/* 用户登录表单 */}
        <form onSubmit={handleUserLogin} className="space-y-6">
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
              placeholder="密码"
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
          
          {/* 记住我复选框 */}
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
              记住我
            </label>
          </div>
          
          {userError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center">
              <i className="fa-solid fa-exclamation-triangle mr-2"></i>
              <span style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>{userError}</span>
            </div>
          )}
          
          <button
            type="submit"
            disabled={userLoading || !username.trim() || !password.trim()}
            className="w-full py-3 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
          >
            {userLoading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                验证中...
              </>
            ) : (
              <>
                <i className="fa-solid fa-sign-in-alt mr-2"></i>
                用户登录
              </>
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate('/register')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
          >
            没有账户？立即注册
          </button>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-xs" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
            用户账户安全加密保护
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;