import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Layout, 
  Menu, 
  Card, 
  Typography, 
  Button, 
  Space,
  Divider,
  Tag,
  Row,
  Col,
  Collapse
} from 'antd';
import { 
  SearchOutlined,
  ApiOutlined,
  LeftOutlined,
  CodeOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

export default function AntdApiDoc() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('search');
  
  return (
    <Layout className="min-h-screen">
      <Header className="bg-white shadow-sm px-4 flex items-center justify-between">
        <Button 
          icon={<LeftOutlined />} 
          onClick={() => navigate('/')}
        >
          返回首页
        </Button>
        <Title level={3} className="text-blue-600 mb-0">SoPan API 文档</Title>
        <div></div>
      </Header>
      
      <Layout>
        <Sider width={250} className="bg-white border-r">
          <Menu
            mode="inline"
            selectedKeys={[activeTab]}
            onSelect={({ key }) => setActiveTab(key)}
            items={[
              {
                key: 'search',
                icon: <SearchOutlined />,
                label: '搜索API',
              },
              {
                key: 'auth',
                icon: <ApiOutlined />,
                label: '认证API',
              },
              {
                key: 'user',
                icon: <ApiOutlined />,
                label: '用户API',
              },
            ]}
          />
        </Sider>
        
        <Content className="p-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <Card className="mb-6">
              <Title level={2} className="text-blue-600">SoPan API 文档</Title>
              <Text type="secondary">网盘资源搜索API服务</Text>
            </Card>
            
            <Row gutter={24}>
              <Col span={12}>
                <Card 
                  className="h-full" 
                  title={
                    <Space>
                      <SearchOutlined />
                      <span>搜索API</span>
                    </Space>
                  }
                >
                  <Paragraph>
                    强大的网盘资源搜索接口
                  </Paragraph>
                  <Text code>/api/search</Text>
                  <Divider />
                  <Space>
                    <Tag color="green">GET</Tag>
                    <Tag color="blue">认证</Tag>
                  </Space>
                </Card>
              </Col>
              
              <Col span={12}>
                <Card 
                  className="h-full" 
                  title={
                    <Space>
                      <ApiOutlined />
                      <span>认证API</span>
                    </Space>
                  }
                >
                  <Paragraph>
                    用户认证和授权接口
                  </Paragraph>
                  <Text code>/api/auth</Text>
                  <Divider />
                  <Space>
                    <Tag color="blue">POST</Tag>
                    <Tag color="orange">可选</Tag>
                  </Space>
                </Card>
              </Col>
            </Row>
            
            <Card className="mt-6">
              <Title level={4}>API 端点</Title>
              <Collapse>
                <Panel 
                  header={
                    <Space>
                      <Tag color="green">GET</Tag>
                      <Text code>/api/search</Text>
                      <Text>搜索网盘资源</Text>
                    </Space>
                  } 
                  key="1"
                >
                  <Paragraph>
                    通过关键词搜索网盘资源
                  </Paragraph>
                  
                  <Title level={5}>请求参数</Title>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">参数</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">必需</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">描述</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">q</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <CheckCircleOutlined className="text-green-500" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">搜索关键词</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">page</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">integer</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <CloseCircleOutlined className="text-red-500" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">页码，默认为1</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">limit</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">integer</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <CloseCircleOutlined className="text-red-500" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">每页结果数，默认为20</td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <Title level={5} className="mt-4">响应示例</Title>
                  <pre className="bg-gray-100 p-4 rounded">
{`{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "示例资源",
      "description": "这是一个示例资源描述",
      "url": "https://example.com/resource",
      "netdisk": "百度网盘"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20
}`}
                  </pre>
                </Panel>
              </Collapse>
            </Card>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}