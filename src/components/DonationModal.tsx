import React, { useState } from 'react';
import { GlassMorphismModal } from './GlassMorphismModal';
// 移除framer-motion导入

const DonationModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setShowQRCode(true);
    } else {
      setShowQRCode(false);
    }
  };

  return (
    <>
      {/* 捐赠按钮 - 固定在右下角 */}
      <button
        className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-pink-600 shadow-2xl flex items-center justify-center text-white hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition-all duration-300 hover:scale-110 animate-pulse"
        onClick={toggleModal}
        aria-label="捐赠支持"
        style={{
          boxShadow: '0 8px 32px rgba(239, 68, 68, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'
        }}
      >
        <i className="fa-solid fa-heart text-2xl drop-shadow-lg text-red-100"></i>
      </button>

      {/* 捐赠模态框 */}
      {/* 移除AnimatePresence，使用条件渲染 */}
      <GlassMorphismModal
        isOpen={isOpen}
        onClose={toggleModal}
      >
          
          {/* 模态框内容 */}
          <div
            className="relative bg-[#0b0b0b] border border-slate-600/30 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
          >
            {/* 头部 */}
            <div className="p-6 border-b border-slate-600/30">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <i className="fa-solid fa-heart text-amber-400"></i>
                  捐赠支持
                </h3>
                <button
                  onClick={toggleModal}
                  className="text-slate-400 hover:text-white transition-colors"
                  aria-label="关闭"
                >
                  <i className="fa-solid fa-xmark text-xl"></i>
                </button>
              </div>
            </div>
            
            {/* 内容 */}
            <div className="p-6">
              <p className="text-slate-300 mb-6">
                感谢您对本项目的支持！您的捐赠将帮助我们持续改进和维护服务。
              </p>
              
              {/* 二维码区域 */}
              <div className="flex flex-col items-center mb-6">
                {/* 移除AnimatePresence，使用条件渲染 */}
                {showQRCode && (
                  <div
                    className="mb-4"
                  >
                    <img 
                      src="/捐赠码.jpg" 
                      alt="捐赠二维码" 
                      className="max-w-full h-auto"
                    />
                  </div>
                )}
                
                <p className="text-slate-400 text-sm text-center">
                  扫描二维码进行捐赠
                </p>
              </div>
              
              {/* 捐赠说明 */}
              <div className="bg-amber-500/10 border border-amber-400/30 rounded-lg p-4 mb-6">
                <h4 className="text-amber-400 font-semibold mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-circle-info"></i>
                  捐赠说明
                </h4>
                <ul className="text-amber-200 text-sm space-y-1">
                  <li>• 捐赠为自愿行为，不提供任何特权服务</li>
                  <li>• 捐赠金额将用于服务器维护和功能开发</li>
                  <li>• 感谢您的支持与信任！</li>
                </ul>
              </div>
            </div>
            
            {/* 底部按钮 */}
            <div className="p-6 border-t border-slate-600/30 flex justify-end gap-3">
              <button
                onClick={toggleModal}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
      </GlassMorphismModal>
    </>
  );
};

export default DonationModal;