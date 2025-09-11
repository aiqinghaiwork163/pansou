import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// 模拟数据源状态数据
const dataSourceStatus = [
  { name: '夸克网盘', count: 209, status: 'active', lastUpdate: '2分钟前' },
  { name: '阿里云盘', count: 20, status: 'active', lastUpdate: '5分钟前' },
  { name: '迅雷链接', count: 20, status: 'active', lastUpdate: '3分钟前' },
  { name: '移动网盘', count: 15, status: 'active', lastUpdate: '1分钟前' },
  { name: '百度网盘', count: 12, status: 'active', lastUpdate: '4分钟前' },
  { name: '迅雷网盘', count: 6, status: 'active', lastUpdate: '6分钟前' },
  { name: '天翼云盘', count: 2, status: 'active', lastUpdate: '8分钟前' },
  { name: '磁力链接', count: 305, status: 'active', lastUpdate: '1分钟前' },
  { name: '其他源', count: 6, status: 'warning', lastUpdate: '15分钟前' }
];

// 模拟24小时搜索量趋势
const searchTrendData = [
  { time: '00:00', searches: 45, results: 1200 },
  { time: '04:00', searches: 12, results: 320 },
  { time: '08:00', searches: 89, results: 2400 },
  { time: '12:00', searches: 156, results: 4200 },
  { time: '16:00', searches: 134, results: 3600 },
  { time: '20:00', searches: 98, results: 2650 },
  { time: '现在', searches: 78, results: 2100 }
];

export default function Status() {
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  
  // 计算总数据量
  const totalDataCount = dataSourceStatus.reduce((sum, source) => sum + source.count, 0);
  const activeSourcesCount = dataSourceStatus.filter(source => source.status === 'active').length;
  
  // 模拟刷新功能
  const handleRefresh = async () => {
    setRefreshing(true);
    // 模拟刷新延迟
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };
  
  return (
    <div className="min-h-screen bg-white py-0 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* 头部导航 */}
        <header className="flex items-center justify-between py-4 border-b border-gray-200">
          <button 
            onClick={() => navigate('/')}
            className="text-xl font-bold text-blue-600 flex items-center hover:text-blue-700 transition-colors"
          >
            <i className="fa-solid fa-search mr-2"></i>
            SoPan
          </button>
          <div className="flex space-x-2">
            <button 
              onClick={() => navigate('/status')}
              className="px-3 py-1 text-sm border border-gray-300 rounded bg-gray-100"
            >
              状态
            </button>
            <button 
              onClick={() => navigate('/api-doc')}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              API文档
            </button>
          </div>
        </header>
        
        {/* 主要内容区域 */}
        <main className="py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <i className="fa-solid fa-database text-blue-500 mr-2"></i>搜索数据检测状态
            </h1>
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                refreshing 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {refreshing ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>检测中...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-refresh mr-2"></i>刷新数据
                </>
              )}
            </button>
          </div>
          
          {/* 数据统计概览 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <i className="fa-solid fa-database text-green-500 mr-2"></i>总数据量
              </h3>
              <div className="text-3xl font-bold text-green-600">{totalDataCount.toLocaleString()}</div>
              <div className="text-sm text-gray-500 mt-2">已检测到的资源数量</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <i className="fa-solid fa-link text-blue-500 mr-2"></i>数据源
              </h3>
              <div className="text-3xl font-bold text-blue-600">{activeSourcesCount}</div>
              <div className="text-sm text-gray-500 mt-2">正常运行的数据源</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <i className="fa-solid fa-clock text-orange-500 mr-2"></i>最后更新
              </h3>
              <div className="text-3xl font-bold text-orange-600">1分钟前</div>
              <div className="text-sm text-gray-500 mt-2">数据最后更新时间</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <i className="fa-solid fa-chart-line text-purple-500 mr-2"></i>今日搜索
              </h3>
              <div className="text-3xl font-bold text-purple-600">1,247</div>
              <div className="text-sm text-gray-500 mt-2">今日搜索请求次数</div>
            </div>
          </div>
          
          {/* 数据源状态列表 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <i className="fa-solid fa-list text-blue-500 mr-2"></i>数据源状态
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">数据源</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">数据量</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">状态</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">最后更新</th>
                  </tr>
                </thead>
                <tbody>
                  {dataSourceStatus.map((source, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <i className="fa-solid fa-cloud text-blue-500 mr-2"></i>
                          {source.name}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">{source.count.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          source.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {source.status === 'active' ? '正常' : '警告'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{source.lastUpdate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* 24小时搜索趋势 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <i className="fa-solid fa-chart-line text-orange-500 mr-2"></i>24小时搜索趋势
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={searchTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    yAxisId="left" 
                    dataKey="searches" 
                    fill="#3b82f6" 
                    name="搜索次数"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="results" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="返回结果数"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
        </main>
        
        {/* 页脚 */}
        <footer className="mt-16 text-center text-gray-500 text-sm py-4 border-t border-gray-200">
          <p>© 2025 SoPan 搜索数据检测</p>
        </footer>
      </div>
    </div>
  );
}