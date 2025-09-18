import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { Pagination } from './Pagination';
import { getNetdiskTypeFromUrl, getNetdiskIcon, getNetdiskColor } from '@/utils/netdiskUtils';
import { getNetdiskTypeId } from '@/utils/netdiskTypeUtils';
import { GlassMorphismModal } from './GlassMorphismModal';
import { GradientText } from './GradientText';
import { Modal } from 'antd';

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
      <div className="bg-white p-8 rounded-xl flex flex-col items-center justify-center my-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full mb-6 animate-spin"></div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <SparklesOutlined className="mr-2 text-blue-600 animate-spin-slow" />
            正在搜索资源中...
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            跨平台聚合搜索，寻找最佳结果
          </p>
          
          <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mt-4 mx-auto">
            <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse"></div>
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
        {/* 复制链接成功弹窗 */}
        <Modal
          title="复制链接成功"
          open={!!copiedUrl}
          onOk={() => handleConfirmAndOpen(copiedUrl)}
          onCancel={() => setCopiedUrl(null)}
          footer={[
            <button
              key="cancel"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg mr-2 hover:bg-gray-100 transition-colors"
              onClick={() => setCopiedUrl(null)}
            >
              取消
            </button>,
            <button
              key="confirm"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              onClick={() => handleConfirmAndOpen(copiedUrl)}
            >
              确认并打开链接
            </button>
          ]}
          centered
        >
          <div className="text-center py-4">
            <div className="text-green-500 text-4xl mb-4">
              <i className="fa-solid fa-check-circle"></i>
            </div>
            <p className="text-gray-700 mb-3">链接已成功复制到剪贴板！</p>
            <p className="text-gray-500 text-sm">点击"确认并打开链接"将在新标签页中打开该链接</p>
          </div>
        </Modal>
        {/* 搜索结果列表 */}
        {paginationData.currentPageResults.length > 0 && (
          <div className="space-y-4">
            {paginationData.currentPageResults.map((result) => (
              <div key={result.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* 网盘图标 - 增强效果 */}
                  <div className="flex-shrink-0">
                    <div 
                      className={`w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-md transition-transform duration-300 group-hover:scale-110 ${getNetdiskColor(result.netdiskType).bg}`}
                    >
                      <i className={`${getNetdiskIcon(result.netdiskType)} text-xl`}></i>
                    </div>
                  </div>
                  
                  {/* 内容区域 */}
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                      <div className="flex-grow">
                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                          <Link 
                            to={`/detail/${encodeURIComponent(result.url)}`} 
                            className="hover:underline transition-all duration-300 hover:shadow-[0_1px_0_0] hover:shadow-blue-600"
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
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-105 animate-pulse-glow"
                        >
                          <i className="fa-solid fa-link"></i>
                          访问链接
                        </button>
                      </div>
                    </div>
                    
                    {/* 搜索关键词高亮 */}
                    {keyword && (
                      <div className="text-xs text-gray-400 mt-2">
                        <span className="font-medium">来源：</span>
                        {result.source}
                      </div>
                    )}
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
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-5 text-center my-6 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-center text-blue-700 mb-3">
              <div className="w-6 h-6 mr-3">
                <svg className="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <span className="font-medium">
                {isLoadingMore 
                  ? `正在加载第${loadingStage}批搜索结果...` 
                  : `正在持续搜索更多资源...`
                }
              </span>
            </div>
            <div className="text-gray-600 text-sm mb-4">
              {isLoadingMore ? (
                <>当前已加载 <span className="font-medium text-blue-600">{filteredResults.length}</span> 条结果，共 <span className="font-medium text-blue-600">{totalResults}</span> 条有效结果</>
              ) : (
                '跨平台聚合搜索正在进行中，搜索结果将自动更新'
              )}
            </div>
            
            <div className="w-full h-3 bg-gray-200 mt-3 overflow-hidden rounded-full shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse"
                style={{
                  width: `${Math.min(100, (filteredResults.length / Math.max(1, totalResults)) * 100)}%`,
                  transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              ></div>
            </div>
          </div>
        )}
        
        {/* 全部加载完成提示 */}
        {!hasMoreResults && filteredResults.length > 0 && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 text-center my-6 shadow-sm">
            <div className="flex items-center justify-center text-green-700 mb-3">
              <div className="w-6 h-6 mr-3 text-green-500">
                <svg fill="currentColor" viewBox="0 0 20 20" className="h-6 w-6">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
              </div>
              <span className="font-medium">全部资源加载完成</span>
            </div>
            <p className="text-gray-600 text-sm">
              已成功加载全部 <span className="font-medium text-green-600">{filteredResults.length}</span> 条有效搜索结果
              {actualTotal > totalResults && (
                <span className="text-xs ml-2 text-gray-500">(过滤重复项后，原始结果共 {actualTotal} 条)</span>
              )}
            </p>
          </div>
        )}
        
        {/* 搜索结果为空时的提示 */}
        {keyword && !loading && !error && filteredResults.length === 0 && (
          <div className="bg-white p-12 rounded-xl flex flex-col items-center justify-center my-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6">
              <SearchOutlined className="text-blue-400 text-4xl" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                未找到相关结果
              </h3>
              <p className="text-gray-600 mb-6 max-w-md">尝试使用不同的关键词或检查拼写，我们会为您继续寻找更优质的网盘资源</p>
              
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-5 max-w-md border border-blue-100 shadow-sm">
                <h4 className="font-medium text-gray-800 mb-4 flex items-center justify-center">
                  <SparklesOutlined className="mr-2 text-yellow-500" />
                  搜索建议
                </h4>
                <div className="text-sm text-gray-600 space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 min-w-[16px]"><i className="fa-solid fa-circle text-[4px] text-blue-500"></i></div>
                    <p>使用更短或更通用的关键词</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 min-w-[16px]"><i className="fa-solid fa-circle text-[4px] text-blue-500"></i></div>
                    <p>检查关键词的拼写是否正确</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 min-w-[16px]"><i className="fa-solid fa-circle text-[4px] text-blue-500"></i></div>
                    <p>使用同义词或相关词汇</p>
                  </div>
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