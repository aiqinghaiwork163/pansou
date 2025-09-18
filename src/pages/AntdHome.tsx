import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SearchResults } from '@/components/SearchResults';
import { AntdSearchInput } from '@/components/AntdSearchInput';
import { getNetdiskIcon, getNetdiskColor, getNetdiskTypeFromUrl } from '@/utils/netdiskUtils';
import { getNetdiskTypeId } from '@/utils/netdiskTypeUtils';
import DonationModal from '@/components/DonationModal';
import LogoutButton from '@/components/LogoutButton';
import SearchResultsLabel from '@/components/SearchResultsLabel';
import { useSearch } from '@/hooks/useSearch';
import { toast, Toaster } from 'sonner';
import { useAuth } from '@/contexts/authContext';
import {
  Layout,
  Tabs,
  Badge,
  Spin,
  Alert,
  Button,
  Space,
  Card,
  Typography,
  Result
} from 'antd';
import {
  SearchOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  CrownOutlined,
  SparklesOutlined
} from '@ant-design/icons';
import { GradientText } from '@/components/GradientText';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

// 定义网盘类型接口
interface NetdiskType {
  id: string;
  name: string;
  count: number;
}

function AntdHome() {
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
  
  const handleSearch = (value?: string) => {
    const searchValue = value !== undefined ? value : inputValue;
    search(searchValue);
  };
  
  const tabs = useMemo(() => {
    const allTabs = [
      { id: 'all', name: '全部', count: totalResults },
      ...netdiskTypes
    ];
    
    return allTabs;
  }, [netdiskTypes, totalResults]);

  // 根据当前标签过滤结果
  const filteredResults = useMemo(() => {
    if (activeTab === 'all') return results;
    return results.filter(result => {
      // 使用智能识别函数获取网盘类型
      const smartNetdiskType = getNetdiskTypeFromUrl(result.url, result.source);
      const displayTypeId = getNetdiskTypeId(smartNetdiskType);
      return displayTypeId === activeTab;
    });
  }, [results, activeTab]);

  // 处理标签变化
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  // 获取当前标签的名称
  const getCurrentTabName = () => {
    if (activeTab === 'all') return '全部';
    const tab = tabs.find(t => t.id === activeTab);
    return tab ? tab.name : '全部';
  };

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      <Header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-md px-4 flex items-center justify-between text-white h-20">
        <div className="flex items-center">
          <GradientText className="text-2xl font-bold">
            网盘搜索
          </GradientText>
          {isAdministrator && (
            <Badge.Ribbon text="管理员" color="yellow" className="ml-4">
              <CrownOutlined className="ml-2 text-yellow-300" />
            </Badge.Ribbon>
          )}
        </div>
        
        <Space>
          {isAdministrator && (
            <Button 
              icon={<SettingOutlined />} 
              onClick={() => navigate('/admin')}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 transition-all"
            >
              管理后台
            </Button>
          )}
          <LogoutButton />
        </Space>
      </Header>
      
      <Content className="p-4">
        <div className="max-w-6xl mx-auto">
          <Card className="mb-6 overflow-hidden relative">
            {/* 背景装饰 */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-100 rounded-full opacity-50"></div>
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-100 rounded-full opacity-50"></div>
            
            <div className="text-center mb-6 relative z-10">
              <div className="flex items-center justify-center mb-2">
                <SparklesOutlined className="text-yellow-500 mr-2" />
                <GradientText className="text-3xl font-bold">网盘资源搜索</GradientText>
              </div>
              <Text type="secondary" className="text-lg">输入关键词，探索无限可能</Text>
            </div>
            
            <div className="relative z-10">
              <AntdSearchInput
                value={inputValue}
                onChange={setInputValue}
                onSearch={(value) => handleSearch(value)}
                disabled={loading}
              />
            </div>
          </Card>
          
          {error && (
            <Alert 
              message="搜索出错" 
              description={error} 
              type="error" 
              showIcon 
              className="mb-6"
            />
          )}
          
          {keyword && !loading && !error && (
            <Card className="mb-6">
              <SearchResultsLabel 
                validTotal={totalResults}
                originalTotal={originalTotalResults}
                searchTime={searchTime}
              />
            </Card>
          )}
          
          {loading && (
            <div className="text-center py-12">
              <Spin size="large" />
              <div className="mt-4">
                <Text type="secondary">{loadingStage}</Text>
              </div>
            </div>
          )}
          
          {!loading && keyword && (
            <>
              <Card className="mb-6 hover:shadow-md transition-shadow">
                <Tabs 
                  activeKey={activeTab} 
                  onChange={handleTabChange}
                  tabBarExtraContent={
                    <div className="text-secondary font-medium">
                      共 <span className="text-blue-600 font-bold">{filteredResults.length}</span> 条结果
                    </div>
                  }
                  tabBarStyle={{
                    marginBottom: '0',
                    paddingLeft: '8px'
                  }}
                  items={tabs.map(tab => ({
                    key: tab.id,
                    label: (
                      <Badge count={tab.count} overflowCount={999} size="small">
                        <span className="px-1">{tab.name}</span>
                      </Badge>
                    )
                  }))}
                />
              </Card>
              
              {filteredResults.length > 0 ? (
                <SearchResults 
                  results={filteredResults}
                  totalResults={totalResults}
                  actualTotal={originalTotalResults}
                  loading={loading}
                  error={error}
                  keyword={keyword}
                  activeTab={activeTab}
                  isLoadingMore={isLoadingMore}
                  hasMoreResults={hasMoreResults}
                  loadingStage={loadingStage}
                />
              ) : (
                <Result
                  title="暂无搜索结果"
                  subTitle={`未找到与 "${keyword}" 相关的内容`}
                  icon={<SearchOutlined />}
                />
              )}
            </>
          )}
          
          {!keyword && !loading && (
            <div className="text-center py-12">
              <Result
                title="欢迎使用网盘搜索"
                subTitle="输入关键词开始搜索网盘资源"
                icon={<SearchOutlined />}
              />
            </div>
          )}
        </div>
      </Content>
      
      <DonationModal />
    </Layout>
  );
}

export default AntdHome;