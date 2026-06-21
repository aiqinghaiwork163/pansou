import { useState, useEffect } from 'react';
import apiConfig from '@/config/apiConfig';

export function useApiConfig() {
  const [customApiUrl, setCustomApiUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 初始化加载自定义API URL
  useEffect(() => {
    const url = apiConfig.getCustomApiUrl() || '';
    setCustomApiUrl(url);
    setIsValidUrl(url ? apiConfig.validateApiUrl(url) : true);
  }, []);

  // 保存自定义API URL
  const saveCustomApiUrl = async (url: string) => {
    setLoading(true);
    setError(null);
    
    try {
      if (url && !apiConfig.validateApiUrl(url)) {
        throw new Error('请输入有效的URL地址，必须包含http://或https://');
      }

      if (url) {
        apiConfig.setCustomApiUrl(url);
      } else {
        apiConfig.resetToDefault();
      }

      setCustomApiUrl(url);
      setIsValidUrl(url ? apiConfig.validateApiUrl(url) : true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 重置为默认配置
  const resetToDefault = async () => {
    setLoading(true);
    setError(null);
    
    try {
      apiConfig.resetToDefault();
      setCustomApiUrl('');
      setIsValidUrl(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '重置失败');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    customApiUrl,
    isValidUrl,
    loading,
    error,
    saveCustomApiUrl,
    resetToDefault
  };
}