// 移除framer-motion导入
import { GradientText } from './GradientText';
// 移除MagneticButton导入，使用普通button替代

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  onPageChange,
  onItemsPerPageChange
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getVisiblePageNumbers = () => {
    const delta = 2; // 当前页前后显示的页数
    const rangeStart = Math.max(1, currentPage - delta);
    const rangeEnd = Math.min(totalPages, currentPage + delta);
    
    const pages: (number | string)[] = [];
    
    // 添加第一页
    if (rangeStart > 1) {
      pages.push(1);
      if (rangeStart > 2) {
        pages.push('...');
      }
    }
    
    // 添加中间页码
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }
    
    // 添加最后一页
    if (rangeEnd < totalPages) {
      if (rangeEnd < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    
    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    // 移除motion.div，使用普通div
    <div 
      className="flex flex-col items-center gap-4 py-6"
    >
      {/* 结果统计信息和每页显示条数选择器 */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* 结果统计信息 */}
        <div 
          className="text-sm text-slate-300 bg-white/10 px-4 py-2 rounded-lg border border-slate-600/30"
        >
          显示第 
          <span className="mx-1 number-white transform hover:scale-105 transition-all duration-200">
            {startItem}
          </span>
          -
          <span className="mx-1 number-white transform hover:scale-105 transition-all duration-200">
            {endItem}
          </span>
          条，共 
          <span className="mx-1 number-white transform hover:scale-105 transition-all duration-200">
            {totalItems}
          </span>
          条结果
        </div>
        
        {/* 每页显示条数选择器 */}
        {onItemsPerPageChange && (
          <div
            className="flex items-center gap-3 text-sm text-slate-300 bg-white/10 px-4 py-2 rounded-lg border border-slate-600/30"
          >
            <span className="flex items-center gap-1">
              <i className="fa-solid fa-list text-cyan-400 text-xs"></i>
              每页显示
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
              className="bg-white/20 border border-slate-500/30 rounded-md px-3 py-1 text-white text-sm font-medium focus:border-cyan-400 focus:outline-none cursor-pointer hover:bg-white/30 transition-all duration-150 shadow-sm"
            >
              <option value={10} className="bg-slate-800 text-white hover:bg-slate-700">
                <span className="number-white">10</span> 条
              </option>
              <option value={20} className="bg-slate-800 text-white hover:bg-slate-700">
                <span className="number-white">20</span> 条
              </option>
              <option value={30} className="bg-slate-800 text-white hover:bg-slate-700">
                <span className="number-white">30</span> 条
              </option>
              <option value={50} className="bg-slate-800 text-white hover:bg-slate-700">
                <span className="number-white">50</span> 条
              </option>
              <option value={100} className="bg-slate-800 text-white hover:bg-slate-700">
                <span className="number-white">100</span> 条
              </option>
            </select>
            <div 
              className="text-xs text-slate-400"
            >
              <i className="fa-solid fa-chevron-down"></i>
            </div>
          </div>
        )}
      </div>

      {/* 分页按钮 */}
      <div className="flex items-center gap-1">
        {/* 上一页按钮 */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
            px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1
            ${currentPage === 1 
              ? 'bg-slate-600/50 text-slate-500 cursor-not-allowed' 
              : 'bg-white/10 text-slate-200 hover:bg-white/20 border border-slate-600/30 hover:border-cyan-400/50'
            }
          `}
        >
          <i className="fa-solid fa-chevron-left text-xs"></i>
          <span className="hidden sm:inline">上一页</span>
        </button>

        {/* 页码按钮 */}
        <div className="flex items-center gap-1">
          {getVisiblePageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span 
                  key={`ellipsis-${index}`}
                  className="px-2 py-2 text-slate-400"
                >
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;
            return (
              // 移除motion.div，使用普通div
              <div
                key={page}
              >
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`
                    w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center
                    ${isActive 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25' 
                      : 'bg-white/10 text-slate-200 hover:bg-white/20 border border-slate-600/30 hover:border-cyan-400/50'
                    }
                  `}
                >
                  {isActive ? (
                    <span className="number-white">
                      {page}
                    </span>
                  ) : (
                    <span className="number-white">
                      {page}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* 下一页按钮 */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`
            px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1
            ${currentPage === totalPages 
              ? 'bg-slate-600/50 text-slate-500 cursor-not-allowed' 
              : 'bg-white/10 text-slate-200 hover:bg-white/20 border border-slate-600/30 hover:border-cyan-400/50'
            }
          `}
        >
          <span className="hidden sm:inline">下一页</span>
          <i className="fa-solid fa-chevron-right text-xs"></i>
        </button>
      </div>

      {/* 添加一个进度条 - 移除动画效果 */}
      <div 
        className="w-full max-w-md h-1 bg-slate-600/50 rounded-full overflow-hidden"
      >
        <div 
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
          style={{ width: `${(currentPage / totalPages) * 100}%` }}
        />
      </div>

      {/* 快速跳转 */}
      {totalPages > 10 && (
        <div 
          className="flex items-center gap-2 text-sm text-slate-300"
        >
          <span>跳转到</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            placeholder="页码"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const page = parseInt((e.target as HTMLInputElement).value);
                if (page >= 1 && page <= totalPages) {
                  onPageChange(page);
                  (e.target as HTMLInputElement).value = '';
                }
              }
            }}
            className="w-16 px-2 py-1 bg-white/10 border border-slate-600/30 rounded text-center text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
          />
          <span>页</span>
        </div>
      )}
    </div>
  );
}