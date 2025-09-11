import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSearch } from '@/hooks/useSearch';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  content: string;
  [key: string]: any;
}

export default function Detail() {
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
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">加载详情中...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-gray-400 text-5xl mb-4">
            <i className="fa-solid fa-exclamation-circle"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">未找到结果</h2>
          <p className="text-gray-500 mb-8">无法找到请求的搜索结果详情</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            返回搜索页面
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* 返回按钮 */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <i className="fa-solid fa-arrow-left mr-2"></i>
          返回搜索结果
        </button>
        
        {/* 详情内容 */}
        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{result.title}</h1>
          
          <div className="text-gray-500 text-sm mb-6 flex items-center">
            <i className="fa-solid fa-link mr-2"></i>
            <span>{result.url}</span>
          </div>
          
          <div className="prose max-w-none text-gray-700 mb-8" 
               dangerouslySetInnerHTML={{ __html: result.content }}>
          </div>
          
          <div className="border-t border-gray-200 pt-6 mt-6">
            <button 
              onClick={() => navigate('/')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <i className="fa-solid fa-search mr-2"></i>
              返回继续搜索
            </button>
          </div>
        </div>
        
        {/* 页脚 */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>© 2025 搜索应用 - 详情页面</p>
        </footer>
      </div>
    </div>
  );
}