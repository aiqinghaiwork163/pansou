// API配置文件
import { cleanSensitiveData } from '@/utils/localStorageCleaner';

const apiConfig = {
  // 默认API地址
  defaultApiUrl: 'https://api.aiqinghaiwork.cn', // 更新为您的生产环境API地址
  
  // 预设API地址列表 -
  presetApiUrls: [
    'https://api.aiqinghaiwork.cn', // 站点1
'https://so.252035.xyz', // 站点2
'https://sou.makifx.com', // 站点3
'https://154.12.80.83', // 站点4
'https://gcm.yyr277.fun:5000/pansou', // 站点5
'https://api.jkai.de', // 站点6
'https://dm.xueximeng.com/pansou', // 站点7
'https://31.57.170.83/pansou', // 站点8
'https://pan.embyserver.dpdns.org:16666', // 站点9
'https://pan.ipv4.embyserver.dpdns.org:16666', // 站点10
'https://pan.ipv6.embyserver.dpdns.org:16666' // 站点11
  ],
  
  // 获取当前API地址
  getApiUrl: (): string => {
    // 优先从localStorage获取用户自定义的API地址
    const customApiUrl = localStorage.getItem('customApiUrl');
    if (customApiUrl) {
      return customApiUrl;
    }
    
    // 其次使用环境变量配置的API地址
    if (import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
    
    // 如果没有配置环境变量，使用默认地址
    return apiConfig.defaultApiUrl;
  },
  
  // 获取预设API地址列表
  getPresetApiUrls: (): string[] => {
    return apiConfig.presetApiUrls;
  },
  
  // 设置自定义API地址
  setCustomApiUrl: (url: string): void => {
    if (url && url.trim() !== '') {
      localStorage.setItem('customApiUrl', url.trim());
    } else {
      localStorage.removeItem('customApiUrl');
    }
  },
  
  // 获取自定义API地址
  getCustomApiUrl: (): string | null => {
    return localStorage.getItem('customApiUrl');
  },
  
  // 重置为默认API地址
  resetToDefault: (): void => {
    localStorage.removeItem('customApiUrl');
  },
  
  // 验证API地址格式
  validateApiUrl: (url: string): boolean => {
    if (!url || url.trim() === '') return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
  
  // 构建搜索API URL
  buildSearchUrl: (keyword: string): string => {
    const baseUrl = apiConfig.getApiUrl();
    const encodedKeyword = encodeURIComponent(keyword);
    
    // 为特定站点添加特殊参数
    if (baseUrl.includes('252035.xyz')) {
      return `${baseUrl}/api/search?kw=${encodedKeyword}&src=all&res=merge`;
    }
    
    // 使用最简单的参数格式，不添加额外参数以获取完整结果
    return `${baseUrl}/api/search?kw=${encodedKeyword}`;
  },
  
  // 构建指定基础URL的搜索API URL
  buildSearchUrlWithBase: (keyword: string, baseUrl: string): string => {
    const encodedKeyword = encodeURIComponent(keyword);
    
    // 为特定站点添加特殊参数
    if (baseUrl.includes('252035.xyz')) {
      return `${baseUrl}/api/search?kw=${encodedKeyword}&src=all&res=merge`;
    }
    
    // 使用最简单的参数格式
    return `${baseUrl}/api/search?kw=${encodedKeyword}`;
  },
  
  // 测试API连接
  testConnection: async (url: string): Promise<{ success: boolean; message: string }> => {
    if (!apiConfig.validateApiUrl(url)) {
      return {
        success: false,
        message: '请输入有效的API地址，需要包含协议（http:// 或 https://）'
      };
    }

    try {
      // 构建测试URL（使用一个简单的关键词）
      const testUrl = `${url}/api/search?kw=test`;
      
      // 设置超时
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时
      
      const response = await fetch(testUrl, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return {
          success: true,
          message: '连接成功！API地址有效'
        };
      } else {
        return {
          success: false,
          message: `连接失败，HTTP状态码: ${response.status}`
        };
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          message: '连接超时，请检查API地址是否正确'
        };
      } else {
        return {
          success: false,
          message: `连接失败: ${error.message}`
        };
      }
    }
  },
  
  // 初始化清理（在首次导入时执行）
  initialize: (): void => {
    // 检查是否需要执行清理
    const cleanupKey = 'apiConfigCleanupPerformed_v1';
    if (!localStorage.getItem(cleanupKey)) {
      cleanSensitiveData();
      localStorage.setItem(cleanupKey, 'true');
    }
  }
};

// 在模块加载时执行初始化
apiConfig.initialize();

export default apiConfig;