import { useState, useEffect } from 'react';
// 移除framer-motion导入

export function MobileDebug() {
  const [debugInfo, setDebugInfo] = useState({
    userAgent: '',
    screenSize: '',
    networkInfo: '',
    hostname: '',
    apiUrls: [] as string[],
    backendStatus: [] as { url: string; status: string; error?: string }[]
  });

  useEffect(() => {
    const checkConnections = async () => {
      // 基本设备信息
      const info = {
        userAgent: navigator.userAgent,
        screenSize: `${window.screen.width}x${window.screen.height}`,
        networkInfo: (navigator as any).connection ? 
          `${(navigator as any).connection.effectiveType} - ${(navigator as any).connection.downlink}Mbps` : 
          '网络信息不可用',
        hostname: window.location.hostname,
        apiUrls: [] as string[],
        backendStatus: [] as { url: string; status: string; error?: string }[]
      };

      // 生成可能的API URLs
      const possibleHosts = ['localhost', window.location.hostname];
      if (window.location.hostname !== 'localhost') {
        // 尝试常见的局域网地址
        const networkIPs = ['192.168.1.1', '192.168.100.140', '172.0.0.5', '192.168.243.195'];
        possibleHosts.push(...networkIPs);
      }

      info.apiUrls = possibleHosts.map(host => `http://${host}:8888`);

      // 测试每个后端连接
      for (const url of info.apiUrls) {
        try {
          const response = await fetch(`${url}/api/health`, { 
            method: 'GET',
            signal: AbortSignal.timeout(7500) // 7.5秒超时
          });
          
          if (response.ok) {
            const data = await response.json();
            info.backendStatus.push({
              url,
              status: '✅ 连接成功',
            });
          } else {
            info.backendStatus.push({
              url,
              status: `❌ HTTP ${response.status}`,
            });
          }
        } catch (error) {
          info.backendStatus.push({
            url,
            status: '❌ 连接失败',
            error: error instanceof Error ? error.message : String(error)
          });
        }
      }

      setDebugInfo(info);
    };

    checkConnections();
  }, []);

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  return (
    <div
      className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-4 rounded-lg max-w-sm border border-gray-600 z-50"
    >
      <div className="mb-2 font-bold text-yellow-400">
        🔧 {isMobile ? '移动端' : '桌面端'}调试信息
      </div>
      
      <div className="space-y-2">
        <div>
          <strong>设备:</strong> {debugInfo.screenSize}
        </div>
        
        <div>
          <strong>网络:</strong> {debugInfo.networkInfo}
        </div>
        
        <div>
          <strong>当前主机:</strong> {debugInfo.hostname}
        </div>

        <div>
          <strong>后端连接测试:</strong>
          <div className="mt-1 space-y-1 max-h-32 overflow-y-auto">
            {debugInfo.backendStatus.map((status, index) => (
              <div key={index} className="text-xs">
                <div className="font-mono">{status.url}</div>
                <div className={`ml-2 ${status.status.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
                  {status.status}
                  {status.error && (
                    <div className="text-gray-400 text-xs truncate">
                      {status.error}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {isMobile && (
          <div className="text-yellow-300 text-xs border-t border-gray-600 pt-2">
            <strong>移动端提示:</strong><br/>
            确保手机和电脑在同一WiFi网络下
          </div>
        )}
      </div>
    </div>
  );
}