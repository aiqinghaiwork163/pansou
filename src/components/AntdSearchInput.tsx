import { useState, useEffect, useRef } from 'react';
import { Input, Button, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
// 移除历史搜索功能
// import { useSearchHistory } from '@/hooks/useSearchHistory';
// import { GradientText } from './GradientText';

interface AntdSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value?: string) => void;
  disabled?: boolean;
}

export function AntdSearchInput({ value, onChange, onSearch, disabled = false }: AntdSearchInputProps) {
  const [localValue, setLocalValue] = useState(value);
  // 移除历史搜索功能
  // const [open, setOpen] = useState(false);
  // const searchHistoryHook = useSearchHistory();
  // const { searchHistory, addSearchHistory, removeSearchHistory, clearSearchHistory } = searchHistoryHook;
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  
  // 移除历史搜索功能 - 点击外部关闭下拉菜单
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
  //       setOpen(false);
  //     }
  //   };
  //   
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => document.removeEventListener('mousedown', handleClickOutside);
  // }, []);
  
  const handleSubmit = () => {
    if (localValue.trim()) {
      // 移除历史搜索功能 - 不再添加搜索历史
      // addSearchHistory(localValue.trim());
      onSearch(localValue.trim());
      // setOpen(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
    
    // 移除历史搜索功能 - 不再根据历史记录显示下拉菜单
    // if (searchHistory.length > 0 && !open) {
    //   setOpen(true);
    // }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && localValue.trim()) {
      // 移除历史搜索功能 - 不再添加搜索历史
      // addSearchHistory(localValue.trim());
      onSearch(localValue.trim());
      // setOpen(false);
    } else if (e.key === 'Escape') {
      // setOpen(false);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      // 移除历史搜索功能 - 不再阻止方向键默认行为
      // e.preventDefault();
    }
  };
  
  // 移除历史搜索功能 - 历史记录点击处理
  // const handleHistoryClick = (keyword: string) => {
  //   setLocalValue(keyword);
  //   onChange(keyword);
  //   setOpen(false);
  //   setTimeout(() => {
  //     onSearch(keyword);
  //   }, 100);
  // };
  
  // 移除历史搜索功能 - 历史记录删除处理
  // const handleHistoryDelete = (e: React.MouseEvent, keyword: string) => {
  //   e.stopPropagation();
  //   removeSearchHistory(keyword);
  //   message.success(`已删除搜索记录: ${keyword}`);
  //   
  //   if (searchHistory.length <= 1) {
  //     setOpen(false);
  //   }
  // };
  
  // 移除历史搜索功能 - 整个菜单组件
  // const menu = (
  //   <Menu className="w-full">
  //     {searchHistory.length > 0 ? (
  //       <>
  //         <Menu.ItemGroup 
  //           title={
  //             <div className="flex items-center justify-between px-4 py-2">
  //               <span className="flex items-center">
  //                 <HistoryOutlined className="mr-2 text-blue-500" />
  //                 <GradientText gradient="primary" animate={true}>
  //                   搜索历史
  //                 </GradientText>
  //               </span>
  //               <Button 
  //                 type="text" 
  //                 icon={<ClearOutlined />} 
  //                 onClick={(e) => {
  //                   e.stopPropagation();
  //                   clearSearchHistory();
  //                   message.success('搜索历史已清空');
  //                 }}
  //                 size="small"
  //                 danger
  //                 className="hover:text-red-600"
  //               >
  //                 清空
  //               </Button>
  //             </div>
  //           }
  //         >
  //           {searchHistory.map((keyword, index) => (
  //             <Menu.Item 
  //               key={`${keyword}-${index}`} 
  //               className="flex items-center justify-between group px-2 py-1"
  //             >
  //               <div 
  //                 className="truncate group-hover:text-blue-600 font-medium transition-colors duration-100 cursor-pointer flex-1 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
  //                 onClick={() => handleHistoryClick(keyword)}
  //               >
  //                 {keyword}
  //               </div>
  //               <Button 
  //                 type="text" 
  //                 size="small"
  //                 onClick={(e) => handleHistoryDelete(e, keyword)}
  //                 className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
  //                 danger
  //                 aria-label={`删除 ${keyword}`}
  //               >
  //                 删除
  //               </Button>
  //             </Menu.Item>
  //           ))}
  //         </Menu.ItemGroup>
  //         <Menu.Item 
  //           className="px-4 py-2 text-center text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
  //           onClick={() => setOpen(false)}
  //         >
  //           关闭历史记录
  //         </Menu.Item>
  //       </>
  //     ) : (
  //       <div className="p-4">
  //         <Empty 
  //           description={
  //             <div className="text-center text-slate-500">
  //               <p className="text-sm font-medium">暂无搜索历史</p>
  //               <p className="text-xs text-slate-400 mt-1">开始搜索，创建您的专属记录</p>
  //             </div>
  //           }
  //           image={Empty.PRESENTED_IMAGE_SIMPLE}
  //           className="m-0"
  //         />
  //       </div>
  //     )}
  //   </Menu>
  // );
  
  return (
    // 移除历史搜索功能 - 简化组件结构
    <div className="w-full max-w-3xl mx-auto relative">
      <div className="flex gap-2">
        <div className="relative rounded-full overflow-hidden group flex-1">
          <Input
            value={localValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="🔍 输入关键词，探索无限可能..."
            size="large"
            className="w-full h-14 rounded-full pl-12 pr-40 shadow-sm border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
          {/* 渐变边框装饰 */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-blue-600 to-purple-600 p-[1px] opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10"></div>
        </div>
        
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={() => {
            if (localValue.trim()) {
              // 移除历史搜索功能 - 不再添加搜索历史
              // addSearchHistory(localValue.trim());
              onSearch(localValue.trim());
              // setOpen(false);
            } else {
              message.warning('请输入搜索关键词');
            }
          }}
          disabled={disabled}
          size="large"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-transparent shadow-md hover:shadow-lg transition-all duration-300"
        >
          搜索
        </Button>
      </div>
    </div>
  );
}
