// 历史搜索功能已移除 - useSearchHistory hook 已注释掉
/*
import { useState, useEffect } from 'react'
import { searchHistoryService, SearchHistory } from '@/lib/supabase'

export const useSearchHistory = () => {
  const [history, setHistory] = useState<SearchHistory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 加载搜索历史
  const loadHistory = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await searchHistoryService.getSearchHistory()
      setHistory(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载搜索历史失败')
    } finally {
      setLoading(false)
    }
  }

  // 添加搜索记录
  const addSearchRecord = async (keyword: string, resultsCount: number, searchTime: number) => {
    try {
      await searchHistoryService.addSearchRecord(keyword, resultsCount, searchTime)
      // 重新加载历史记录
      await loadHistory()
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存搜索记录失败')
    }
  }

  // 清空搜索历史
  const clearHistory = async () => {
    try {
      setLoading(true)
      await searchHistoryService.clearSearchHistory()
      setHistory([])
    } catch (err) {
      setError(err instanceof Error ? err.message : '清空搜索历史失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  return {
    history,
    loading,
    error,
    addSearchRecord,
    clearHistory,
    refreshHistory: loadHistory
  }
}
*/