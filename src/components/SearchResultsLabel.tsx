import { FC, memo, useEffect, useState } from 'react';

interface SearchResultsLabelProps {
  originalTotal: number;
  validTotal: number;
  searchTime: number;
}

const SearchResultsLabel: FC<SearchResultsLabelProps> = memo(({ originalTotal, validTotal, searchTime }) => {
  const [hasInvalidResults, setHasInvalidResults] = useState(false);
  
  useEffect(() => {
    setHasInvalidResults(originalTotal > validTotal);
  }, [originalTotal, validTotal]);
  
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <div className="inline-flex items-center bg-teal-500/20 border border-teal-400/30 rounded-lg px-3 py-1">
        <span className="text-teal-300 text-sm font-semibold mr-2">搜索结果:</span>
        <span className="number-bright">
          {originalTotal}
        </span>
      </div>
      
      {hasInvalidResults && (
        <div className="inline-flex items-center bg-green-500/20 border border-green-400/30 rounded-lg px-3 py-1">
          <span className="text-green-300 text-sm font-semibold mr-2">有效结果:</span>
          <span className="number-bright">
            {validTotal}
          </span>
        </div>
      )}
      
      <div className="inline-flex items-center bg-blue-500/20 border border-blue-400/30 rounded-lg px-3 py-1">
        <span className="text-blue-300 text-sm font-semibold mr-2">用时:</span>
        <span className="number-bright">
          {searchTime}ms
        </span>
      </div>
    </div>
  );
});

SearchResultsLabel.displayName = 'SearchResultsLabel';

export default SearchResultsLabel;