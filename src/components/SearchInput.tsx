import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { GradientText } from './GradientText'; // 导入渐变文字组件
// 移除framer-motion导入

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  disabled?: boolean;
}

export function SearchInput({ value, onChange, onSearch, disabled = false }: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const [showHistory, setShowHistory] = useState(false);
  const { searchHistory, addSearchHistory, clearSearchHistory, removeSearchHistory } = useSearchHistory();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  
  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowHistory(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localValue.trim()) {
      addSearchHistory(localValue.trim());
      onSearch();
      setShowHistory(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
    onChange(e.target.value);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && localValue.trim()) {
      addSearchHistory(localValue.trim());
      onSearch();
      setShowHistory(false);
    } else if (e.key === 'Escape') {
      setShowHistory(false);
    }
  };
  
  const handleHistoryClick = (keyword: string) => {
    setLocalValue(keyword);
    onChange(keyword);
    setShowHistory(false);
    // 自动触发搜索
    setTimeout(() => {
      onSearch();
    }, 0);
  };
  
  const handleHistoryDelete = (e: React.MouseEvent, keyword: string) => {
    e.stopPropagation();
    removeSearchHistory(keyword);
  };
  
  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };
  
  return (
    // 移除motion.div，使用普通div
    <div 
      className="w-full max-w-3xl mx-auto relative" 
      ref={dropdownRef}
    >
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
          
          {/* 右侧按钮组 */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            {/* 搜索历史按钮 */}
            {/* 移除motion.button，使用普通button */}
            <button
              type="button"
              onClick={toggleHistory}
              disabled={disabled}
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-lg",
                "text-slate-400 hover:text-blue-600 hover:bg-blue-50",
                "transition-all duration-100",
                disabled && "cursor-not-allowed"
              )}
            >
              {/* 移除motion.i，使用普通i */}
              <i 
                className={cn(
                  "fa-solid fa-chevron-down text-xs transition-transform duration-200",
                  showHistory && "rotate-180"
                )}
                style={{ color: showHistory ? '#3b82f6' : '#94a3b8' }}
              ></i>
            </button>
            
            {/* 搜索按钮 */}
            {/* 移除motion.button，使用普通button */}
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
      
      {/* 搜索历史下拉菜单 */}
      {showHistory && (
        // 移除motion.div，使用普通div
        <div 
          className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto"
        >
          {searchHistory.length > 0 ? (
            <>
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <span className="text-sm font-medium text-slate-700 flex items-center">
                  <i className="fa-solid fa-history mr-2 text-blue-500"></i>
                  <GradientText gradient="primary" animate={true}>
                    搜索历史
                  </GradientText>
                </span>
                {/* 移除motion.button，使用普通button */}
                <button
                  onClick={clearSearchHistory}
                  className="text-xs text-slate-500 hover:text-red-500 px-2 py-1 rounded hover:bg-red-50 transition-all duration-100"
                >
                  <i className="fa-solid fa-trash-can mr-1"></i>
                  清空
                </button>
              </div>
              <div className="py-2">
                {searchHistory.map((keyword, index) => (
                  // 移除motion.div，使用普通div
                  <div
                    key={index}
                    className="flex items-center justify-between px-4 py-2.5 cursor-pointer group transition-all duration-100 hover:bg-blue-50"
                    onClick={() => handleHistoryClick(keyword)}
                  >
                    <div className="flex items-center flex-1">
                      <i className="fa-solid fa-clock-rotate-left text-slate-400 mr-3 text-sm group-hover:text-blue-500"></i>
                      <span className="text-slate-700 truncate group-hover:text-blue-600 font-medium transition-colors duration-100">{keyword}</span>
                    </div>
                    {/* 移除motion.button，使用普通button */}
                    <button
                      onClick={(e) => handleHistoryDelete(e, keyword)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-all duration-100"
                    >
                      <i className="fa-solid fa-times text-xs"></i>
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            // 移除motion.div，使用普通div
            <div 
              className="px-4 py-8 text-center text-slate-500"
            >
              <i className="fa-solid fa-clock-rotate-left text-2xl mb-2 text-slate-300"></i>
              <p className="text-sm font-medium">暂无搜索历史</p>
              <p className="text-xs text-slate-400 mt-1">开始搜索，创建您的专属记录</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}