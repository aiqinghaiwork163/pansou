import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { getNetdiskIcon, getNetdiskColor } from '@/utils/netdiskUtils';

interface EnhancedSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  disabled?: boolean;
}

export function EnhancedSearchInput({ value, onChange, onSearch, disabled = false }: EnhancedSearchInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const [showHistory, setShowHistory] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { searchHistory, addSearchHistory, clearSearchHistory, removeSearchHistory } = useSearchHistory();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  
  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowHistory(false);
      }
    };
    
    // 同时监听鼠标和触摸事件以支持移动端
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // 阻止事件冒泡
    if (localValue.trim()) {
      addSearchHistory(localValue.trim());
      onSearch();
      setShowHistory(false);
    }
    return false; // 确保表单不提交
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
    onChange(e.target.value);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && localValue.trim()) {
      e.preventDefault(); // 阻止默认的表单提交行为
      e.stopPropagation(); // 阻止事件冒泡
      addSearchHistory(localValue.trim());
      onSearch();
      setShowHistory(false);
    } else if (e.key === 'Escape') {
      setShowHistory(false);
      inputRef.current?.blur();
    } else if (e.key === 'ArrowDown' && showHistory && searchHistory.length > 0) {
      // 当按下向下箭头键时，如果有历史记录则聚焦到第一个历史记录项
      e.preventDefault();
      const firstItem = document.querySelector('.search-history-item');
      if (firstItem instanceof HTMLElement) {
        firstItem.focus();
      }
    }
  };
  
  const handleHistoryClick = (keyword: string) => {
    setLocalValue(keyword);
    onChange(keyword);
    setShowHistory(false);
    setTimeout(() => {
      onSearch();
    }, 0);
  };
  
  const handleHistoryDelete = (e: React.MouseEvent, keyword: string) => {
    e.stopPropagation();
    removeSearchHistory(keyword);
  };
  
  // 点击输入框时显示历史记录
  const handleInputFocus = () => {
    setIsFocused(true);
    setShowHistory(true);
  };
  
  // 失去焦点时隐藏历史记录
  const handleInputBlur = () => {
    setIsFocused(false);
    // 使用setTimeout确保点击历史记录项时不会立即隐藏
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setShowHistory(false);
      }
    }, 150);
  };

  return (
    <div 
      className="w-full max-w-3xl mx-auto relative" 
      ref={dropdownRef}
    >
      <form 
        onSubmit={handleSubmit} 
        className="relative"
        action="#" // 添加action属性，确保即使在某些情况下也不会提交到其他页面
      >
        {/* 搜索输入框容器 */}
        <div className="relative flex items-center">
          <div className="absolute left-4 text-gray-500 pointer-events-none">
            <i className="fa-solid fa-search"></i>
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={localValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            disabled={disabled}
            placeholder="请输入您要搜索的内容"
            className={cn(
              "flex-grow h-14 pl-12 pr-4 rounded-full border",
              "focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
              "text-gray-900 placeholder-gray-500",
              "transition-all duration-200 ease-out",
              "text-base font-normal shadow-md",
              "bg-white hover:bg-gray-50",
              disabled ? "bg-gray-100 cursor-not-allowed" : ""
            )}
            style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
          />
          
          <button
            type="submit"
            disabled={!localValue.trim() || disabled}
            className={cn(
              "h-14 px-8 rounded-full font-medium ml-3",
              "transition-all duration-150",
              "flex items-center justify-center shadow-md",
              "bg-blue-600 hover:bg-blue-700 text-white",
              "border border-blue-600 hover:border-blue-700",
              !localValue.trim() || disabled ? "opacity-70 cursor-not-allowed" : ""
            )}
            style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
          >
            <span className="text-base">搜索</span>
          </button>
        </div>
      </form>
      
      {showHistory && (
        <div 
          className="absolute top-full left-0 right-0 mt-3 bg-white rounded-xl shadow-xl z-50 max-h-64 overflow-hidden border border-gray-200"
        >
          {searchHistory.length > 0 ? (
            <>
              <div 
                className="flex items-center justify-between px-4 py-3 border-b border-gray-200"
              >
                <span className="text-sm font-medium text-gray-800 flex items-center" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                  <i 
                    className="fa-solid fa-history mr-2 text-blue-500"
                  />
                  搜索历史
                </span>
                <button
                  onClick={clearSearchHistory}
                  className="px-3 py-1.5 rounded-md text-xs font-medium bg-red-100 hover:bg-red-200 text-red-600 border border-red-200 transition-all duration-150 shadow-sm"
                >
                  <div className="flex items-center">
                    <i className="fa-solid fa-trash-can mr-1.5"></i>
                    清空
                  </div>
                </button>
              </div>
              <div className="py-2 max-h-48 overflow-y-auto">
                {searchHistory.map((keyword, index) => (
                  <div
                    key={index}
                    className="search-history-item flex items-center justify-between px-4 py-3 cursor-pointer group transition-all duration-150 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
                    onClick={() => handleHistoryClick(keyword)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleHistoryClick(keyword);
                      } else if (e.key === 'ArrowDown' && index < searchHistory.length - 1) {
                        const nextItem = document.querySelector(`.search-history-item:nth-child(${index + 2})`) as HTMLElement;
                        nextItem?.focus();
                      } else if (e.key === 'ArrowUp' && index > 0) {
                        const prevItem = document.querySelector(`.search-history-item:nth-child(${index})`) as HTMLElement;
                        prevItem?.focus();
                      } else if (e.key === 'Escape') {
                        inputRef.current?.focus();
                      }
                    }}
                  >
                    <div className="flex items-center flex-1">
                      <i 
                        className="fa-solid fa-clock-rotate-left text-gray-500 mr-3 text-sm group-hover:text-blue-500"
                      />
                      <span className="text-gray-800 truncate group-hover:text-blue-700 font-normal transition-colors duration-150" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                        {keyword}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleHistoryDelete(e, keyword)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full bg-red-100 hover:bg-red-200 text-red-500 hover:text-red-600 transition-all duration-200 shadow-sm"
                    >
                      <i className="fa-solid fa-times text-xs"></i>
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div 
              className="px-4 py-8 text-center text-gray-500"
            >
              <i 
                className="fa-solid fa-clock-rotate-left text-2xl mb-2 text-gray-400"
              />
              <p className="text-sm font-normal" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>暂无搜索历史</p>
              <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>开始搜索，创建您的专属记录</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}