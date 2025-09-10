import React, { useState, useEffect } from 'react';
import { Folder, Check, ChevronRight, Settings as SettingsIcon, Columns, X } from 'lucide-react';

interface BookmarkFolder {
  id: string;
  title: string;
  parentId?: string;
  children?: BookmarkFolder[];
  path: string;
  bookmarkCount: number;
}

interface SettingsProps {
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const [folders, setFolders] = useState<BookmarkFolder[]>([]);
  const [selectedFolders, setSelectedFolders] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadBookmarkFolders();
    loadSelectedFolders();
  }, []);

  const loadBookmarkFolders = async () => {
    try {
      if (chrome?.bookmarks) {
        const tree = await chrome.bookmarks.getTree();
        const extractedFolders = extractFolders(tree[0], '');
        setFolders(extractedFolders);
      } else {
        // Fallback for development
        setFolders(getMockFolders());
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      setFolders(getMockFolders());
    } finally {
      setLoading(false);
    }
  };

  const extractFolders = (node: chrome.bookmarks.BookmarkTreeNode, path: string): BookmarkFolder[] => {
    const folders: BookmarkFolder[] = [];
    const currentPath = path ? `${path} > ${node.title}` : node.title || 'Bookmarks';

    if (node.children) {
      // Count bookmarks in this folder (direct children that have URLs)
      const bookmarkCount = node.children.filter(child => child.url).length;

      // Add the current folder if it has children
      if (node.id !== '0') { // Skip the root node
        folders.push({
          id: node.id,
          title: node.title || 'Untitled',
          parentId: node.parentId,
          path: currentPath,
          children: [],
          bookmarkCount
        });
      }

      // Recursively extract child folders
      for (const child of node.children) {
        if (!child.url) { // It's a folder, not a bookmark
          const childFolders = extractFolders(child, currentPath);
          folders.push(...childFolders);
        }
      }
    }

    return folders;
  };

  const getMockFolders = (): BookmarkFolder[] => {
    return [
      { id: '1', title: 'Bookmarks Bar', path: 'Bookmarks Bar', bookmarkCount: 8 },
      { id: '2', title: 'Work', path: 'Bookmarks Bar > Work', bookmarkCount: 12 },
      { id: '3', title: 'Personal', path: 'Bookmarks Bar > Personal', bookmarkCount: 5 },
      { id: '4', title: 'Reading List', path: 'Bookmarks Bar > Reading List', bookmarkCount: 23 },
      { id: '5', title: 'Other Bookmarks', path: 'Other Bookmarks', bookmarkCount: 3 },
      { id: '6', title: 'Projects', path: 'Other Bookmarks > Projects', bookmarkCount: 15 },
    ];
  };

  const loadSelectedFolders = async () => {
    try {
      if (chrome?.storage) {
        const result = await chrome.storage.local.get(['selectedFolders']);
        if (result.selectedFolders) {
          setSelectedFolders(new Set(result.selectedFolders));
        }
      } else {
        // Development fallback
        const stored = localStorage.getItem('selectedFolders');
        if (stored) {
          setSelectedFolders(new Set(JSON.parse(stored)));
        }
      }
    } catch (error) {
      console.error('Error loading selected folders:', error);
    }
  };

  const toggleFolder = (folderId: string) => {
    const newSelected = new Set(selectedFolders);
    if (newSelected.has(folderId)) {
      newSelected.delete(folderId);
    } else {
      newSelected.add(folderId);
    }
    setSelectedFolders(newSelected);
  };

  const saveSettings = async () => {
    try {
      const selectedArray = Array.from(selectedFolders);
      if (chrome?.storage) {
        await chrome.storage.local.set({ selectedFolders: selectedArray });
      } else {
        // Development fallback
        localStorage.setItem('selectedFolders', JSON.stringify(selectedArray));
      }
      onClose();
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const toggleExpanded = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  // Group folders by parent
  const groupedFolders = folders.reduce((acc, folder) => {
    const parentPath = folder.path.split(' > ').slice(0, -1).join(' > ');
    if (!acc[parentPath]) {
      acc[parentPath] = [];
    }
    acc[parentPath].push(folder);
    return acc;
  }, {} as Record<string, BookmarkFolder[]>);

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
        {/* Header - Same as main page */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg">
                <Columns className="w-6 h-6 text-gray-800" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white drop-shadow-lg">Webmarks</h1>
                <p className="text-white text-opacity-90 text-xs drop-shadow">Settings</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg hover:bg-opacity-100 transition-all"
              title="Close Settings"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Settings Card Container */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-xl shadow-2xl p-6">
            {/* Settings Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-3">
                <SettingsIcon className="h-7 w-7 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800">Folder Selection</h2>
              </div>
              <p className="text-gray-600 text-sm max-w-md mx-auto">
                Choose folders to display as columns on your homepage
              </p>
            </div>

            {/* Folders List */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8 min-h-96 max-h-[500px] overflow-y-auto border border-gray-200">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {folders.length === 0 ? (
                    <div className="text-center py-16">
                      <Folder className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No bookmark folders found</p>
                    </div>
                  ) : (
                    folders.map((folder) => (
                      <div
                        key={folder.id}
                        className="flex items-center gap-4 py-4 px-2 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                        onClick={() => toggleFolder(folder.id)}
                      >
                        <div className="flex-shrink-0">
                          <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${selectedFolders.has(folder.id)
                              ? 'bg-blue-500 border-blue-500 scale-105'
                              : 'border-gray-300 hover:border-blue-400'
                            }`}>
                            {selectedFolders.has(folder.id) && (
                              <Check className="h-4 w-4 text-white" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium truncate ${selectedFolders.has(folder.id) ? 'text-blue-900' : 'text-gray-800'
                            }`}>{folder.title}</div>
                          <div className="text-gray-500 text-sm truncate mt-0.5">{folder.path}</div>
                        </div>
                        <div className="flex-shrink-0 ml-3">
                          <div className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                            {folder.bookmarkCount}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Selected Count and Actions */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedFolders.size > 0 ? (
                    <>
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{selectedFolders.size}</span>
                      </div>
                      <span className="text-gray-700 font-medium">
                        {selectedFolders.size} folder{selectedFolders.size !== 1 ? 's' : ''} selected
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-sm font-bold">0</span>
                      </div>
                      <span className="text-gray-500 font-medium">No folders selected</span>
                    </>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-all font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveSettings}
                    disabled={selectedFolders.size === 0}
                    className={`px-5 py-2.5 rounded-lg transition-all font-medium ${selectedFolders.size > 0
                        ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;