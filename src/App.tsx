import { Routes, Route, Navigate } from "react-router-dom";
import AntdHome from "@/pages/AntdHome";
import AntdDetail from "@/pages/AntdDetail";
import AntdApiDoc from "@/pages/AntdApiDoc";
import ApiConfigDemo from "@/pages/ApiConfigDemo";
import AntdAuthPage from "@/pages/AntdAuthPage";
import AntdUserManagement from "@/pages/AntdUserManagement";
import AntdRegisterPage from "@/pages/AntdRegisterPage";
import TestAdminPage from "@/pages/TestAdminPage";

import ProtectedRoute from "@/components/ProtectedRoute";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import { useAuth } from "@/contexts/authContext";
import { ConfigProvider } from "antd";
import zhCN from 'antd/lib/locale/zh_CN';
import 'antd/dist/reset.css';

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <ConfigProvider locale={zhCN}>
      <Routes>
        <Route path="/auth" element={isAuthenticated ? <Navigate to="/" /> : <AntdAuthPage />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <AntdRegisterPage />} />
        <Route path="/" element={
          <ProtectedRoute>
            <AntdHome />
          </ProtectedRoute>
        } />
        <Route path="/detail/:id" element={
          <ProtectedRoute>
            <AntdDetail />
          </ProtectedRoute>
        } />
        <Route path="/api-doc" element={
          <ProtectedRoute>
            <AntdApiDoc />
          </ProtectedRoute>
        } />
        <Route path="/api-config-demo" element={
          <ProtectedRoute>
            <ApiConfigDemo />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <AdminProtectedRoute>
            <AntdUserManagement />
          </AdminProtectedRoute>
        } />
        <Route path="/test-admin" element={
          <AdminProtectedRoute>
            <TestAdminPage />
          </AdminProtectedRoute>
        } />
        <Route path="/other" element={
          <ProtectedRoute>
            <div className="text-center text-xl">Other Page - Coming Soon</div>
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/auth"} />} />
      </Routes>
    </ConfigProvider>
  );
}