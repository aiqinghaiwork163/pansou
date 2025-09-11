import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/authContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * 受保护的路由组件
 * 如果用户未登录，将重定向到认证页面
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // 如果用户已登录，显示子组件
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // 如果用户未登录，重定向到认证页面
  return <Navigate to="/auth" replace />;
};

export default ProtectedRoute;