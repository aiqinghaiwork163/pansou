import { useState, useEffect } from 'react';
// 移除framer-motion导入
import apiConfig from '@/config/apiConfig';

interface NetworkStatusProps {
  className?: string;
}

interface ApiHealthData {
  status: string;
  plugins_enabled?: boolean;
  channels_count?: number;
  plugin_count?: number;
  plugins?: string[];
}

export function NetworkStatus({ className = '' }: NetworkStatusProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [showDetails, setShowDetails] = useState(false);
  const [apiHealthData, setApiHealthData] = useState<ApiHealthData | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [lastCheckTime, setLastCheckTime] = useState<Date>(new Date());

  // 检测网络连接状态
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 检测API状态
  useEffect(() => {
    const checkApiStatus = async () => {
      const startTime = Date.now();
      setLastCheckTime(new Date());
      
      try {
        const apiUrl = apiConfig.getApiUrl();
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${apiUrl}/api/health`, {
          method: 'GET',
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        const endTime = Date.now();
        setResponseTime(endTime - startTime);
        
        if (response.ok) {
          const data = await response.json();
          setApiHealthData(data);
          setApiStatus('online');
        } else {
          setApiStatus('offline');
          setApiHealthData(null);
        }
      } catch (error) {
        setApiStatus('offline');
        setApiHealthData(null);
        setResponseTime(null);
      }
    };

    checkApiStatus();
    
    // 每30秒检查一次API状态
    const interval = setInterval(checkApiStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (!isOnline) return 'bg-red-500';
    if (apiStatus === 'offline') return 'bg-yellow-500';
    if (apiStatus === 'checking') return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStatusText = () => {
    if (!isOnline) return '网络断开';
    if (apiStatus === 'offline') return 'API离线';
    if (apiStatus === 'checking') return '检测中';
    return '在线';
  };

  const getStatusIcon = () => {
    if (!isOnline) return '🔴';
    if (apiStatus === 'offline') return '🟡';
    if (apiStatus === 'checking') return '🔵';
    return '🟢';
  };

  const getResponseTimeColor = () => {
    if (!responseTime) return 'text-white/50';
    if (responseTime < 100) return 'text-green-400';
    if (responseTime < 500) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className={`relative ${className}`}>
      {/* 状态指示器 */}
      <div
        className="flex items-center space-x-2 cursor-pointer bg-black/20 border border-white/10 rounded-lg px-3 py-2 hover:bg-black/30 transition-all duration-200"
        onClick={() => setShowDetails(!showDetails)}
      >
        {/* 状态点 */}
        <div
          className={`w-3 h-3 rounded-full ${getStatusColor()} shadow-lg`}
          style={{
            animation: 'pulse 2s infinite'
          }}
        />
        
        {/* 状态文本 */}
        <span className="text-sm font-medium text-white/90 hidden sm:inline">
          {getStatusText()}
        </span>
        
        {/* 图标 */}
        <span className="text-sm">{getStatusIcon()}</span>
        
        {/* 响应时间（仅在在线时显示） */}
        {apiStatus === 'online' && responseTime && (
          <span className={`text-xs ${getResponseTimeColor()} hidden md:inline`}>
            {responseTime}ms
          </span>
        )}
      </div>

      {/* 详细信息弹窗 */}
      {/* 移除AnimatePresence，使用条件渲染 */}
      {showDetails && (
        <div
          className="absolute top-full right-0 mt-2 w-80 bg-black/95 border border-white/20 rounded-xl p-4 shadow-2xl z-50"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="text-white font-semibold text-sm">网络状态监控</h3>
              <button
                className="text-white/50 hover:text-white transition-colors"
                onClick={() => setShowDetails(false)}
              >
                ✕
              </button>
            </div>
            
            {/* 网络连接状态 */}
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-xs">网络连接</span>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-white text-xs">
                  {isOnline ? '正常' : '断开'}
                </span>
              </div>
            </div>
            
            {/* API服务状态 */}
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-xs">API服务</span>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  apiStatus === 'online' ? 'bg-green-500' : 
                  apiStatus === 'offline' ? 'bg-red-500' : 'bg-blue-500'
                }`} />
                <span className="text-white text-xs">
                  {apiStatus === 'online' ? '正常' : 
                   apiStatus === 'offline' ? '离线' : '检测中'}
                </span>
              </div>
            </div>
            
            {/* 响应时间 */}
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-xs">响应时间</span>
              <span className={`text-xs ${getResponseTimeColor()}`}>
                {responseTime ? `${responseTime}ms` : '--'}
              </span>
            </div>
            
            {/* API详细信息 */}
            {apiHealthData && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-xs">插件状态</span>
                  <span className="text-white text-xs">
                    {apiHealthData.plugins_enabled ? '已启用' : '已禁用'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-xs">频道数量</span>
                  <span className="text-white text-xs">
                    {apiHealthData.channels_count || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-xs">插件数量</span>
                  <span className="text-white text-xs">
                    {apiHealthData.plugin_count || 0}
                  </span>
                </div>
                
                {/* 插件列表 */}
              </>
            )}
            
            {/* 最后检查时间 */}
            <div className="flex items-center justify-between border-t border-white/10 pt-2">
              <span className="text-white/70 text-xs">最后检查</span>
              <span className="text-white text-xs">
                {lastCheckTime.toLocaleTimeString()}
              </span>
            </div>
            
            {/* 操作按钮 */}
            <div className="flex space-x-2 pt-2">
              <button
                className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs rounded-md transition-colors"
                onClick={async () => {
                  // 设置状态为检查中
                  setApiStatus('checking');
                  
                  // 重新检查API状态
                  const checkApiStatus = async () => {
                    const startTime = Date.now();
                    setLastCheckTime(new Date());
                    
                    try {
                      const apiUrl = apiConfig.getApiUrl();
                      const controller = new AbortController();
                      const timeoutId = setTimeout(() => controller.abort(), 5000);

                      const response = await fetch(`${apiUrl}/api/health`, {
                        method: 'GET',
                        signal: controller.signal,
                      });
                      
                      clearTimeout(timeoutId);
                      const endTime = Date.now();
                      setResponseTime(endTime - startTime);
                      
                      if (response.ok) {
                        const data = await response.json();
                        setApiHealthData(data);
                        setApiStatus('online');
                      } else {
                        setApiStatus('offline');
                        setApiHealthData(null);
                      }
                    } catch (error) {
                      setApiStatus('offline');
                      setApiHealthData(null);
                      setResponseTime(null);
                    }
                  };
                  
                  // 执行检查
                  await checkApiStatus();
                }}
              >
                刷新状态
              </button>
              
              <button
                className="flex-1 px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 text-xs rounded-md transition-colors"
                onClick={() => {
                  const apiUrl = apiConfig.getApiUrl();
                  window.open(`${apiUrl}/api/health`, '_blank');
                }}
              >
                查看详情
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}