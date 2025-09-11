// localStorage清理工具
// 用于清除敏感信息和旧的存储键

/**
 * 清除localStorage中的敏感信息
 */
export function cleanSensitiveData(): void {
  try {
    // 清除旧的搜索历史记录键
    localStorage.removeItem('pansou_search_history');
    localStorage.removeItem('videoplayer_search_history');
    localStorage.removeItem('wangpan_search_history');
    
    // 清除用户凭据（如果存在）
    localStorage.removeItem('userCredentials');
    
    // 清除自定义API地址（如果需要）
    // localStorage.removeItem('customApiUrl');
    
    // 清除sidebarCollapsed（如果存在）
    localStorage.removeItem('sidebarCollapsed');
    
    console.log('Sensitive data cleaned from localStorage');
  } catch (error) {
    console.error('Failed to clean sensitive data:', error);
  }
}

/**
 * 检查是否存在敏感数据
 * @returns boolean 表示是否存在敏感数据
 */
export function hasSensitiveData(): boolean {
  try {
    const sensitiveKeys = [
      'userCredentials',
      'customApiUrl',
      'pansou_search_history',
      'videoplayer_search_history',
      'wangpan_search_history'
    ];
    
    return sensitiveKeys.some(key => localStorage.getItem(key) !== null);
  } catch (error) {
    console.error('Failed to check sensitive data:', error);
    return false;
  }
}

/**
 * 一次性清理函数，在应用启动时调用
 */
export function initializeCleanStorage(): void {
  // 检查是否已经执行过清理
  const cleanupPerformed = localStorage.getItem('cleanupPerformed_v1');
  
  if (!cleanupPerformed) {
    // 执行清理
    cleanSensitiveData();
    
    // 标记已执行清理
    localStorage.setItem('cleanupPerformed_v1', 'true');
  }
}