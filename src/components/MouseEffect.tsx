import { useEffect, useState, useRef } from 'react';
// 移除framer-motion导入

interface MousePosition {
  x: number;
  y: number;
}

export function MouseEffect() {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const rafRef = useRef<number>();

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      // 使用 requestAnimationFrame 确保流畅更新
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      rafRef.current = requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
        setIsVisible(true);
      });
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // 使用被动监听器提高性能
    window.addEventListener('mousemove', updateMousePosition, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // 移除所有motion.div，使用普通div
  return (
    <>
      {/* 主鼠标光圈 - 即时跟随 */}
      <div
        className="fixed pointer-events-none z-50 mix-blend-difference"
        style={{
          left: mousePosition.x - 16,
          top: mousePosition.y - 16,
          transform: `scale(${isVisible ? 1 : 0})`,
          opacity: isVisible ? 0.8 : 0,
        }}
      >
        <div className="w-8 h-8 rounded-full border border-blue-500 bg-blue-500/10" />
      </div>

      {/* 跟随小点 - 即时跟随 */}
      <div
        className="fixed pointer-events-none z-50"
        style={{
          left: mousePosition.x - 2,
          top: mousePosition.y - 2,
          transform: `scale(${isVisible ? 1 : 0})`
        }}
      >
        <div className="w-1 h-1 rounded-full bg-blue-600" />
      </div>

      {/* 轻微延迟圈 - 更快响应 */}
      <div
        className="fixed pointer-events-none z-40 opacity-40"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: `scale(${isVisible ? 1 : 0})`,
        }}
      >
        <div className="w-6 h-6 rounded-full border border-slate-400" />
      </div>
    </>
  );
}