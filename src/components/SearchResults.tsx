import React from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { Bookmark } from '../types';
import BookmarkItem from './BookmarkItem';

interface SearchResultsProps {
  query: string;
  results: Bookmark[];
  onClearSearch: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  query,
  results,
  onClearSearch,
}) => {
  return (
    <div className="flex justify-center px-6">
      <div className="w-full max-w-2xl">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-xl shadow-lg border border-white border-opacity-20">
          {/* Search Results Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 border-opacity-50">
            <div className="flex items-center space-x-3">
              <button
                onClick={onClearSearch}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 hover:bg-opacity-70 rounded-lg transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-500" />
                <div>
                  <h2 className="font-semibold text-gray-900 text-sm">Search Results</h2>
                  <p className="text-xs text-gray-500">
                    {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search Results Content */}
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            {results.length > 0 ? (
              <div>
                {results.map((bookmark) => (
                  <BookmarkItem
                    key={bookmark.id}
                    bookmark={bookmark}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-12 h-12 bg-gray-100 bg-opacity-70 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-800 mb-1">
                  No bookmarks found
                </h3>
                <p className="text-xs text-gray-600">
                  Try adjusting your search terms or browse your lists instead.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;