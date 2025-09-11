import React, { useState } from 'react';
import useApiConfig from '@/hooks/useApiConfig';

const ApiConfigDemo: React.FC = () => {
  const { config, setCustomUrl, resetToDefault, validateUrl, testConnection } = useApiConfig();
  const [inputUrl, setInputUrl] = useState(config.customUrl || config.currentUrl);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  // 处理保存设置
  const handleSave = () => {
    if (!validateUrl(inputUrl)) {
      setError('请输入有效的API地址，需要包含协议（http:// 或 https://）');
      return;
    }

    if (setCustomUrl(inputUrl)) {
      setMessage('API地址已保存');
      setError('');
      // 2秒后清除消息
      setTimeout(() => setMessage(''), 2000);
    } else {
      setError('保存失败，请检查API地址格式');
    }
  };

  // 处理重置
  const handleReset = () => {
    resetToDefault();
    setInputUrl('https://api.aiqinghaiwork.cn');
    setMessage('已重置为默认API地址');
    setError('');
    // 2秒后清除消息
    setTimeout(() => setMessage(''), 2000);
  };

  // 处理测试连接
  const handleTest = async () => {
    if (!validateUrl(inputUrl)) {
      setError('请输入有效的API地址，需要包含协议（http:// 或 https://）');
      return;
    }

    setIsTesting(true);
    setError('');
    setMessage('');

    const result = await testConnection(inputUrl);
    
    if (result.success) {
      setMessage(result.message);
    } else {
      setError(result.message);
    }
    
    setIsTesting(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">API配置演示</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">当前配置</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">当前使用的API地址</p>
            <p className="font-mono text-sm break-all p-2 bg-gray-100 rounded">
              {config.currentUrl}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">配置来源</p>
            <p className="p-2 bg-gray-100 rounded">
              {config.isCustom ? '用户自定义' : '默认配置'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">自定义设置</h2>
        
        <div className="mb-4">
          <label htmlFor="apiUrl" className="block text-sm font-medium text-gray-700 mb-2">
            API地址
          </label>
          <input
            type="text"
            id="apiUrl"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入API地址，例如：https://api.aiqinghaiwork.cn"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            保存设置
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            重置默认
          </button>
          <button
            onClick={handleTest}
            disabled={isTesting}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isTesting ? '测试中...' : '测试连接'}
          </button>
        </div>
        
        {message && (
          <div className="mt-4 p-2 bg-green-100 text-green-700 rounded-md">
            {message}
          </div>
        )}
        {error && (
          <div className="mt-4 p-2 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>
      
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">使用说明</h3>
        <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
          <li>您可以在此处自定义API地址以连接到不同的后端服务</li>
          <li>API地址需要包含协议（http:// 或 https://）</li>
          <li>使用"测试连接"按钮验证API地址是否有效</li>
          <li>设置保存后，刷新页面即可生效</li>
          <li>如果需要恢复默认设置，点击"重置默认"按钮</li>
        </ul>
      </div>
    </div>
  );
};

export default ApiConfigDemo;