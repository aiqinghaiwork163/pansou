import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { Pagination } from './Pagination';
import { getNetdiskTypeFromUrl, getNetdiskIcon, getNetdiskColor } from '@/utils/netdiskUtils';
import { getNetdiskTypeId } from '@/utils/netdiskTypeUtils';
import { GlassMorphismModal } from './GlassMorphismModal';
import { GradientText } from './GradientText';

interface SearchResultItem {
  id: string;
  title: string;
  url: string;
  source: string;
  date: string;
  netdiskType: string;
  [key: string]: any;
}

interface SearchResultsProps {
  results: SearchResultItem[];
  totalResults: number;
  actualTotal?: number;
  loading: boolean;
  error: string | null;
  keyword: string;
  activeTab: string;
  isLoadingMore?: boolean;
  hasMoreResults?: boolean;
  loadingStage?: number;
}

export function SearchResults({ 
  results, 
  totalResults, 
  actualTotal = totalResults,
  loading, 
  error, 
  keyword, 
  activeTab,
  isLoadingMore = false,
  hasMoreResults = false,
  loadingStage = 1
}: SearchResultsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  
  const handleLinkClick = async (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
    } catch (err) {
      console.error('复制链接失败:', err);
      setCopiedUrl(url);
    }
  };
  
  const handleConfirmAndOpen = (url: string | null) => {
    if (!url) return;
    
    setCopiedUrl(null);
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  
  const cleanHtmlTags = (text: string): string => {
    if (!text) return '';
    return text.replace(/<[^>]*>/g, '');
  };
  
  const filteredResults = useMemo(() => {
    const validResults = results.filter(result => {
      const netdiskType = getNetdiskTypeFromUrl(result.url, result.source);
      return netdiskType !== '未知网盘';
    });
    
    if (activeTab === 'all') {
      return validResults;
    }
    
    const filtered = validResults.filter(result => {
      const smartNetdiskType = getNetdiskTypeFromUrl(result.url, result.source);
      const displayTypeId = getNetdiskTypeId(smartNetdiskType);
      return displayTypeId === activeTab;
    });
    
    return filtered;
  }, [results, activeTab]);
  
  const paginationData = useMemo(() => {
    const totalResults = filteredResults.length;
    const totalPages = Math.ceil(totalResults / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalResults);
    const currentPageResults = filteredResults.slice(startIndex, endIndex);
    
    return {
      totalPages,
      currentPageResults,
      startIndex,
      endIndex,
      totalResults
    };
  }, [filteredResults, currentPage, itemsPerPage]);
  
  useEffect(() => {
    if (copiedUrl) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [copiedUrl]);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, keyword, results]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };
  
  if (loading) {
    return (
      <div className="bg-white p-8 rounded-xl flex flex-col items-center justify-center my-4 border border-gray-200 shadow-sm">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full mb-4 animate-spin">
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            正在搜索资源中...
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            跨平台聚合搜索，请稍候
          </p>
          
          <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden mt-4 mx-auto">
            <div className="h-full bg-blue-600 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-xl text-red-800 flex items-center shadow-sm">
        <i className="fa-solid fa-exclamation-triangle mr-3 text-lg"></i>
        <div className="text-center">
          <h3 className="font-medium text-base mb-1">
            搜索遇到问题
          </h3>
          <p className="text-red-700 text-sm mb-3">{error}</p>
          <div className="text-xs text-red-600">
            请重新搜索
          </div>
        </div>
      </div>
    );
  }
  
  if (keyword && filteredResults.length === 0 && !loading) {
    return (
      <div className="bg-white p-12 rounded-xl flex flex-col items-center justify-center my-6 border border-gray-200 shadow-sm">
        <div className="text-gray-400 text-5xl mb-4">
          <i className="fa-solid fa-search"></i>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            未找到相关结果
          </h3>
          <p className="text-gray-600 mb-4">
            尝试使用不同的关键词或检查拼写
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 max-w-sm border border-gray-200">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center justify-center">
              <i className="fa-solid fa-lightbulb mr-2 text-yellow-500"></i>
              搜索建议
            </h4>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• 使用更短或更通用的关键词</p>
              <p>• 检查关键词的拼写是否正确</p>
              <p>• 使用同义词或相关词汇</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (filteredResults.length > 0) {
    return (
      <div className="w-full space-y-6 my-4">
        {/* 搜索结果列表 */}
        {paginationData.currentPageResults.length > 0 && (
          <div className="space-y-4">
            {paginationData.currentPageResults.map((result) => (
              <div key={result.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all duration-200 group">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* 网盘图标 */}
                  <div className="flex-shrink-0">
                    <div 
                      className={`w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-sm ${getNetdiskColor(result.netdiskType).bg}`}
                    >
                      <i className={getNetdiskIcon(result.netdiskType)}></i>
                    </div>
                  </div>
                  
                  {/* 内容区域 */}
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                      <div className="flex-grow">
                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                          <Link 
                            to={`/detail/${encodeURIComponent(result.url)}`} 
                            className="hover:underline"
                          >
                            {cleanHtmlTags(result.title)}
                          </Link>
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                          <span className="inline-flex items-center">
                            <i className="fa-solid fa-folder mr-1.5 text-xs"></i>
                            {getNetdiskTypeFromUrl(result.url, result.source) || result.netdiskType}
                          </span>
                          <span className="inline-flex items-center">
                            <i className="fa-solid fa-calendar mr-1.5 text-xs"></i>
                            {result.date}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        <button
                          onClick={(e) => handleLinkClick(e, result.url)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                        >
                          <i className="fa-solid fa-link"></i>
                          访问链接
                        </button>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* 分页组件 */}
        {paginationData.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={paginationData.totalPages}
            totalItems={filteredResults.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
        
        {/* 加载更多状态 */}
        {hasMoreResults && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center my-6 relative overflow-hidden">
            <div className="flex items-center justify-center text-blue-700 mb-2">
              <i className="fa-solid fa-spinner fa-spin mr-2"></i>
              <span>
                {isLoadingMore 
                  ? `正在加载第${loadingStage}批搜索结果...` 
                  : `正在持续搜索更多资源...`
                }
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              {isLoadingMore 
                ? `当前已加载 ${filteredResults.length} 条结果，共 ${totalResults} 条有效结果` 
                : `跨平台聚合搜索正在进行中，搜索结果将自动更新`
              }
            </p>
            
            <div className="w-full h-2 bg-gray-200 mt-3 overflow-hidden rounded">
              <div 
                className="h-full bg-blue-600 animate-pulse"
                style={{
                  width: `${Math.min(100, (filteredResults.length / Math.max(1, totalResults)) * 100)}%`,
                  transition: 'width 0.3s ease-in-out'
                }}
              ></div>
            </div>
          </div>
        )}
        
        {/* 全部加载完成提示 */}
        {!hasMoreResults && filteredResults.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center my-6">
            <div className="flex items-center justify-center text-green-700 mb-2">
              <i className="fa-solid fa-check-circle mr-2"></i>
              <span>全部资源加载完成</span>
            </div>
            <p className="text-gray-600 text-sm">
              已成功加载全部 {filteredResults.length} 条有效搜索结果
              {actualTotal > totalResults && (
                <span className="text-xs ml-2">(过滤重复项后，原始结果共 {actualTotal} 条)</span>
              )}
            </p>
          </div>
        )}
        
        {/* 搜索结果为空时的提示 */}
        {keyword && !loading && !error && filteredResults.length === 0 && (
          <div className="bg-white p-12 rounded-xl flex flex-col items-center justify-center my-6 border border-gray-200 shadow-sm">
            <div className="text-gray-400 text-5xl mb-4">
              <i className="fa-solid fa-search"></i>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                未找到相关结果
              </h3>
              <p className="text-gray-600 mb-4">尝试使用不同的关键词或检查拼写</p>
              
              <div className="bg-gray-50 rounded-lg p-4 max-w-sm border border-gray-200">
                <h4 className="font-medium text-gray-700 mb-3 flex items-center justify-center">
                  <i className="fa-solid fa-lightbulb mr-2 text-yellow-500"></i>
                  搜索建议
                </h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• 使用更短或更通用的关键词</p>
                  <p>• 检查关键词的拼写是否正确</p>
                  <p>• 使用同义词或相关词汇</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="w-full space-y-6 my-4">
      {keyword && !loading && !error && filteredResults.length === 0 && (
        <div className="bg-white p-12 rounded-xl flex flex-col items-center justify-center my-6 border border-gray-200 shadow-sm">
          <div className="text-gray-400 text-5xl mb-4">
            <i className="fa-solid fa-search"></i>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              未找到相关结果
            </h3>
            <p className="text-gray-600 mb-4">尝试使用不同的关键词或检查拼写</p>
            
            <div className="bg-gray-50 rounded-lg p-4 max-w-sm border border-gray-200">
              <h4 className="font-medium text-gray-700 mb-3 flex items-center justify-center">
                <i className="fa-solid fa-lightbulb mr-2 text-yellow-500"></i>
                搜索建议
              </h4>
              <div className="text-sm text-gray-600 space-y-2">
                <p>• 使用更短或更通用的关键词</p>
                <p>• 检查关键词的拼写是否正确</p>
                <p>• 使用同义词或相关词汇</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const EmptyState = ({ 
  icon, 
  title, 
  description,
  className = ''
}: {
  icon: string;
  title: string;
  description: string;
  className?: string;
}) => (
  <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
    <div className="text-5xl text-gray-400 mb-4">
      <i className={icon}></i>
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-center max-w-md">{description}</p>
  </div>
);

export const ErrorState = ({ 
  title, 
  description,
  onRetry,
  className = ''
}: {
  title: string;
  description: string;
  onRetry?: () => void;
  className?: string;
}) => (
  <div className={`bg-red-100 border border-red-300 rounded-xl p-6 text-center ${className}`}>
    <div className="text-4xl text-red-600 mb-4">
      <i className="fa-solid fa-exclamation-triangle"></i>
    </div>
    <h3 className="text-xl font-semibold text-red-800 mb-2">{title}</h3>
    <p className="text-red-700 mb-4">{description}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-200 hover:bg-red-300 text-red-800 rounded-lg font-medium transition-colors"
      >
        <i className="fa-solid fa-rotate-right mr-2"></i>
        重试
      </button>
    )}
  </div>
);