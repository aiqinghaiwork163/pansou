import { useState, useEffect, useRef } from 'react';
import { getNetdiskTypeFromUrl } from '@/utils/netdiskUtils';
import { getNetdiskTypeId } from '@/utils/netdiskTypeUtils';
import apiConfig from '@/config/apiConfig';

interface SearchResult {
  id: string;
  title: string;
  url: string;
  source: string;
  date: string;
  extractionCode?: string;
  netdiskType: string;
  [key: string]: any;
}

interface NetdiskType {
  id: string;
  name: string;
  count: number;
}

export function useSearch() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0); // 有效结果数量
  const [originalTotalResults, setOriginalTotalResults] = useState(0); // 原始结果数量（包含未知网盘）
  const [searchTime, setSearchTime] = useState(0);
  const [netdiskTypes, setNetdiskTypes] = useState<NetdiskType[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreResults, setHasMoreResults] = useState(false);
  const [loadingStage, setLoadingStage] = useState(1);

  // 用于存储累积的结果
  const accumulatedResults = useRef<SearchResult[]>([]);
  const accumulatedTypeMap = useRef<Map<string, { id: string; name: string; count: number }>>(new Map());
  // 用于跟踪已显示的结果数量
  const displayedCount = useRef(0);
  
  // 构建指定基础URL的搜索API URL
  const buildSearchUrlWithBase = (keyword: string, baseUrl: string): string => {
    const encodedKeyword = encodeURIComponent(keyword);
    
    // 为特定站点添加特殊参数
    if (baseUrl.includes('252035.xyz')) {
      return `${baseUrl}/api/search?kw=${encodedKeyword}&src=all&res=merge`;
    }
    
    // 使用最简单的参数格式
    return `${baseUrl}/api/search?kw=${encodedKeyword}`;
  };

  const search = async (searchKeyword: string) => {
    if (!searchKeyword.trim()) {
      setResults([]);
      setTotalResults(0);
      setNetdiskTypes([]);
      return;
    }

    setLoading(true);
    setError(null);
    setKeyword(searchKeyword);
    
    // 重置累积结果
    accumulatedResults.current = [];
    accumulatedTypeMap.current.clear();
    displayedCount.current = 0;
    setIsLoadingMore(false);
    setHasMoreResults(false);
    setLoadingStage(1);

    try {
      // 记录搜索开始时间
      const startTime = Date.now();

      // 获取预设的API地址列表
      const presetApiUrls = apiConfig.presetApiUrls;
      
      // 创建AbortController用于超时控制
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7500); // 7.5秒超时

      // 创建所有API端点的请求
      const requests = presetApiUrls.map(url => {
        const apiUrl = buildSearchUrlWithBase(searchKeyword, url);
        return fetch(apiUrl, { signal: controller.signal });
      });

      // 用于跟踪已完成的请求数量
      let completedRequests = 0;
      const totalRequests = requests.length;
      
      // 处理单个响应
      const processResponse = async (response: Response | null, error: any = null) => {
        completedRequests++;
        
        if (response && response.ok) {
          try {
            const responseData = await response.json();
            
            // 处理API返回的数据格式 - 增强兼容性
            if (responseData && (responseData.code === 200 || responseData.code === 0 || responseData.success === true || responseData.status === "success") && (responseData.data || responseData.result)) {
              // 支持多种数据格式
              const data = responseData.data || responseData.result;
              
              // 检查是否有merged_by_type字段，如果没有则直接使用data
              const resultsData = data.merged_by_type || data.results || data;

              // 遍历所有网盘类型
              if (resultsData) {
                // 如果resultsData是数组，直接处理
                if (Array.isArray(resultsData)) {
                  // 为每个结果添加网盘类型信息
                  const typedResults = resultsData.map((result: any, index: number) => {
                    // 使用智能识别函数获取网盘类型
                    const smartNetdiskType = getNetdiskTypeFromUrl(result.url, result.source || result.type || 'unknown');

                    return {
                      ...result,
                      id: `${smartNetdiskType}_${result.url || index}`,
                      netdiskType: result.type || smartNetdiskType,
                      smartNetdiskType: smartNetdiskType,
                      title: result.note || result.title || result.name || result.url || '未知标题',
                      source: result.source || result.type || smartNetdiskType,
                      date: result.datetime || result.date || '未知日期',
                      extractionCode: result.password || result.extraction_code || result.code || result.extract_code || undefined,
                    };
                  });

                  // 过滤掉"未知网盘"类型的结果，确保只添加有效结果到累积结果中
                  const validResults = typedResults.filter(result => result.smartNetdiskType !== '未知网盘');

                  // 添加到累积结果中
                  accumulatedResults.current.push(...validResults);

                  // 统计网盘类型（只统计有效结果）
                  validResults.forEach(result => {
                    const displayType = result.smartNetdiskType;
                    const typeId = getNetdiskTypeId(displayType);

                    if (!accumulatedTypeMap.current.has(displayType)) {
                      accumulatedTypeMap.current.set(displayType, {
                        id: typeId,
                        name: displayType,
                        count: 0,
                      });
                    }
                    // 修复：确保typeEntry存在再访问
                    const typeEntry = accumulatedTypeMap.current.get(displayType);
                    if (typeEntry) {
                      typeEntry.count += 1;
                    }
                  });
                }
                // 如果resultsData是对象，按网盘类型处理
                else if (typeof resultsData === 'object') {
                  Object.entries(resultsData).forEach(([netdiskType, results]) => {
                    if (Array.isArray(results)) {
                      // 为每个结果添加网盘类型信息
                      const typedResults = results.map((result: any, index: number) => {
                        // 使用智能识别函数获取网盘类型
                        const smartNetdiskType = getNetdiskTypeFromUrl(result.url, result.source || netdiskType);

                        return {
                          ...result,
                          id: `${netdiskType}_${result.url || index}`,
                          netdiskType: netdiskType,
                          smartNetdiskType: smartNetdiskType,
                          title: result.note || result.title || result.name || result.url || '未知标题',
                          source: result.source || netdiskType,
                          date: result.datetime || result.date || '未知日期',
                          extractionCode: result.password || result.extraction_code || result.code || result.extract_code || undefined,
                        };
                      });

                      // 过滤掉"未知网盘"类型的结果，确保只添加有效结果到累积结果中
                      const validResults = typedResults.filter(result => result.smartNetdiskType !== '未知网盘');

                      // 添加到累积结果中
                      accumulatedResults.current.push(...validResults);

                      // 统计网盘类型（只统计有效结果）
                      validResults.forEach(result => {
                        const displayType = result.smartNetdiskType;
                        const typeId = getNetdiskTypeId(displayType);

                        if (!accumulatedTypeMap.current.has(displayType)) {
                          accumulatedTypeMap.current.set(displayType, {
                            id: typeId,
                            name: displayType,
                            count: 0,
                          });
                        }
                        // 修复：确保typeEntry存在再访问
                        const typeEntry = accumulatedTypeMap.current.get(displayType);
                        if (typeEntry) {
                          typeEntry.count += 1;
                        }
                      });
                    }
                  });
                }
              }
            }
            
            // 更新UI显示累积的结果
            updateUIWithAccumulatedResults();
          } catch (err) {
            // 忽略单个API的解析错误
            console.warn('Failed to parse API response:', err);
          }
        }
        
        // 检查是否所有请求都已完成
        if (completedRequests === totalRequests) {
          clearTimeout(timeoutId);
          
          // 计算搜索时间
          const endTime = Date.now();
          setSearchTime(endTime - startTime);
          
          // 最终更新UI
          updateUIWithAccumulatedResults(true);
          
          setLoading(false);
        } else {
          // 还有请求未完成，更新加载状态
          setIsLoadingMore(true);
          setHasMoreResults(true);
          setLoadingStage(Math.ceil((completedRequests / totalRequests) * 3)); // 假设有3个加载阶段
        }
      };
      
      // 更新UI显示累积的结果
      const updateUIWithAccumulatedResults = (isFinal: boolean = false) => {
        // 去重逻辑：只基于URL去重，保留第一个出现的结果
        const uniqueResults = accumulatedResults.current.filter((result, index, self) => 
          index === self.findIndex(r => r.url === result.url)
        );
        
        // 再次过滤掉"未知网盘"类型的结果，确保只统计有效结果
        const validResults = uniqueResults.filter(result => {
          const netdiskType = getNetdiskTypeFromUrl(result.url, result.source);
          return netdiskType !== '未知网盘';
        });

        // 按日期排序，最新的在前面
        const sortedResults = validResults.sort((a, b) => {
          const dateA = new Date(a.date).getTime() || 0;
          const dateB = new Date(b.date).getTime() || 0;
          return dateB - dateA;
        });

        // 渐进式更新：如果这不是最终结果，且新结果比已显示的多出一定数量，才更新UI
        if (!isFinal) {
          const newResultsCount = sortedResults.length;
          // 如果新结果比已显示的多出5个以上，或者这是第一批结果，则更新UI
          if (newResultsCount >= displayedCount.current + 5 || displayedCount.current === 0) {
            setResults(sortedResults);
            displayedCount.current = newResultsCount;
          }
        } else {
          // 最终结果，确保显示所有结果
          setResults(sortedResults);
          displayedCount.current = sortedResults.length;
        }

        // 去重后的原始结果数量（包含未知网盘）
        setOriginalTotalResults(uniqueResults.length);
        
        // 有效结果数量（不包含未知网盘）
        setTotalResults(sortedResults.length);
        
        // 重新计算网盘类型统计信息，只统计有效结果
        const newTypeMap = new Map<string, { id: string; name: string; count: number }>();
        
        // 使用有效结果重新统计网盘类型
        validResults.forEach(result => {
          const displayType = result.smartNetdiskType;
          const typeId = getNetdiskTypeId(displayType);
          
          if (!newTypeMap.has(displayType)) {
            newTypeMap.set(displayType, {
              id: typeId,
              name: displayType,
              count: 0,
            });
          }
          
          const typeEntry = newTypeMap.get(displayType);
          if (typeEntry) {
            typeEntry.count += 1;
          }
        });

        // 按数量降序排序网盘类型，并过滤掉"未知网盘"类型
        const sortedNetdiskTypes = Array.from(newTypeMap.values())
          .filter(type => type.name !== '未知网盘') // 过滤掉"未知网盘"类型
          .sort((a, b) => b.count - a.count);
        setNetdiskTypes(sortedNetdiskTypes);
        
        // 如果结果为空且是最终结果，给出友好提示
        if (sortedResults.length === 0 && isFinal) {
          setError('未找到相关资源，请尝试其他关键词');
        }
        
        if (isFinal) {
          setIsLoadingMore(false);
          setHasMoreResults(false);
        }
        
        console.log(`搜索进度: ${completedRequests}/${totalRequests}, 找到 ${sortedResults.length} 个结果`);
      };

      // 发起所有请求并处理响应
      requests.forEach(async (requestPromise, index) => {
        try {
          const response = await requestPromise;
          processResponse(response);
        } catch (err) {
          processResponse(null, err);
        }
      });
    } catch (err: any) {
      console.error('Search error:', err);
      if (err.name === 'AbortError') {
        setError('搜索超时，请检查网络连接或尝试其他API站点');
      } else if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('无法连接到API服务器，请检查网络连接或尝试其他API站点');
      } else {
        setError(`搜索时发生错误: ${err.message}`);
      }
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setKeyword('');
    setResults([]);
    setTotalResults(0);
    setOriginalTotalResults(0);
    setNetdiskTypes([]);
    setError(null);
    setIsLoadingMore(false);
    setHasMoreResults(false);
    setLoadingStage(1);
    accumulatedResults.current = [];
    accumulatedTypeMap.current.clear();
    displayedCount.current = 0;
  };

  return {
    keyword,
    results,
    loading,
    error,
    totalResults,
    originalTotalResults,
    searchTime,
    netdiskTypes,
    search,
    clearSearch,
    isLoadingMore,
    hasMoreResults,
    loadingStage
  };
}