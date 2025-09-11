import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SearchResults } from '@/components/SearchResults';
import { AntdSearchInput } from '@/components/AntdSearchInput';
import { getNetdiskIcon, getNetdiskColor } from '@/utils/netdiskUtils';
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
  CrownOutlined
} from '@ant-design/icons';

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
      <Header className="bg-white shadow-sm px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Title level={3} className="text-blue-600 mb-0">网盘搜索</Title>
          {isAdministrator && (
            <Badge.Ribbon text="管理员" color="blue">
              <CrownOutlined className="ml-2 text-yellow-500" />
            </Badge.Ribbon>
          )}
        </div>
        
        <Space>
          {isAdministrator && (
            <Button 
              icon={<SettingOutlined />} 
              onClick={() => navigate('/admin')}
            >
              管理后台
            </Button>
          )}
          <LogoutButton />
        </Space>
      </Header>
      
      <Content className="p-4">
        <div className="max-w-6xl mx-auto">
          <Card className="mb-6">
            <div className="text-center mb-6">
              <Title level={2} className="mb-2">网盘资源搜索</Title>
              <Text type="secondary">输入关键词，探索无限可能</Text>
            </div>
            
            <AntdSearchInput
              value={inputValue}
              onChange={setInputValue}
              onSearch={(value) => handleSearch(value)}
              disabled={loading}
            />
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
              <Card className="mb-6">
                <Tabs 
                  activeKey={activeTab} 
                  onChange={handleTabChange}
                  tabBarExtraContent={
                    <Text type="secondary">
                      共 {filteredResults.length} 条结果
                    </Text>
                  }
                >
                  {tabs.map(tab => (
                    <TabPane
                      tab={
                        <Badge count={tab.count} overflowCount={999} size="small">
                          <span>{tab.name}</span>
                        </Badge>
                      }
                      key={tab.id}
                    />
                  ))}
                </Tabs>
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