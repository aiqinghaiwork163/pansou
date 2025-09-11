import React from 'react';

interface AuroraBackgroundProps {
  children?: React.ReactNode;
}

const AuroraBackground: React.FC<AuroraBackgroundProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 固定的极光背景层 */}
      <div className="fixed inset-0 z-0">
        {/* 主要极光 - 左侧 */}
        <div
          className="absolute top-[-20%] left-[-10%] w-[70%] h-[140%] bg-gradient-to-r from-purple-600/30 via-blue-400/30 to-transparent rounded-full blur-3xl"
        />

        {/* 次要极光 - 右侧 */}
        <div
          className="absolute top-[20%] right-[-10%] w-[60%] h-[120%] bg-gradient-to-l from-cyan-500/30 via-blue-600/30 to-transparent rounded-full blur-3xl"
        />

        {/* 点缀极光 - 顶部 */}
        <div
          className="absolute top-[-10%] left-[30%] w-[40%] h-[40%] bg-gradient-to-b from-pink-500/30 via-purple-500/30 to-transparent rounded-full blur-3xl"
        />

        {/* 点缀极光 - 底部 */}
        <div
          className="absolute bottom-[-20%] right-[20%] w-[50%] h-[50%] bg-gradient-to-t from-indigo-600/30 via-blue-400/30 to-transparent rounded-full blur-3xl"
        />

        {/* 中央渐变遮罩层 - 从透明到深色背景 */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#0b0b0b]/60 to-[#0b0b0b]/90 z-10"></div>
        
        {/* 生成的星星效果 */}
        <div className="absolute inset-0 z-5">
          {[...Array(100)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-[2px] h-[2px] rounded-full bg-white opacity-70"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `twinkle ${3 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* 内容层 */}
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
};

export default AuroraBackground;