import React from 'react';
import { useAuth } from '@/contexts/authContext';
import { useNavigate } from 'react-router-dom';

const TestAdminPage: React.FC = () => {
  const { isAdministrator } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">管理员测试页面</h1>
          
          {isAdministrator ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              <p className="font-medium">恭喜！您是管理员用户。</p>
              <p>您可以访问管理员专用功能。</p>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="font-medium">访问被拒绝</p>
              <p>只有管理员用户才能访问此页面。</p>
            </div>
          )}
          
          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => navigate('/admin')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              访问管理页面
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAdminPage;