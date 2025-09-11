import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ApiDoc() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('search');
  
  return (
    <div className="min-h-screen bg-white py-0 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* 头部导航 */}
        <header className="flex items-center justify-between py-4 border-b border-gray-200">
          <button 
            onClick={() => navigate('/')}
            className="text-xl font-bold text-blue-600 flex items-center hover:text-blue-700 cursor-pointer"
          >
            <i className="fa-solid fa-search mr-2"></i>
            SoPan
          </button>
          <div className="flex space-x-2">
            <button 
              onClick={() => navigate('/api-doc')}
              className="px-3 py-1 text-sm border border-gray-300 rounded bg-gray-100"
            >
              API文档
            </button>
          </div>
        </header>
        
        {/* 主要内容区域 */}
        <main className="py-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">SoPan API 文档</h1>
            <p className="text-gray-500">网盘资源搜索API服务</p>
          </div>
          
          {/* API卡片区域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* 搜索API卡片 */}
            <div className="border border-blue-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow border-t-4 border-blue-500">
              <div className="flex items-start">
                <div className="text-3xl text-blue-500 mr-4">
                  <i className="fa-solid fa-search"></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">搜索API</h3>
                  <p className="text-gray-600 mb-3">强大的网盘资源搜索接口</p>
                  <a href="#search-api" className="text-blue-500 hover:text-blue-700 inline-flex items-center">
                    /api/search <i className="fa-solid fa-arrow-right ml-1 text-xs"></i>
                  </a>
                </div>
              </div>
            </div>
            
            {/* 健康检查API卡片 */}
            <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <div className="text-3xl text-gray-500 mr-4">
                  <i className="fa-solid fa-heartbeat"></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">健康检查</h3>
                  <p className="text-gray-600 mb-3">检查服务运行状态</p>
                  <a href="#health-api" className="text-blue-500 hover:text-blue-700 inline-flex items-center">
                    /api/health <i className="fa-solid fa-arrow-right ml-1 text-xs"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* API详情标签页 */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex border-b border-gray-200">
              <button
                id="search-api"
                onClick={() => setActiveTab('search')}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === 'search' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="fa-solid fa-search mr-2"></i>搜索API
              </button>
              <button
                id="health-api"
                onClick={() => setActiveTab('health')}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === 'health' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="fa-solid fa-heartbeat mr-2"></i>健康检查
              </button>
              <button
                onClick={() => setActiveTab('general')}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === 'general' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="fa-solid fa-book mr-2"></i>通用说明
              </button>
            </div>
            
            {/* API详情内容 */}
            <div className="mt-6">
              {activeTab === 'search' && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">POST</span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">GET</span>
                    <span className="font-mono text-gray-800">/api/search</span>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <i className="fa-solid fa-list-ul text-blue-500 mr-2"></i>请求参数
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">参数名</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">必填</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">描述</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">kw</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">是</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">搜索关键词</td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">page</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">number</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">否</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">页码，默认为1</td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">limit</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">number</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">否</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">每页条数，默认为20</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <i className="fa-solid fa-code text-blue-500 mr-2"></i>响应示例
                    </h3>
                    <pre className="bg-gray-900 text-white p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "code": 200,
  "message": "success",
  "data": {
    "total": 2549,
    "time": 4054,
    "netdiskTypes": 10,
    "results": [
      {
        "id": "baidu-1",
        "title": "蜘蛛侠：纵横宇宙",
        "url": "https://pan.baidu.com/s/12BMV65_6GT6oBVAOTSO",
        "source": "pluginhd4k",
        "date": "2024/11/26",
        "extractionCode": "8425",
        "netdiskType": "baidu"
      },
      // 更多结果...
    ]
  }
}`}
                    </pre>
                  </div>
                </div>
              )}
              
              {activeTab === 'health' && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">GET</span>
                    <span className="font-mono text-gray-800">/api/health</span>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <i className="fa-solid fa-info-circle text-blue-500 mr-2"></i>接口说明
                    </h3>
                    <p className="text-gray-700 mb-4">
                      该接口用于检查API服务的运行状态，无需任何参数。正常情况下会返回服务状态、版本信息和已加载的插件数量。
                    </p>
                    
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <i className="fa-solid fa-code text-blue-500 mr-2"></i>响应示例
                    </h3>
                    <pre className="bg-gray-900 text-white p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "code": 200,
  "status": "ok",
  "version": "1.0.0",
  "plugins": 20,
  "channels": 60,
  "uptime": "23d 12h 45m"
}`}
                    </pre>
                  </div>
                </div>
              )}
              
              {activeTab === 'general' && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">API通用说明</h3>
                  <div className="space-y-4 text-gray-700">
                    <p>SoPan API 提供强大的网盘资源搜索服务，支持多种网盘类型和资源检索。</p>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">基础URL</h4>
                      <p>所有API请求的基础URL为：<code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">https://api.wangpan.com</code></p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">响应格式</h4>
                      <p>所有API响应均采用JSON格式，包含以下基本字段：</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><code>code</code>: 状态码，200表示成功</li>
                        <li><code>message</code>: 状态描述信息</li>
                        <li><code>data</code>: 具体业务数据（成功时返回）</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">状态码说明</h4>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>200: 请求成功</li>
                        <li>400: 请求参数错误</li>
                        <li>403: 权限不足</li>
                        <li>404: 资源不存在</li>
                        <li>500: 服务器内部错误</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
        
        {/* 页脚 */}
        <footer className="mt-16 text-center text-gray-500 text-sm py-4 border-t border-gray-200">
          <p>© 2025 SoPan API 文档</p>
        </footer>
      </div>
    </div>
  );
}