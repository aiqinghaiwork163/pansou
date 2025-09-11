import React, { ReactNode, useEffect } from 'react';

interface GlassMorphismModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const GlassMorphismModal: React.FC<GlassMorphismModalProps> = ({ 
  isOpen, 
  onClose, 
  children 
}) => {
  // 当模态窗口打开时，禁止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9998]" 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9998
      }}
    >
      {/* 背景遮罩层 - 已移除模糊效果 */}
      <div 
        className="absolute inset-0 bg-black/40 animate-fadeIn" 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.4)'
        }}
      />
      
      {/* 内容容器 - 已移除固定居中 */}
      <div 
        className="relative z-[9999] animate-popIn"
        style={{
          position: 'relative',
          zIndex: 9999,
          maxWidth: '410px',
          width: '90%',
          margin: '10% auto',
          display: 'block'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};