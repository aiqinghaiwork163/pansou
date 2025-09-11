import { useState, useEffect } from 'react';
import apiConfig from '@/config/apiConfig';

// API配置状态类型
interface ApiConfigState {
  currentUrl: string;
  customUrl: string | null;
  isCustom: boolean;
}

// API配置钩子返回类型
interface UseApiConfigReturn {
  config: ApiConfigState;
  setCustomUrl: (url: string) => void;
  resetToDefault: () => void;
  validateUrl: (url: string) => boolean;
  testConnection: (url: string) => Promise<{ success: boolean; message: string }>;
}

/**
 * 自定义钩子用于管理API配置
 * @returns API配置相关的状态和方法
 */
const useApiConfig = (): UseApiConfigReturn => {
  const [config, setConfig] = useState<ApiConfigState>({
    currentUrl: apiConfig.defaultApiUrl,
    customUrl: null,
    isCustom: false
  });

  // 初始化配置状态
  useEffect(() => {
    const currentUrl = apiConfig.getApiUrl();
    const customUrl = apiConfig.getCustomApiUrl();
    const isCustom = !!customUrl;
    
    setConfig({
      currentUrl,
      customUrl,
      isCustom
    });
  }, []);

  // 设置自定义API地址
  const setCustomUrl = (url: string) => {
    if (apiConfig.validateApiUrl(url)) {
      apiConfig.setCustomApiUrl(url);
      setConfig({
        currentUrl: url,
        customUrl: url,
        isCustom: true
      });
      return true;
    }
    return false;
  };

  // 重置为默认API地址
  const resetToDefault = () => {
    apiConfig.resetToDefault();
    setConfig({
      currentUrl: apiConfig.defaultApiUrl,
      customUrl: null,
      isCustom: false
    });
  };

  // 验证API地址格式
  const validateUrl = (url: string): boolean => {
    return apiConfig.validateApiUrl(url);
  };

  // 测试API连接
  const testConnection = async (url: string): Promise<{ success: boolean; message: string }> => {
    if (!validateUrl(url)) {
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
      const timeoutId = setTimeout(() => controller.abort(), 7500); // 7.5秒超时
      
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
  };

  return {
    config,
    setCustomUrl,
    resetToDefault,
    validateUrl,
    testConnection
  };
};

export default useApiConfig;