import React from 'react';
import { FolderOpen, Settings, ArrowRight, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  onOpenSettings: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onOpenSettings }) => {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="max-w-md w-full">
        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-2xl p-10 text-center">
          {/* Icon Container */}
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto flex items-center justify-center shadow-lg">
              <FolderOpen className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
              <Sparkles className="w-5 h-5 text-yellow-900" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Welcome to Bookmarks
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            Let's get started by selecting the bookmark folders you want to organize. 
            Your selected folders will appear as beautiful columns here.
          </p>

          {/* Steps */}
          <div className="bg-gray-50 rounded-lg p-5 mb-8 text-left">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                  1
                </div>
                <p className="text-sm text-gray-700">Click the Settings button to configure</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                  2
                </div>
                <p className="text-sm text-gray-700">Select your favorite bookmark folders</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                  3
                </div>
                <p className="text-sm text-gray-700">Save and start organizing your bookmarks</p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={onOpenSettings}
            className="group px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-semibold shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 mx-auto"
          >
            <Settings className="w-5 h-5" />
            <span>Open Settings</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Helper text */}
          <p className="text-xs text-gray-500 mt-6">
            You can always change your folder selection later
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;