import React from 'react';
import { ExternalLink, Tag, Clock } from 'lucide-react';
import { Bookmark } from '../types';

interface BookmarkItemProps {
  bookmark: Bookmark;
}

const BookmarkItem: React.FC<BookmarkItemProps> = ({ bookmark }) => {
  const formatDate = (date: Date) => {
    try {
      if (typeof Intl !== 'undefined' && typeof Intl.RelativeTimeFormat === 'function') {
        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
        const daysDiff = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return rtf.format(daysDiff, 'day');
      }
    } catch (error) {
      // Fall through to fallback
    }
    
    return date.toLocaleDateString('en', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(bookmark.url, '_blank');
  };

  return (
    <div className="group border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
      <div
        onClick={handleClick}
        className="block p-3 cursor-pointer"
      >
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center flex-1 min-w-0">
            {bookmark.favicon ? (
              <img
                src={bookmark.favicon}
                alt=""
                className="w-3.5 h-3.5 flex-shrink-0 rounded mr-2"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-3.5 h-3.5 bg-gray-200 rounded flex-shrink-0"></div>
            )}
            <h3 className="font-medium text-gray-900 text-xs leading-tight group-hover:text-gray-700 transition-colors">
              {bookmark.title}
            </h3>
          </div>
          <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="truncate">{new URL(bookmark.url).hostname}</span>
          <div className="flex items-center space-x-1 flex-shrink-0">
            <Clock className="w-2.5 h-2.5" />
            <span>{formatDate(bookmark.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookmarkItem;