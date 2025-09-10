import React, { useState, useRef, useEffect } from 'react';
import { Plus, MoreHorizontal, Clock, ArrowUpDown } from 'lucide-react';
import { BookmarkList, Bookmark } from '../types';
import BookmarkItem from './BookmarkItem';

export type SortOption = 'recent' | 'oldest' | 'alphabetical';

interface BookmarkColumnProps {
  list: BookmarkList;
  bookmarks: Bookmark[];
  onAddBookmark: (listId: string) => void;
  onSort: (listId: string, sortBy: SortOption) => void;
  onDragStart: (listId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetListId: string) => void;
  onColumnClick: (listId: string) => void;
  isDragging: boolean;
  isDraggedOver: boolean;
  showPlaceholder: boolean;
}

const BookmarkColumn: React.FC<BookmarkColumnProps> = ({
  list,
  bookmarks,
  onAddBookmark,
  onSort,
  onDragStart,
  onDragOver,
  onDrop,
  onColumnClick,
  isDragging,
  isDraggedOver,
  showPlaceholder,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(list.id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    onDragOver(e);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(e, list.id);
  };

  const handleSort = (sortBy: SortOption) => {
    onSort(list.id, sortBy);
    setShowMenu(false);
  };

  if (showPlaceholder) {
    return (
      <div className="flex-shrink-0 w-72 min-h-32 border-2 border-dashed border-gray-300 border-opacity-60 rounded-xl bg-gray-100 bg-opacity-30 backdrop-blur-sm flex items-center justify-center transition-all duration-200">
        <div className="text-gray-400 text-sm font-medium">Drop here</div>
      </div>
    );
  }

  const handleHeaderClick = (e: React.MouseEvent) => {
    // Don't trigger column click if clicking on buttons
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }
    onColumnClick(list.id);
  };

  return (
    <div
      className={`overflow-hidden flex-shrink-0 w-72 bg-white bg-opacity-95 backdrop-blur-sm rounded-xl shadow-lg border border-white border-opacity-20 transition-all duration-200 transform-gpu ${isDragging
          ? 'opacity-30 scale-95 rotate-2 z-50 shadow-2xl'
          : isDraggedOver
            ? 'scale-105 shadow-2xl ring-2 ring-blue-400 ring-opacity-50'
            : 'hover:shadow-xl hover:scale-[1.02]'
        }`}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div
        className="flex items-center justify-between p-3 border-b border-gray-200 border-opacity-50 cursor-pointer hover:bg-gray-50 hover:bg-opacity-50 transition-colors"
        onClick={handleHeaderClick}
      >
        <div className="flex items-center space-x-2">
          <div
            className="w-2.5 h-2.5 rounded-full shadow-sm"
            style={{ backgroundColor: list.color }}
          ></div>
          <div>
            <h2 className="font-semibold text-gray-900 text-xs">{list.name}</h2>
            <p className="text-xs text-gray-500">{list.bookmarkCount} items</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onAddBookmark(list.id)}
            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 hover:bg-opacity-70 rounded-lg transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 hover:bg-opacity-70 rounded-lg transition-all"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-8 w-40 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-xl border border-white border-opacity-20 z-50 py-1">
                <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                  Sort by
                </div>
                <button
                  onClick={() => handleSort('recent')}
                  className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 hover:bg-opacity-70 flex items-center transition-colors"
                >
                  <Clock className="w-3 h-3 mr-2 text-gray-500" />
                  Recent
                </button>
                <button
                  onClick={() => handleSort('oldest')}
                  className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 hover:bg-opacity-70 flex items-center transition-colors"
                >
                  <Clock className="w-3 h-3 mr-2 text-gray-500 rotate-180" />
                  Oldest
                </button>
                <button
                  onClick={() => handleSort('alphabetical')}
                  className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 hover:bg-opacity-70 flex items-center transition-colors"
                >
                  <ArrowUpDown className="w-3 h-3 mr-2 text-gray-500" />
                  Alphabetical
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Column Content */}
      <div className="max-h-[80vh] overflow-y-auto overflow-x-hidden rounded-b-xl">
        {bookmarks.length > 0 ? (
          <div>
            {bookmarks.map((bookmark) => (
              <BookmarkItem
                key={bookmark.id}
                bookmark={bookmark}
              />
            ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="w-10 h-10 bg-gray-100 bg-opacity-70 rounded-full flex items-center justify-center mx-auto mb-2">
              <Plus className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mb-2">No bookmarks yet</p>
            <button
              onClick={() => onAddBookmark(list.id)}
              className="text-xs text-gray-600 hover:text-gray-900 transition-colors"
            >
              Add your first bookmark
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarkColumn;