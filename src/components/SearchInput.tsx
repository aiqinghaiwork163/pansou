import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
// 移除历史搜索功能
// import { useSearchHistory } from '@/hooks/useSearchHistory';
// import { GradientText } from './GradientText'; // 导入渐变文字组件

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  disabled?: boolean;
}

export function SearchInput({ value, onChange, onSearch, disabled = false }: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);
  // 移除历史搜索功能
  // const [showHistory, setShowHistory] = useState(false);
  // const { searchHistory, addSearchHistory, clearSearchHistory, removeSearchHistory } = useSearchHistory();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  
  // 移除历史搜索功能 - 点击外部关闭下拉菜单
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
  //       setShowHistory(false);
  //     }
  //   };
  //   
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => document.removeEventListener('mousedown', handleClickOutside);
  // }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localValue.trim()) {
      // 移除历史搜索功能 - 不再添加搜索历史
      // addSearchHistory(localValue.trim());
      onSearch();
      // setShowHistory(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
    onChange(e.target.value);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && localValue.trim()) {
      // 移除历史搜索功能 - 不再添加搜索历史
      // addSearchHistory(localValue.trim());
      onSearch();
      // setShowHistory(false);
    } else if (e.key === 'Escape') {
      // setShowHistory(false);
    }
  };
  
  // 移除历史搜索功能 - 历史记录点击处理
  // const handleHistoryClick = (keyword: string) => {
  //   setLocalValue(keyword);
  //   onChange(keyword);
  //   setShowHistory(false);
  //   setTimeout(() => {
  //     onSearch();
  //   }, 0);
  // };
  
  // 移除历史搜索功能 - 历史记录删除处理
  // const handleHistoryDelete = (e: React.MouseEvent, keyword: string) => {
  //   e.stopPropagation();
  //   removeSearchHistory(keyword);
  // };
  
  // 移除历史搜索功能 - 切换历史记录显示
  // const toggleHistory = () => {
  //   setShowHistory(!showHistory);
  // };
  
  return (
    // 移除历史搜索功能 - 简化组件结构
    <div className="w-full max-w-3xl mx-auto relative">
      <form onSubmit={handleSubmit} className="relative">
        {/* 搜索输入框容器 */}
        <div className="relative">
          <input
            type="text"
            value={localValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="🔍 输入关键词，探索无限可能..."
            className={cn(
              "w-full h-14 pl-12 pr-24 rounded-xl border border-slate-200 bg-white",
              "focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none",
              "shadow-sm hover:shadow-md focus:shadow-lg",
              "text-slate-700 placeholder-slate-400",
              "transition-all duration-100 ease-out",
              "text-base font-medium",
              disabled ? "bg-gray-50 cursor-not-allowed" : "bg-white hover:bg-white focus:bg-white"
            )}
          />
          
          {/* 搜索图标 */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            {/* 移除motion.i，使用普通i */}
            <i 
              className="fa-solid fa-search text-slate-400"
              style={{ 
                color: localValue ? '#3b82f6' : '#94a3b8'
              }}
            ></i>
          </div>
          
          {/* 右侧按钮组 - 移除历史搜索按钮 */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
        {/* 搜索按钮 */}
        <button
          type="submit"
          disabled={!localValue.trim() || disabled}
          className={cn(
            "h-10 px-4 rounded-lg font-medium transition-all duration-150 flex items-center gap-2",
            "shadow-sm hover:shadow-md",
            localValue.trim() 
              ? "bg-blue-600 hover:bg-blue-700 text-white" 
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          )}
        >
          <i className="fa-solid fa-search text-sm"></i>
          <span className="hidden sm:inline whitespace-nowrap">搜索</span>
        </button>
      </div>
        </div>
      </form>
    </div>
  );
}