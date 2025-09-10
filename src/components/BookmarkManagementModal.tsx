import React, { useState } from 'react';
import { X, Trash2, Move, ExternalLink, Search, FolderMinus } from 'lucide-react';
import { Bookmark, BookmarkList } from '../types';

interface BookmarkManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  list: BookmarkList;
  bookmarks: Bookmark[];
  allLists: BookmarkList[];
  onDeleteBookmark: (bookmarkId: string) => void;
  onMoveBookmark: (bookmarkId: string, targetListId: string) => void;
  onRemoveFolder: (listId: string) => void;
}

const BookmarkManagementModal: React.FC<BookmarkManagementModalProps> = ({
  isOpen,
  onClose,
  list,
  bookmarks,
  allLists,
  onDeleteBookmark,
  onMoveBookmark,
  onRemoveFolder,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookmarks, setSelectedBookmarks] = useState<Set<string>>(new Set());
  const [showMoveDropdown, setShowMoveDropdown] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredBookmarks = bookmarks.filter(bookmark =>
    bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bookmark.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectBookmark = (bookmarkId: string) => {
    const newSelected = new Set(selectedBookmarks);
    if (newSelected.has(bookmarkId)) {
      newSelected.delete(bookmarkId);
    } else {
      newSelected.add(bookmarkId);
    }
    setSelectedBookmarks(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedBookmarks.size === filteredBookmarks.length) {
      setSelectedBookmarks(new Set());
    } else {
      setSelectedBookmarks(new Set(filteredBookmarks.map(b => b.id)));
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedBookmarks.size} bookmark(s)?`)) {
      selectedBookmarks.forEach(bookmarkId => onDeleteBookmark(bookmarkId));
      setSelectedBookmarks(new Set());
    }
  };

  const handleBulkMove = (targetListId: string) => {
    selectedBookmarks.forEach(bookmarkId => onMoveBookmark(bookmarkId, targetListId));
    setSelectedBookmarks(new Set());
    setShowMoveDropdown(null);
  };

  const handleMoveBookmark = (bookmarkId: string, targetListId: string) => {
    onMoveBookmark(bookmarkId, targetListId);
    setShowMoveDropdown(null);
  };

  const otherLists = allLists.filter(l => l.id !== list.id);

  const handleRemoveFolder = () => {
    if (bookmarks.length > 0) {
      alert(`Cannot remove folder "${list.name}" because it contains ${bookmarks.length} bookmark(s). Please move or delete all bookmarks first.`);
      return;
    }
    
    if (confirm(`Remove empty folder "${list.name}"? This action cannot be undone.`)) {
      onRemoveFolder(list.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: list.color }}
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Manage {list.name}</h2>
              <p className="text-sm text-gray-500">{bookmarks.length} bookmark(s)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search and Actions Bar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center space-x-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search webmarks..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <button
              onClick={handleSelectAll}
              className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {selectedBookmarks.size === filteredBookmarks.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          
          {selectedBookmarks.size > 0 && (
            <div className="flex items-center space-x-2 ml-4">
              <span className="text-xs text-gray-500">
                {selectedBookmarks.size} selected
              </span>
              <div className="relative">
                <button
                  onClick={() => setShowMoveDropdown(showMoveDropdown ? null : 'bulk')}
                  className="flex items-center space-x-1 px-3 py-2 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Move className="w-3 h-3" />
                  <span>Move</span>
                </button>
                {showMoveDropdown === 'bulk' && otherLists.length > 0 && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="py-1">
                      {otherLists.map(targetList => (
                        <button
                          key={targetList.id}
                          onClick={() => handleBulkMove(targetList.id)}
                          className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                        >
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: targetList.color }}
                          />
                          <span>{targetList.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={handleBulkDelete}
                className="flex items-center space-x-1 px-3 py-2 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Bookmarks List */}
        <div className="flex-1 overflow-y-auto">
          {filteredBookmarks.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-gray-500 text-sm">
                {searchQuery ? 'No bookmarks match your search' : 'No bookmarks in this list'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredBookmarks.map((bookmark) => (
                <div key={bookmark.id} className="flex items-center p-4 hover:bg-gray-50 group">
                  <input
                    type="checkbox"
                    checked={selectedBookmarks.has(bookmark.id)}
                    onChange={() => handleSelectBookmark(bookmark.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3"
                  />
                  
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <img 
                      src={bookmark.favicon || `https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}&sz=16`}
                      alt=""
                      className="w-4 h-4 flex-shrink-0"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {bookmark.title}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {bookmark.url}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Open bookmark"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    
                    <div className="relative">
                      <button
                        onClick={() => setShowMoveDropdown(showMoveDropdown === bookmark.id ? null : bookmark.id)}
                        className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Move bookmark"
                        disabled={otherLists.length === 0}
                      >
                        <Move className="w-3 h-3" />
                      </button>
                      {showMoveDropdown === bookmark.id && otherLists.length > 0 && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          <div className="py-1">
                            {otherLists.map(targetList => (
                              <button
                                key={targetList.id}
                                onClick={() => handleMoveBookmark(bookmark.id, targetList.id)}
                                className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                              >
                                <div 
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: targetList.color }}
                                />
                                <span>{targetList.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => {
                        if (confirm('Delete this bookmark?')) {
                          onDeleteBookmark(bookmark.id);
                        }
                      }}
                      className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete bookmark"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleRemoveFolder}
            disabled={bookmarks.length > 0}
            title={bookmarks.length > 0 
              ? `Cannot remove folder with ${bookmarks.length} bookmark(s). Move or delete bookmarks first.` 
              : `Remove empty folder "${list.name}"`
            }
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              bookmarks.length > 0
                ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                : 'text-red-600 hover:text-red-800 hover:bg-red-50'
            }`}
          >
            <FolderMinus className="w-4 h-4" />
            <span>Remove Folder</span>
          </button>
          
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookmarkManagementModal;