import React, { useState } from 'react';
import { useAuth } from '@/contexts/authContext';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { setIsAuthenticated } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
      <div className="bg-white/10 border border-slate-600/30 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">访问授权</h1>
          <p className="text-slate-400">请输入密码以访问系统</p>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-400/30 rounded-lg text-red-300 text-sm">
            <i className="fa-solid fa-exclamation-circle mr-2"></i>
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
              访问密码
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-slate-600/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              placeholder="请输入访问密码"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
              isLoading 
                ? 'bg-cyan-600/50 cursor-not-allowed' 
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg hover:shadow-cyan-500/20'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                验证中...
              </span>
            ) : (
              '验证访问'
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-slate-400">
          <p>默认密码: 20251010, 网盘搜索, 智能搜索2025</p>
        </div>
      </div>
    </div>
  );
};

export default Login;