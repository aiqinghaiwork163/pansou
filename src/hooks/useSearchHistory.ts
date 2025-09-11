import { useState, useEffect } from 'react';

const SEARCH_HISTORY_KEY = 'search_history';
const MAX_HISTORY_ITEMS = 10;

export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // 从localStorage加载搜索历史
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (saved) {
        const history = JSON.parse(saved);
        setSearchHistory(Array.isArray(history) ? history : []);
      }
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
  }, []);

  // 添加搜索记录
  const addSearchHistory = (keyword: string) => {
    if (!keyword.trim()) return;
    
    setSearchHistory(prevHistory => {
      // 移除重复项并添加到开头
      const filtered = prevHistory.filter(item => item !== keyword.trim());
      const newHistory = [keyword.trim(), ...filtered].slice(0, MAX_HISTORY_ITEMS);
      
      // 保存到localStorage
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
      } catch (error) {
        console.error('Failed to save search history:', error);
      }
      
      return newHistory;
    });
  };

  // 删除单个搜索记录
  const removeSearchHistory = (keyword: string) => {
    setSearchHistory(prevHistory => {
      const newHistory = prevHistory.filter(item => item !== keyword);
      
      // 保存到localStorage
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
      } catch (error) {
        console.error('Failed to save search history:', error);
      }
      
      return newHistory;
    });
  };

  // 清空搜索历史
  const clearSearchHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (error) {
      console.error('Failed to clear search history:', error);
    }
  };

  return {
    searchHistory,
    addSearchHistory,
    removeSearchHistory,
    clearSearchHistory
  };
}