import { useEffect, useRef, useState, useMemo } from 'react';
// 移除framer-motion导入

export function TechCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorVariant, setCursorVariant] = useState('default');
  const [isVisible, setIsVisible] = useState(true);
  const [trailPoints, setTrailPoints] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const trailIdRef = useRef(0);
  const lastUpdate = useRef(0);
  const updateInterval = 16; // 约60fps

  // 移除Framer Motion的motion values和spring动画
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    try {
      const moveCursor = (e: MouseEvent) => {
        const now = performance.now();
        // 限制更新频率以提高性能
        if (now - lastUpdate.current < updateInterval) return;
        lastUpdate.current = now;

        setCursorPosition({ x: e.clientX, y: e.clientY });

        // 减少轨迹点数量以提高性能
        if (Math.random() > 0.3) { // 只有70%的概率添加轨迹点
          const newPoint = {
            x: e.clientX,
            y: e.clientY,
            id: trailIdRef.current++
          };

          setTrailPoints(prev => {
            const newTrail = [newPoint, ...prev];
            return newTrail.slice(0, 5); // 减少轨迹点数量从8到5
          });
        }
      };

      const handleMouseDown = () => setIsClicking(true);
      const handleMouseUp = () => setIsClicking(false);

      const handleMouseEnter = (e: Event) => {
        const target = e.target as HTMLElement;
        
        if (target && typeof target.matches === 'function') {
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
    } catch (error) {
      console.error('TechCursor initialization error:', error);
      setIsVisible(false);
      document.body.style.cursor = 'auto';
    }
  }, []);

  // 优化轨迹点清理
  useEffect(() => {
    const interval = setInterval(() => {
      setTrailPoints(prev => prev.slice(0, -1));
    }, 100); // 增加清理间隔以减少CPU使用

    return () => clearInterval(interval);
  }, []);

  // 优化光标变体计算
  const cursorVariants = useMemo(() => ({
    default: { scale: 1, rotate: 0 },
    pointer: { scale: 1.3, rotate: 180 },
    text: { scale: 1.1, rotate: 90 },
    click: { scale: 0.7, rotate: 360 }
  }), []);

  const getCursorVariants = () => {
    if (isClicking) return cursorVariants.click;
    return cursorVariants[cursorVariant as keyof typeof cursorVariants] || cursorVariants.default;
  };

  if (!isVisible) {
    return null;
  }

  // 获取当前光标变体样式
  const currentVariant = getCursorVariants();

  return (
    <>
      {/* 优化轨迹点渲染 */}
      {trailPoints.map((point, index) => (
        // 移除motion.div，使用普通div
        <div
          key={point.id}
          className="fixed pointer-events-none z-[9995] rounded-full"
          style={{
            left: point.x,
            top: point.y,
            transform: 'translate(-50%, -50%)',
            width: '3px',
            height: '3px',
            scale: 1 - (index * 0.2), // 简化的缩放效果
            opacity: 0.6 - (index * 0.1), // 简化的透明度效果
            backgroundColor: index === 0 ? 'rgba(0, 255, 255, 0.6)' : 'rgba(99, 102, 241, 0.1)',
          }}
        />
      ))}

      {/* 主光标 */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] flex items-center justify-center"
        style={{
          left: cursorPosition.x,
          top: cursorPosition.y,
          transform: `translate(-50%, -50%) scale(${currentVariant.scale}) rotate(${currentVariant.rotate}deg)`,
          width: '24px',
          height: '24px',
        }}
      >
        <div 
          className="absolute inset-0 border border-cyan-400 bg-cyan-400/5"
          style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          }}
        />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-px bg-cyan-400" />
          <div className="absolute w-px h-2 bg-cyan-400" />
        </div>
      </div>
    </>
  );
}