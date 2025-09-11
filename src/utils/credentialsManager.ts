// 用户凭据管理工具
interface UserCredentials {
  username: string;
  password: string;
}

class CredentialsManager {
  // 默认凭据
  public readonly defaultCredentials: UserCredentials = {
    username: 'admin',
    password: 'password123'
  };

  private readonly storageKey = 'userCredentials';

  // 获取当前凭据
  getCredentials(): UserCredentials {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const credentials = JSON.parse(stored);
        // 验证格式
        if (credentials && credentials.username && credentials.password) {
          return credentials;
        }
      }
    } catch (error) {
      console.warn('读取用户凭据失败，使用默认凭据:', error);
    }
    
    // 返回默认凭据
    return { ...this.defaultCredentials };
  }

  // 设置凭据
  setCredentials(username: string, password: string): boolean {
    if (!username || !password) {
      return false;
    }

    try {
      const credentials: UserCredentials = { username, password };
      localStorage.setItem(this.storageKey, JSON.stringify(credentials));
      return true;
    } catch (error) {
      console.error('保存用户凭据失败:', error);
      return false;
    }
  }

  // 重置为默认凭据
  resetToDefault(): boolean {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.defaultCredentials));
      return true;
    } catch (error) {
      console.error('重置用户凭据失败:', error);
      return false;
    }
  }

  // 验证凭据
  validateCredentials(username: string, password: string): boolean {
    const currentCredentials = this.getCredentials();
    return currentCredentials.username === username && currentCredentials.password === password;
  }

  // 清除凭据
  clearCredentials(): boolean {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error('清除用户凭据失败:', error);
      return false;
    }
  }
}

// 导出单例实例
const credentialsManager = new CredentialsManager();
export default credentialsManager;