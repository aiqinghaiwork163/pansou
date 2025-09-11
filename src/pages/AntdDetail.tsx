import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSearch } from '@/hooks/useSearch';
import { 
  Spin, 
  Card, 
  Typography, 
  Button, 
  Space,
  Result,
  Descriptions,
  Tag
} from 'antd';
import { 
  ArrowLeftOutlined,
  LinkOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { getNetdiskIcon, getNetdiskColor } from '@/utils/netdiskUtils';

const { Title, Text } = Typography;

interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  content: string;
  netdisk: string;
  [key: string]: any;
}

export default function AntdDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { results } = useSearch();
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && results.length > 0) {
      // 查找匹配的结果
      const foundResult = results.find(item => item.id === id);
      
      if (foundResult) {
        // 模拟详细内容
        const detailedResult: SearchResult = {
          ...foundResult,
          content: `
            <h3>详细内容</h3>
            <p>这是"${foundResult.title}"的详细信息页面。</p>
            <p>在这里可以展示与"${foundResult.title}"相关的完整内容、图片、链接和其他资源。</p>
            <h4>相关信息</h4>
            <ul>
              <li>发布日期: 2025-08-28</li>
              <li>来源: 示例数据源</li>
              <li>类别: 搜索结果</li>
            </ul>
            <p>这是通过搜索"${foundResult.title}"找到的详细内容，包含了更多相关信息和资源链接。</p>
          `
        };
        setResult(detailedResult);
      }
      setLoading(false);
    }
  }, [id, results]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <Result
          status="404"
          title="未找到结果"
          subTitle="抱歉，没有找到您访问的搜索结果"
          extra={
            <Button type="primary" onClick={() => navigate('/')}>
              返回首页
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Space className="mb-6">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate(-1)}
          >
            返回
          </Button>
        </Space>
        
        <Card className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <Title level={3} className="mb-2">{result.title}</Title>
              <Space className="mb-4">
                <Tag color={getNetdiskColor(result.netdisk)}>
                  {getNetdiskIcon(result.netdisk)}
                  {result.netdisk}
                </Tag>
              </Space>
              <Text type="secondary">{result.description}</Text>
            </div>
            <Button 
              type="primary" 
              icon={<LinkOutlined />}
              href={result.url}
              target="_blank"
            >
              访问链接
            </Button>
          </div>
        </Card>
        
        <Card>
          <Title level={4} className="mb-4">
            <FileTextOutlined /> 详细内容
          </Title>
          <div 
            dangerouslySetInnerHTML={{ __html: result.content }} 
            className="prose max-w-none"
          />
        </Card>
      </div>
    </div>
  );
}