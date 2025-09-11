import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/authContext';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * 管理员受保护的路由组件
 * 只有管理员用户才能访问
 */
const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isAdministrator } = useAuth();

  // 如果用户是已认证的管理员，显示子组件
  if (isAuthenticated && isAdministrator) {
    return <>{children}</>;
  }

  // 如果用户未认证，重定向到认证页面
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // 如果用户已认证但不是管理员，重定向到首页
  return <Navigate to="/" replace />;
};

export default AdminProtectedRoute;