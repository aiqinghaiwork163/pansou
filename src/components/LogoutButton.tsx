import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '@/hooks/useUserAuth';

interface LogoutButtonProps {
  className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ className = '' }) => {
  const { logout } = useUserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  return (
    <button
      onClick={handleLogout}
      className={`px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors ${className}`}
    >
      退出登录
    </button>
  );
};

export default LogoutButton;