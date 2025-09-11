import { useState, useEffect } from 'react';
import apiConfig from '@/config/apiConfig';

interface ApiSelectorProps {
  className?: string;
}

interface ApiStatus {
  url: string;
  name: string;
  testing: boolean;
  status: 'unknown' | 'success' | 'error';
  message?: string;
}

export function ApiSelector({ className = '' }: ApiSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentApi, setCurrentApi] = useState('');
  const [apiName, setApiName] = useState('');
  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>([]);

  // 初始化当前API地址和API状态
  useEffect(() => {
    const current = apiConfig.getApiUrl();
    setCurrentApi(current);
    
    // 根据API地址设置显示名称
    const name = getApiName(current);
    setApiName(name);
    
    // 初始化API状态列表，使用正确的显示名称
    const initialStatuses: ApiStatus[] = apiConfig.presetApiUrls.map((url, index) => ({
      url,
      name: getApiName(url),
      testing: false,
      status: 'unknown'
    }));
    setApiStatuses(initialStatuses);
  }, []);

  // 根据API地址获取显示名称
  const getApiName = (url: string): string => {
    // 获取预设API列表的索引
    const apiUrls = apiConfig.presetApiUrls;
    const index = apiUrls.indexOf(url);
    
    // 按照索引顺序给API命名
    if (index >= 0) return `站点${index + 1}`;
    
    // 如果是自定义API或未在预设列表中的API
    return '自定义站点';
  };

  // 选择API
  const selectApi = async (url: string) => {
    // 更新当前API
    apiConfig.setCustomApiUrl(url);
    setCurrentApi(url);
    const name = getApiName(url);
    setApiName(name);
    
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* API选择器按钮 */}
      <div
        className="flex items-center space-x-2 cursor-pointer bg-black/20 border border-white/10 rounded-lg px-3 py-2 hover:bg-black/30 transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          boxShadow: isOpen 
            ? "0 0 0 1px rgba(6, 182, 212, 0.5), 0 0 20px rgba(6, 182, 212, 0.15)"
            : "0 0 0 1px rgba(255, 255, 255, 0.1)"
        }}
      >
        {/* API图标 */}
        <span 
          className="text-sm"
          style={{ 
            color: isOpen ? '#06b6d4' : '#ffffff'
          }}
        >
          <i className="fa-solid fa-server"></i>
        </span>
        
        {/* API名称 */}
        <span 
          className="text-sm font-medium text-white/90 hidden sm:inline"
          style={{
            color: isOpen ? '#06b6d4' : '#ffffff'
          }}
        >
          {apiName}
        </span>
        
        {/* 下拉箭头 */}
        <span
          className="text-xs"
          style={{ 
            color: isOpen ? '#06b6d4' : '#ffffff'
          }}
        >
          <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
        </span>
      </div>

      {/* API选择菜单 */}
      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 w-64 bg-black/95 border border-white/20 rounded-xl shadow-2xl z-50"
        >
          <div className="py-2">
            {/* 预设API列表 */}
            {apiStatuses.map((apiStatus, index) => (
              <button
                key={apiStatus.url}
                className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                  currentApi === apiStatus.url 
                    ? 'bg-cyan-500/20 text-cyan-400' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
                onClick={() => selectApi(apiStatus.url)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <i 
                      className="mr-2"
                      style={{
                        color: currentApi === apiStatus.url ? '#06b6d4' : '#9ca3af'
                      }}
                    >
                      <i className="fa-solid fa-server"></i>
                    </i>
                    <span className="truncate max-w-[120px]" title={apiStatus.url}>{apiStatus.name}</span>
                    {currentApi === apiStatus.url && (
                      <i 
                        className="fa-solid fa-check text-cyan-400 ml-2"
                      />
                    )}
                  </div>
                  {/* 连接状态指示器 */}
                  {apiStatus.testing ? (
                    <i className="fa-solid fa-spinner fa-spin text-yellow-400"></i>
                  ) : apiStatus.status === 'success' ? (
                    <i className="fa-solid fa-check-circle text-green-400"></i>
                  ) : apiStatus.status === 'error' ? (
                    <i className="fa-solid fa-times-circle text-red-400"></i>
                  ) : (
                    <i className="fa-solid fa-question-circle text-gray-400"></i>
                  )}
                </div>
                {/* 错误信息 */}
                {apiStatus.status === 'error' && apiStatus.message && (
                  <div className="text-xs text-red-400 mt-1 truncate" title={apiStatus.message}>
                    {apiStatus.message}
                  </div>
                )}
              </button>
            ))}
            
          </div>
        </div>
      )}
    </div>
  );
}