import React from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Clock, Target } from 'lucide-react';

const Analytics: React.FC = () => {
  const stats = [
    {
      label: '総提出数',
      value: '1,234',
      change: '+12%',
      icon: Target,
      color: 'blue'
    },
    {
      label: 'アクティブユーザー',
      value: '89',
      change: '+8%',
      icon: Users,
      color: 'green'
    },
    {
      label: '平均応答時間',
      value: '1.2秒',
      change: '-5%',
      icon: Clock,
      color: 'yellow'
    },
    {
      label: '推定月間コスト',
      value: '¥2,450',
      change: '+3%',
      icon: DollarSign,
      color: 'purple'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'green':
        return 'bg-green-50 text-green-600 border-green-200';
      case 'yellow':
        return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'purple':
        return 'bg-purple-50 text-purple-600 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">システム分析・統計</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`rounded-lg p-6 border ${getColorClasses(stat.color)}`}>
              <div className="flex items-center justify-between mb-4">
                <Icon className="w-8 h-8" />
                <span className={`text-sm font-medium ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm opacity-80">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span>問題別提出数</span>
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">基本的な関数作成</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">456</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">リストの最大値</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">342</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">繰り返し処理での合計</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '45%'}}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">267</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span>成功率分析</span>
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">初級問題</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
                <span className="text-sm font-medium text-green-600">85%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">中級問題</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{width: '65%'}}></div>
                </div>
                <span className="text-sm font-medium text-yellow-600">65%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">上級問題</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{width: '35%'}}></div>
                </div>
                <span className="text-sm font-medium text-red-600">35%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-4 flex items-center space-x-2">
          <DollarSign className="w-5 h-5" />
          <span>コスト分析とLLM使用料試算</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <p className="font-medium text-blue-900 mb-2">1回あたりのコスト</p>
            <p className="text-2xl font-bold text-blue-600 mb-1">¥2.5</p>
            <p className="text-blue-700">GPT-4使用時の推定値</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <p className="font-medium text-blue-900 mb-2">月間推定コスト</p>
            <p className="text-2xl font-bold text-blue-600 mb-1">¥2,450</p>
            <p className="text-blue-700">980回提出時の推定値</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <p className="font-medium text-blue-900 mb-2">最適化案</p>
            <p className="text-sm text-blue-800">
              • キャッシュ機能で30%削減<br />
              • GPT-3.5使用で60%削減<br />
              • バッチ処理で15%削減
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;