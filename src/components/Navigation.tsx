import React from 'react';
import { Users, Settings } from 'lucide-react';

interface NavigationProps {
  currentView: 'student' | 'admin';
  onViewChange: (view: 'student' | 'admin') => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex space-x-1">
          <button
            onClick={() => onViewChange('student')}
            className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors ${
              currentView === 'student'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">受講生モード</span>
          </button>
          <button
            onClick={() => onViewChange('admin')}
            className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors ${
              currentView === 'admin'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">管理者モード</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;