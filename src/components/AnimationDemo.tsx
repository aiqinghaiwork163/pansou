import { useState } from 'react';
// 移除framer-motion导入
// 移除从AnimatedComponents导入的所有组件

export function AnimationDemo() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* 标题区域 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            {/* 移除NeonGlow和GlitchText，直接使用普通div */}
            <div className="block">
              <div className="text-2xl font-bold text-cyan-400">React Bits 风格动画演示</div>
            </div>
          </h1>
          <p className="text-slate-300 text-lg">
            基于 Framer Motion 实现的现代化动画组件库
          </p>
        </div>

        {/* 动画组件展示网格 - 移除StaggerContainer和StaggerItem */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* 3D 翻转卡片 - 简化为普通卡片 */}
          <div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-slate-600/30">
              <h3 className="text-xl font-semibold text-white mb-4">3D 翻转卡片</h3>
              <div className="w-full h-32">
                <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-medium">
                  普通卡片
                </div>
              </div>
            </div>
          </div>

          {/* 霓虹灯光效果 - 简化为普通文本 */}
          <div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-slate-600/30">
              <h3 className="text-xl font-semibold text-white mb-4">霓虹灯光</h3>
              <div className="space-y-4">
                <div className="block">
                  <div className="text-2xl font-bold text-cyan-400">NEON CYAN</div>
                </div>
                <div className="block">
                  <div className="text-2xl font-bold text-purple-400">NEON PURPLE</div>
                </div>
                <div className="block">
                  <div className="text-2xl font-bold text-pink-400">NEON PINK</div>
                </div>
              </div>
            </div>
          </div>

          {/* 文字解构动画 - 简化为普通文本 */}
          <div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-slate-600/30">
              <h3 className="text-xl font-semibold text-white mb-4">文字效果</h3>
              <div className="space-y-4">
                <div className="text-2xl font-bold text-cyan-400 block">
                  普通文本
                </div>
                <div className="text-lg text-purple-400 block">
                  普通效果
                </div>
              </div>
            </div>
          </div>

          {/* 液体按钮 - 简化为普通按钮 */}
          <div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-slate-600/30">
              <h3 className="text-xl font-semibold text-white mb-4">普通按钮</h3>
              <div className="space-y-4">
                <button 
                  onClick={() => setCount(count + 1)}
                  className="w-full px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg font-medium"
                >
                  <i className="fa-solid fa-plus mr-2"></i>
                  点击计数: {count}
                </button>
                <button 
                  onClick={() => setCount(0)}
                  className="w-full px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-lg font-medium"
                >
                  <i className="fa-solid fa-refresh mr-2"></i>
                  重置计数
                </button>
              </div>
            </div>
          </div>

          {/* 光束扫描效果 - 简化为普通容器 */}
          <div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-slate-600/30">
              <h3 className="text-xl font-semibold text-white mb-4">普通容器</h3>
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="text-center text-white">
                  <div className="text-lg font-medium mb-2">普通容器</div>
                  <div className="text-sm text-slate-300">无动画效果</div>
                </div>
              </div>
            </div>
          </div>

          {/* 数字滚动计数器 - 简化为普通数字显示 */}
          <div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-slate-600/30">
              <h3 className="text-xl font-semibold text-white mb-4">数字显示</h3>
              <div className="text-center space-y-4">
                <div>
                  <div className="text-3xl font-bold text-cyan-400">9999</div>
                  <div className="text-sm text-slate-300 mt-1">搜索次数</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">38+</div>
                  <div className="text-sm text-slate-300 mt-1">支持平台</div>
                </div>
              </div>
            </div>
          </div>

          {/* 故障文字效果 - 简化为普通文本 */}
          <div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-slate-600/30">
              <h3 className="text-xl font-semibold text-white mb-4">普通文本</h3>
              <div className="space-y-4">
                <div className="block">
                  <div className="text-xl font-bold text-green-400">LOW EFFECT</div>
                </div>
                <div className="block">
                  <div className="text-xl font-bold text-yellow-400">MEDIUM EFFECT</div>
                </div>
                <div className="block">
                  <div className="text-xl font-bold text-red-400">HIGH EFFECT</div>
                </div>
              </div>
            </div>
          </div>

          {/* 波纹效果 - 简化为普通容器 */}
          <div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-slate-600/30">
              <h3 className="text-xl font-semibold text-white mb-4">普通容器</h3>
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-8">
                <div className="text-center text-white">
                  <div className="text-lg font-medium">普通容器</div>
                  <div className="text-sm opacity-80 mt-1">No ripple effect</div>
                </div>
              </div>
            </div>
          </div>

          {/* 组合效果展示 - 简化为普通卡片 */}
          <div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-slate-600/30">
              <h3 className="text-xl font-semibold text-white mb-4">普通卡片</h3>
              <div className="w-full h-24">
                <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <div className="text-white font-bold">COMBO</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 底部说明 */}
        <div 
          className="mt-12 text-center"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-slate-600/20">
            <h3 className="text-lg font-semibold text-white mb-2">技术栈</h3>
            <p className="text-slate-300">
              基于 <span className="text-cyan-400 font-medium">Framer Motion</span> 实现，
              遵循项目 <span className="text-purple-400 font-medium">UI 优化规范</span>，
              提供 <span className="text-pink-400 font-medium">React Bits</span> 风格的现代化动画效果
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}