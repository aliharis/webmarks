import React, { useState, useRef, useEffect } from 'react';
import { Plus, Bookmark, List, ChevronDown } from 'lucide-react';

interface AddDropdownProps {
  onAddBookmark: () => void;
  onAddList: () => void;
}

const AddDropdown: React.FC<AddDropdownProps> = ({
  onAddBookmark,
  onAddList,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddBookmark = () => {
    onAddBookmark();
    setIsOpen(false);
  };

  const handleAddList = () => {
    onAddList();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-3 py-2 bg-white bg-opacity-90 backdrop-blur-sm text-gray-800 rounded-lg hover:bg-opacity-100 transition-all shadow-lg hover:shadow-xl text-sm"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add
        <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-xl border border-white border-opacity-20 z-50">
          <div className="py-1">
            <button
              onClick={handleAddBookmark}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:bg-opacity-70 flex items-center transition-colors"
            >
              <Bookmark className="w-4 h-4 mr-3 text-gray-500" />
              Add Bookmark
            </button>
            <button
              onClick={handleAddList}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:bg-opacity-70 flex items-center transition-colors"
            >
              <List className="w-4 h-4 mr-3 text-gray-500" />
              Add List
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddDropdown;