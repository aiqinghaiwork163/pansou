import { useEffect, useRef, useState } from 'react';
// 移除framer-motion导入

export function VueBitsCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorVariant, setCursorVariant] = useState('default');
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      
      // 根据元素类型设置不同的光标样式
      if (target.matches('button, a, [role="button"], .cursor-pointer')) {
        setCursorVariant('pointer');
        setIsHovering(true);
      } else if (target.matches('input, textarea')) {
        setCursorVariant('text');
        setIsHovering(true);
      } else {
        setCursorVariant('default');
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => {
      setCursorVariant('default');
      setIsHovering(false);
    };

    // 添加事件监听器
    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    
    // 为所有可交互元素添加hover效果
    const interactiveElements = document.querySelectorAll('button, a, [role="button"], .cursor-pointer, input, textarea');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    // 隐藏默认光标
    document.body.style.cursor = 'none';

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });

      // 恢复默认光标
      document.body.style.cursor = 'auto';
    };
  }, []);

  // 根据不同状态返回不同的光标变体
  const getCursorVariants = () => {
    const baseVariants = {
      default: {
        scale: 1,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
      },
      pointer: {
        scale: 1.5,
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        border: '1px solid rgba(59, 130, 246, 0.5)',
      },
      text: {
        scale: 1.2,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.4)',
      },
      click: {
        scale: 0.8,
        backgroundColor: 'rgba(236, 72, 153, 0.2)',
        border: '1px solid rgba(236, 72, 153, 0.6)',
      }
    };

    if (isClicking) return baseVariants.click;
    return baseVariants[cursorVariant as keyof typeof baseVariants] || baseVariants.default;
  };

  // 获取当前光标变体样式
  const currentVariant = getCursorVariants();

  return (
    <>
      {/* 主光标 */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] rounded-full backdrop-blur-sm"
        style={{
          left: cursorPosition.x,
          top: cursorPosition.y,
          transform: 'translate(-50%, -50%)',
          width: '24px',
          height: '24px',
          ...currentVariant
        }}
      />

      {/* 跟随光圈 */}
      <div
        className="fixed pointer-events-none z-[9998] rounded-full"
        style={{
          left: cursorPosition.x,
          top: cursorPosition.y,
          transform: 'translate(-50%, -50%)',
          width: '8px',
          height: '8px',
          backgroundColor: isHovering 
            ? 'rgba(99, 102, 241, 0.8)' 
            : 'rgba(255, 255, 255, 0.9)',
          scale: isClicking ? 0.5 : 1,
        }}
      />

      {/* 外层发光效果 */}
      <div
        className="fixed pointer-events-none z-[9997] rounded-full opacity-30"
        style={{
          left: cursorPosition.x,
          top: cursorPosition.y,
          transform: 'translate(-50%, -50%)',
          width: '40px',
          height: '40px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
          filter: 'blur(8px)',
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.6 : 0.3,
        }}
      />

      {/* 点击波纹效果 */}
      {isClicking && (
        <div
          className="fixed pointer-events-none z-[9996] rounded-full border border-purple-400"
          style={{
            left: cursorPosition.x,
            top: cursorPosition.y,
            transform: 'translate(-50%, -50%)',
            width: '80px',
            height: '80px',
            opacity: 0,
          }}
        />
      )}
    </>
  );
}