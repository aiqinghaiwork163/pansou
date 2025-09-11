import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AuthUser {
  id?: number;
  username: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAdministrator: boolean;
  user: AuthUser | null;
  setIsAuthenticated: (authenticated: boolean) => void;
  setIsAdministrator: (administrator: boolean) => void;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticatedState] = useState(false);
  const [isAdministrator, setIsAdministratorState] = useState(false);
  const [user, setUserState] = useState<AuthUser | null>(null);

  useEffect(() => {
    // 检查本地存储中的认证状态
    const storedAuth = localStorage.getItem('isAuthenticated');
    if (storedAuth === 'true') {
      setIsAuthenticatedState(true);
      return;
    }
    
    // 检查 sessionStorage 中的密码认证状态
    const passwordAuth = sessionStorage.getItem('sopan_auth');
    if (passwordAuth) {
      try {
        const authData = JSON.parse(passwordAuth);
        if (authData.isAuthenticated && authData.expiresAt > Date.now()) {
          setIsAuthenticatedState(true);
          return;
        }
      } catch (err) {
        // 解析失败，清除认证信息
        sessionStorage.removeItem('sopan_auth');
      }
    }
    
    // 检查 sessionStorage 中的用户认证状态
    const userAuth = sessionStorage.getItem('sopan_user_auth');
    if (userAuth) {
      try {
        const authData = JSON.parse(userAuth);
        if (authData.isAuthenticated && authData.expiresAt > Date.now()) {
          setIsAuthenticatedState(true);
          // 设置用户信息
          if (authData.user) {
            setUserState({
              id: authData.user.id,
              username: authData.user.username
            });
            // 检查是否为管理员用户
            if (authData.user.username === 'admin') {
              setIsAdministratorState(true);
            }
          }
          return;
        }
      } catch (err) {
        // 解析失败，清除认证信息
        sessionStorage.removeItem('sopan_user_auth');
      }
    }
  }, []);

  const setIsAuthenticated = (authenticated: boolean) => {
    setIsAuthenticatedState(authenticated);
    localStorage.setItem('isAuthenticated', authenticated.toString());
  };

  const setIsAdministrator = (administrator: boolean) => {
    setIsAdministratorState(administrator);
  };

  const setUser = (user: AuthUser | null) => {
    setUserState(user);
  };

  const logout = () => {
    setIsAuthenticatedState(false);
    setIsAdministratorState(false);
    setUserState(null);
    localStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('sopan_auth');
    sessionStorage.removeItem('sopan_user_auth');
  };

  const contextValue = {
    isAuthenticated,
    isAdministrator,
    user,
    setIsAuthenticated,
    setIsAdministrator,
    setUser,
    logout
  };

  return React.createElement(
    AuthContext.Provider,
    { value: contextValue },
    children
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}