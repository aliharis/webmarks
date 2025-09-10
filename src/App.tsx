import React, { useState, useMemo, useEffect } from 'react';
import { Bookmark as BookmarkIcon, Columns, Settings as SettingsIcon } from 'lucide-react';
import BookmarkColumn, { SortOption } from './components/BookmarkColumn';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import AddBookmarkModal from './components/AddBookmarkModal';
import AddDropdown from './components/AddDropdown';
import AddListModal from './components/AddListModal';
import Settings from './components/Settings';
import EmptyState from './components/EmptyState';
import BookmarkManagementModal from './components/BookmarkManagementModal';
import { Bookmark, BookmarkFormData, BookmarkList } from './types';

function App() {
  const [lists, setLists] = useState<BookmarkList[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | undefined>();
  const [showAddListModal, setShowAddListModal] = useState(false);
  const [draggedListId, setDraggedListId] = useState<string | null>(null);
  const [draggedOverListId, setDraggedOverListId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [chromeBookmarks, setChromeBookmarks] = useState<any[]>([]);
  const [showBookmarkManagementModal, setShowBookmarkManagementModal] = useState(false);
  const [selectedManagementListId, setSelectedManagementListId] = useState<string | null>(null);

  // Load Chrome bookmarks and selected folders
  useEffect(() => {
    loadChromeBookmarks();
    loadSelectedFolders();
  }, []);

  // Reload bookmarks when settings are closed
  useEffect(() => {
    if (!showSettings) {
      loadChromeBookmarks();
    }
  }, [showSettings]);

  const loadSelectedFolders = async () => {
    try {
      if (chrome?.storage) {
        const result = await chrome.storage.local.get(['selectedFolders']);
        if (result.selectedFolders) {
          setSelectedFolders(result.selectedFolders);
        }
      } else {
        // Development fallback
        const stored = localStorage.getItem('selectedFolders');
        if (stored) {
          setSelectedFolders(JSON.parse(stored));
        }
      }
    } catch (error) {
      console.error('Error loading selected folders:', error);
    }
  };

  const loadChromeBookmarks = async () => {
    try {
      if (chrome?.bookmarks) {
        const tree = await chrome.bookmarks.getTree();
        const folders = await loadSelectedFolders();
        const result = await chrome.storage.local.get(['selectedFolders']);
        const selected = result.selectedFolders || [];
        
        if (selected.length > 0) {
          const extractedData = extractBookmarksFromFolders(tree[0], selected);
          setLists(extractedData.lists);
          setBookmarks(extractedData.bookmarks);
        } else {
          // If no folders selected, show empty state
          setLists([]);
          setBookmarks([]);
        }
      } else {
        // Development fallback - no folders selected
        setLists([]);
        setBookmarks([]);
      }
    } catch (error) {
      console.error('Error loading Chrome bookmarks:', error);
      setLists([]);
      setBookmarks([]);
    }
  };

  const extractBookmarksFromFolders = (node: any, selectedFolderIds: string[]) => {
    const lists: BookmarkList[] = [];
    const bookmarks: Bookmark[] = [];
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899'];
    let colorIndex = 0;

    const processNode = (node: any) => {
      if (!node.children) return;

      for (const child of node.children) {
        if (selectedFolderIds.includes(child.id)) {
          // Create a list for this folder
          const list: BookmarkList = {
            id: child.id,
            name: child.title || 'Untitled',
            color: colors[colorIndex % colors.length],
            bookmarkCount: 0
          };
          colorIndex++;
          lists.push(list);

          // Extract bookmarks from this folder
          if (child.children) {
            for (const bookmark of child.children) {
              if (bookmark.url) {
                bookmarks.push({
                  id: bookmark.id,
                  title: bookmark.title || 'Untitled',
                  url: bookmark.url,
                  favicon: `https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}&sz=16`,
                  tags: [],
                  listId: child.id,
                  createdAt: new Date(bookmark.dateAdded || Date.now())
                });
                list.bookmarkCount++;
              }
            }
          }
        }
        // Recursively process child folders
        processNode(child);
      }
    };

    processNode(node);
    
    // Sort bookmarks by most recent (default sort order) for each list
    const sortedBookmarks = [...bookmarks].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return { lists, bookmarks: sortedBookmarks };
  };

  // Filter bookmarks based on search
  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter(bookmark => {
      const matchesSearch = searchQuery === '' || 
        bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.url.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [bookmarks, searchQuery]);

  const handleAddBookmark = (data: BookmarkFormData) => {
    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      title: data.title,
      url: data.url,
      description: data.description || undefined,
      favicon: `https://www.google.com/s2/favicons?domain=${new URL(data.url).hostname}&sz=16`,
      tags: data.tags,
      listId: data.listId,
      createdAt: new Date(),
    };
    setBookmarks(prev => [newBookmark, ...prev]);
    
    // Update list bookmark count
    setLists(prev => prev.map(list => 
      list.id === data.listId 
        ? { ...list, bookmarkCount: list.bookmarkCount + 1 }
        : list
    ));
  };

  const handleAddBookmarkToList = (listId: string) => {
    setSelectedListId(listId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedListId(undefined);
  };

  const handleAddList = () => {
    setShowAddListModal(true);
  };

  const handleCreateList = (name: string, color: string) => {
    const newList: BookmarkList = {
      id: Date.now().toString(),
      name,
      color,
      bookmarkCount: 0,
    };
    setLists(prev => [...prev, newList]);
  };

  const handleColumnClick = (listId: string) => {
    setSelectedManagementListId(listId);
    setShowBookmarkManagementModal(true);
  };

  const handleCloseBookmarkManagementModal = () => {
    setShowBookmarkManagementModal(false);
    setSelectedManagementListId(null);
  };

  const handleDeleteBookmark = async (bookmarkId: string) => {
    try {
      // If using Chrome bookmarks API, delete from Chrome
      if (chrome?.bookmarks) {
        await chrome.bookmarks.remove(bookmarkId);
      }
      
      // Update local state
      setBookmarks(prev => prev.filter(bookmark => bookmark.id !== bookmarkId));
      
      // Update list bookmark count
      const deletedBookmark = bookmarks.find(b => b.id === bookmarkId);
      if (deletedBookmark) {
        setLists(prev => prev.map(list => 
          list.id === deletedBookmark.listId 
            ? { ...list, bookmarkCount: list.bookmarkCount - 1 }
            : list
        ));
      }
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      // For now, still update local state even if Chrome API fails
      setBookmarks(prev => prev.filter(bookmark => bookmark.id !== bookmarkId));
    }
  };

  const handleMoveBookmark = async (bookmarkId: string, targetListId: string) => {
    try {
      // If using Chrome bookmarks API, move the bookmark
      if (chrome?.bookmarks) {
        await chrome.bookmarks.move(bookmarkId, { parentId: targetListId });
      }
      
      // Update local state
      const bookmarkToMove = bookmarks.find(b => b.id === bookmarkId);
      if (bookmarkToMove) {
        const oldListId = bookmarkToMove.listId;
        
        setBookmarks(prev => prev.map(bookmark =>
          bookmark.id === bookmarkId
            ? { ...bookmark, listId: targetListId }
            : bookmark
        ));
        
        // Update list bookmark counts
        setLists(prev => prev.map(list => {
          if (list.id === oldListId) {
            return { ...list, bookmarkCount: list.bookmarkCount - 1 };
          } else if (list.id === targetListId) {
            return { ...list, bookmarkCount: list.bookmarkCount + 1 };
          }
          return list;
        }));
      }
    } catch (error) {
      console.error('Error moving bookmark:', error);
      // For now, still update local state even if Chrome API fails
      const bookmarkToMove = bookmarks.find(b => b.id === bookmarkId);
      if (bookmarkToMove) {
        setBookmarks(prev => prev.map(bookmark =>
          bookmark.id === bookmarkId
            ? { ...bookmark, listId: targetListId }
            : bookmark
        ));
      }
    }
  };

  const handleRemoveFolder = async (listId: string) => {
    try {
      // If using Chrome bookmarks API, remove the entire folder
      if (chrome?.bookmarks) {
        await chrome.bookmarks.removeTree(listId);
      }
      
      // Update local state - remove all bookmarks from this folder
      setBookmarks(prev => prev.filter(bookmark => bookmark.listId !== listId));
      
      // Remove the list from lists
      setLists(prev => prev.filter(list => list.id !== listId));
      
      // Update selected folders to remove this folder
      const updatedSelectedFolders = selectedFolders.filter(folderId => folderId !== listId);
      setSelectedFolders(updatedSelectedFolders);
      
      // Save updated selected folders
      try {
        if (chrome?.storage) {
          await chrome.storage.local.set({ selectedFolders: updatedSelectedFolders });
        } else {
          localStorage.setItem('selectedFolders', JSON.stringify(updatedSelectedFolders));
        }
      } catch (storageError) {
        console.error('Error updating selected folders:', storageError);
      }
      
    } catch (error) {
      console.error('Error removing folder:', error);
      // For now, still update local state even if Chrome API fails
      setBookmarks(prev => prev.filter(bookmark => bookmark.listId !== listId));
      setLists(prev => prev.filter(list => list.id !== listId));
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleSort = (listId: string, sortBy: SortOption) => {
    setBookmarks(prev => {
      const listBookmarks = prev.filter(bookmark => bookmark.listId === listId);
      const otherBookmarks = prev.filter(bookmark => bookmark.listId !== listId);
      
      let sortedBookmarks;
      switch (sortBy) {
        case 'recent':
          sortedBookmarks = listBookmarks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          break;
        case 'oldest':
          sortedBookmarks = listBookmarks.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
          break;
        case 'alphabetical':
          sortedBookmarks = listBookmarks.sort((a, b) => a.title.localeCompare(b.title));
          break;
        default:
          sortedBookmarks = listBookmarks;
      }
      
      return [...otherBookmarks, ...sortedBookmarks];
    });
  };

  const handleDragStart = (listId: string) => {
    setDraggedListId(listId);
  };

  const handleDragOver = (e: React.DragEvent, listId?: string) => {
    e.preventDefault();
    if (listId && listId !== draggedListId) {
      setDraggedOverListId(listId);
    }
  };

  const handleDrop = (e: React.DragEvent, targetListId: string) => {
    e.preventDefault();
    
    if (!draggedListId || draggedListId === targetListId) {
      setDraggedListId(null);
      return;
    }

    const draggedIndex = lists.findIndex(list => list.id === draggedListId);
    const targetIndex = lists.findIndex(list => list.id === targetListId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedListId(null);
      return;
    }

    const newLists = [...lists];
    const [draggedList] = newLists.splice(draggedIndex, 1);
    newLists.splice(targetIndex, 0, draggedList);

    setLists(newLists);
    setDraggedListId(null);
    setDraggedOverListId(null);
  };
  // Update list bookmark counts
  const handleDragEnd = () => {
    setDraggedListId(null);
    setDraggedOverListId(null);
  };

  const listsWithCounts = useMemo(() => {
    return lists.map(list => ({
      ...list,
      bookmarkCount: bookmarks.filter(bookmark => bookmark.listId === list.id).length
    }));
  }, [lists, bookmarks]);

  // Show settings page if active
  if (showSettings) {
    return <Settings onClose={() => setShowSettings(false)} />;
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: 'url(/sergei-gussev-010yr9rFtIc-unsplash.jpg)',
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      
      <div className="relative z-10 px-6 py-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg">
                <Columns className="w-6 h-6 text-gray-800" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white drop-shadow-lg">Webmarks</h1>
                <p className="text-white text-opacity-90 text-xs drop-shadow">Organize your links across lists</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowSettings(true)}
                className="w-10 h-10 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg hover:bg-opacity-100 transition-all"
                title="Settings"
              >
                <SettingsIcon className="w-5 h-5 text-gray-700" />
              </button>
              <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search webmarks..."
                />
              </div>
              <AddDropdown
                onAddBookmark={() => setShowModal(true)}
                onAddList={handleAddList}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        {searchQuery ? (
          <SearchResults
            query={searchQuery}
            results={filteredBookmarks}
            onClearSearch={handleClearSearch}
          />
        ) : listsWithCounts.length === 0 ? (
          <EmptyState onOpenSettings={() => setShowSettings(true)} />
        ) : (
          <div>
            {/* Columns Layout */}
            <div 
              className="flex items-start space-x-3 overflow-x-auto pb-10 pt-4 px-2"
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setDraggedOverListId(null);
                }
              }}
              onDragEnd={handleDragEnd}
            >
              {listsWithCounts.map((list, index) => {
                const listBookmarks = bookmarks.filter(bookmark => bookmark.listId === list.id);
                const isDragging = draggedListId === list.id;
                const isDraggedOver = draggedOverListId === list.id;
                
                // Show placeholder when dragging over this position
                const showPlaceholder = draggedListId && draggedOverListId === list.id && draggedListId !== list.id;
                
                return (
                  <React.Fragment key={list.id}>
                    {showPlaceholder && (
                      <div className="flex-shrink-0 w-72 min-h-32 border-2 border-dashed border-blue-400 border-opacity-60 rounded-xl bg-blue-50 bg-opacity-30 backdrop-blur-sm flex items-center justify-center transition-all duration-200 animate-pulse">
                        <div className="text-blue-500 text-sm font-medium">Drop here</div>
                      </div>
                    )}
                    <BookmarkColumn
                      list={list}
                      bookmarks={listBookmarks}
                      onAddBookmark={handleAddBookmarkToList}
                      onSort={handleSort}
                      onDragStart={handleDragStart}
                      onDragOver={(e) => handleDragOver(e, list.id)}
                      onDrop={handleDrop}
                      onColumnClick={handleColumnClick}
                      isDragging={isDragging}
                      isDraggedOver={isDraggedOver}
                      showPlaceholder={false}
                    />
                  </React.Fragment>
                );
              })}
            </div>

            {/* Empty State */}
            {bookmarks.length === 0 && (
              <div className="text-center py-16 bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-lg">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookmarkIcon className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Start organizing your webmarks
                </h3>
                <p className="text-gray-700 max-w-sm mx-auto mb-6">
                  Create lists to organize your links by topic, priority, or any way that works for you.
                </p>
                <AddDropdown
                  onAddBookmark={() => setShowModal(true)}
                  onAddList={handleAddList}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Bookmark Modal */}
      <AddBookmarkModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleAddBookmark}
        lists={listsWithCounts}
        defaultListId={selectedListId}
      />

      {/* Add List Modal */}
      <AddListModal
        isOpen={showAddListModal}
        onClose={() => setShowAddListModal(false)}
        onSubmit={handleCreateList}
      />

      {/* Bookmark Management Modal */}
      {selectedManagementListId && (
        <BookmarkManagementModal
          isOpen={showBookmarkManagementModal}
          onClose={handleCloseBookmarkManagementModal}
          list={listsWithCounts.find(list => list.id === selectedManagementListId)!}
          bookmarks={bookmarks.filter(bookmark => bookmark.listId === selectedManagementListId)}
          allLists={listsWithCounts}
          onDeleteBookmark={handleDeleteBookmark}
          onMoveBookmark={handleMoveBookmark}
          onRemoveFolder={handleRemoveFolder}
        />
      )}
      
      {/* Image Attribution */}
      <div className="fixed bottom-3 right-3 text-xs text-white text-opacity-70 bg-black bg-opacity-30 backdrop-blur-sm px-3 py-1.5 rounded-full">
        Photo by{' '}
        <a 
          href="https://unsplash.com/@sergeigussev?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-opacity-100 transition-opacity"
        >
          Sergei Gussev
        </a>
        {' '}on{' '}
        <a 
          href="https://unsplash.com/photos/010yr9rFtIc?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-opacity-100 transition-opacity"
        >
          Unsplash
        </a>
      </div>
    </div>
  );
}

export default App;