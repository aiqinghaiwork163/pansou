import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SearchResults } from '@/components/SearchResults';
import { EnhancedSearchInput } from '@/components/EnhancedSearchInput';
import { getNetdiskIcon, getNetdiskColor } from '@/utils/netdiskUtils';
import DonationModal from '@/components/DonationModal';
import LogoutButton from '@/components/LogoutButton';
import SearchResultsLabel from '@/components/SearchResultsLabel';
import { useSearch } from '@/hooks/useSearch';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/authContext';

// 定义网盘类型接口
interface NetdiskType {
  id: string;
  name: string;
  count: number;
}

function Home() {
  const { 
    keyword, 
    results, 
    loading, 
    error, 
    totalResults, 
    originalTotalResults,
    searchTime, 
    netdiskTypes,
    search,
    isLoadingMore,
    hasMoreResults,
    loadingStage
  } = useSearch();
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();
  const { isAdministrator } = useAuth();
  
  const handleSearch = () => {
    search(inputValue);
  };
  
  const tabs = useMemo(() => {
    const allTabs = [
      { id: 'all', name: '全部', count: totalResults },
      ...netdiskTypes
    ];
    
    return allTabs;
  }, [netdiskTypes, totalResults]);
  
  const stats = useMemo(() => ({
    netdiskCount: netdiskTypes.length > 0 ? netdiskTypes.length : 38,
    resultCount: originalTotalResults,
    validResultCount: totalResults,
    netdiskTypeCount: netdiskTypes.length,
    searchTime: searchTime
  }), [netdiskTypes, totalResults, originalTotalResults, searchTime]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex justify-end items-center p-4 border-b border-gray-200">
          <div className="flex space-x-3">
            <LogoutButton className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg" />
          </div>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="mb-8">
            <div className="text-6xl font-bold mb-4">
              <span className="text-blue-600">So</span>
              <span className="text-red-500">Pan</span>
            </div>
            <div className="text-gray-600 text-center text-lg">
              智能网盘资源搜索引擎
            </div>
          </div>
          
          <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-full px-6 py-4 shadow-lg mb-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-700">正在搜索中...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex justify-end items-center p-4 border-b border-gray-200">
        <div className="flex space-x-3">
          {isAdministrator && (
            <button 
              onClick={() => navigate('/admin')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <i className="fa-solid fa-users-gear mr-2"></i>
              用户管理
            </button>
          )}
          <LogoutButton className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg" />
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        {!keyword ? (
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <div className="mb-12">
              <div className="text-7xl font-bold mb-4 text-center">
                <span className="text-blue-600" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>So</span>
                <span className="text-red-500" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>Pan</span>
              </div>
              <div className="text-gray-700 text-center text-lg font-normal" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                智能网盘资源搜索引擎
              </div>
            </div>
            
            <div className="w-full max-w-2xl mb-8">
              <EnhancedSearchInput
                value={inputValue} 
                onChange={setInputValue} 
                onSearch={handleSearch}
                disabled={loading}
              />
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button className="px-6 py-3 bg-white hover:bg-gray-100 rounded-lg text-gray-800 transition-colors border border-gray-300 font-medium shadow-sm" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                <i className="fa-solid fa-search mr-2"></i>
                网盘搜索
              </button>
            </div>
            
            <div className="text-center text-gray-600 text-sm font-normal" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
              支持 <span className="font-semibold text-blue-600">{stats.netdiskCount}+</span> 个网盘平台
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto w-full px-4 py-6">
            <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center mr-6">
                <div className="text-2xl font-bold mr-4" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                  <span className="text-blue-600">So</span>
                  <span className="text-red-500">Pan</span>
                </div>
              </div>
              <div className="flex-1 max-w-xl">
                <EnhancedSearchInput
                  value={inputValue} 
                  onChange={setInputValue} 
                  onSearch={handleSearch}
                  disabled={loading}
                />
              </div>
            </div>
            
            {keyword && (
              <SearchResultsLabel 
                originalTotal={originalTotalResults} 
                validTotal={totalResults} 
                searchTime={searchTime}
              />
            )}
            
            {keyword && tabs.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {tabs.map((tab) => {
                  const isAllTab = tab.id === 'all';
                  const tabIcon = isAllTab ? 'fa-solid fa-globe' : getNetdiskIcon(tab.name);
                  const tabColors = isAllTab 
                    ? { bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-600' }
                    : getNetdiskColor(tab.name);
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 flex items-center gap-2 ${
                        activeTab === tab.id
                          ? `${tabColors.bg} ${tabColors.text} ${tabColors.border}`
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <i className={tabIcon} />
                      <span>{tab.name}</span>
                      {tab.count > 0 && (
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          activeTab === tab.id 
                            ? 'bg-white/20 text-white' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
            
            <SearchResults 
              results={results}
              totalResults={totalResults}
              loading={loading}
              error={error}
              keyword={keyword}
              activeTab={activeTab}
              isLoadingMore={isLoadingMore}
              hasMoreResults={hasMoreResults}
              loadingStage={loadingStage}
            />
          </div>
        )}
        
        <footer className="py-6 border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-4 text-center text-gray-600 text-sm font-normal" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
            <p>© 2025 SoPan 智能网盘搜索 - 用心打造的搜索体验</p>
          </div>
        </footer>
      </div>
      
      <DonationModal />
    </div>
  );
}

export default Home;