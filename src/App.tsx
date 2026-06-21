import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import { useAuth } from "@/contexts/authContext";
import { ConfigProvider, Spin } from "antd";
import zhCN from 'antd/lib/locale/zh_CN';
import 'antd/dist/reset.css';

const AntdHome = lazy(() => import("@/pages/AntdHome"));
const AntdDetail = lazy(() => import("@/pages/AntdDetail"));
const AntdApiDoc = lazy(() => import("@/pages/AntdApiDoc"));
const ApiConfigDemo = lazy(() => import("@/pages/ApiConfigDemo"));
const AntdAuthPage = lazy(() => import("@/pages/AntdAuthPage"));
const AntdUserManagement = lazy(() => import("@/pages/AntdUserManagement"));
const AntdRegisterPage = lazy(() => import("@/pages/AntdRegisterPage"));
const TestAdminPage = lazy(() => import("@/pages/TestAdminPage"));

function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spin size="large" />
    </div>
  );
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <ConfigProvider locale={zhCN}>
      <Suspense fallback={<RouteFallback />}>
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
      </Suspense>
    </ConfigProvider>
  );
}