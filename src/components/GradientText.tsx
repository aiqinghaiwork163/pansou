// 移除framer-motion导入
import { cn } from '@/lib/utils';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  gradient?: 'primary' | 'secondary' | 'accent' | 'rainbow' | 'colorful' | 'neon' | 'sunset' | 'ocean';
  animate?: boolean;
}

export function GradientText({ 
  children, 
  className = '', 
  gradient = 'colorful',
  animate = true 
}: GradientTextProps) {
  const gradientStyles = {
    primary: 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600',
    secondary: 'bg-gradient-to-r from-purple-400 via-pink-500 to-red-500',
    accent: 'bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-600',
    rainbow: 'bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 via-purple-500 to-pink-500',
    colorful: 'bg-gradient-to-r from-pink-500 via-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 via-purple-500 to-pink-500',
    neon: 'bg-gradient-to-r from-cyan-300 via-violet-400 to-fuchsia-400',
    sunset: 'bg-gradient-to-r from-orange-400 via-red-400 to-pink-400', 
    ocean: 'bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400'
  };

  return (
    <span
      className={cn(
        'bg-clip-text text-transparent',
        gradientStyles[gradient],
        animate && 'bg-size-200 animate-gradient bg-[length:400%_400%]',
        className
      )}
      style={{
        backgroundSize: animate ? '400% 400%' : '100% 100%',
        animation: animate ? 'gradient-shift 6s ease infinite' : 'none'
      }}
    >
      {children}
    </span>
  );
}

// 预设的文字渐变组件
export function PrimaryGradientText({ children, className, animate }: Omit<GradientTextProps, 'gradient'>) {
  return (
    <GradientText gradient="primary" className={className} animate={animate}>
      {children}
    </GradientText>
  );
}

export function SecondaryGradientText({ children, className, animate }: Omit<GradientTextProps, 'gradient'>) {
  return (
    <GradientText gradient="secondary" className={className} animate={animate}>
      {children}
    </GradientText>
  );
}

export function AccentGradientText({ children, className, animate }: Omit<GradientTextProps, 'gradient'>) {
  return (
    <GradientText gradient="accent" className={className} animate={animate}>
      {children}
    </GradientText>
  );
}

export function RainbowGradientText({ children, className, animate }: Omit<GradientTextProps, 'gradient'>) {
  return (
    <GradientText gradient="rainbow" className={className} animate={animate}>
      {children}
    </GradientText>
  );
}

// 新增炫彩渐变组件
export function ColorfulGradientText({ children, className, animate = true }: Omit<GradientTextProps, 'gradient'>) {
  return (
    <GradientText gradient="colorful" className={className} animate={animate}>
      {children}
    </GradientText>
  );
}

export function NeonGradientText({ children, className, animate = true }: Omit<GradientTextProps, 'gradient'>) {
  return (
    <GradientText gradient="neon" className={className} animate={animate}>
      {children}
    </GradientText>
  );
}

export function SunsetGradientText({ children, className, animate = true }: Omit<GradientTextProps, 'gradient'>) {
  return (
    <GradientText gradient="sunset" className={className} animate={animate}>
      {children}
    </GradientText>
  );
}

export function OceanGradientText({ children, className, animate = true }: Omit<GradientTextProps, 'gradient'>) {
  return (
    <GradientText gradient="ocean" className={className} animate={animate}>
      {children}
    </GradientText>
  );
}