import React, { useState } from 'react';
import { Users, BarChart3, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ProblemManagement from './ProblemManagement';
import Analytics from './Analytics';
import SecuritySettings from './SecuritySettings';

const AdminPanel: React.FC = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'problems' | 'analytics' | 'security'>('problems');

  // 管理者権限チェック
  if (profile?.role !== 'admin') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
          <Shield className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">アクセス権限がありません</h2>
        <p className="text-gray-600">
          管理者パネルにアクセスするには管理者権限が必要です。
        </p>
      </div>
    );
  }

  const tabs = [
    { id: 'problems', label: '問題管理', icon: Users },
    { id: 'analytics', label: '分析・統計', icon: BarChart3 },
    { id: 'security', label: 'セキュリティ', icon: Shield }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
          <Users className="w-7 h-7 text-blue-600" />
          <span>管理者ダッシュボード</span>
        </h2>

        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="min-h-96">
          {activeTab === 'problems' && <ProblemManagement />}
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'security' && <SecuritySettings />}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;