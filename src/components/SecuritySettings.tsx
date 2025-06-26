import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Lock, Eye, EyeOff } from 'lucide-react';

const SecuritySettings: React.FC = () => {
  const [settings, setSettings] = useState({
    cheatDetection: true,
    codeExecution: true,
    rateLimiting: true,
    contentFiltering: true,
    logSubmissions: true
  });

  const [suspiciousPatterns, setSuspiciousPatterns] = useState([
    '答えを教えて',
    'give me the answer',
    'solution',
    '正解',
    'help me solve',
    'what is the answer'
  ]);

  const [newPattern, setNewPattern] = useState('');

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const addPattern = () => {
    if (newPattern.trim() && !suspiciousPatterns.includes(newPattern.trim())) {
      setSuspiciousPatterns([...suspiciousPatterns, newPattern.trim()]);
      setNewPattern('');
    }
  };

  const removePattern = (pattern: string) => {
    setSuspiciousPatterns(suspiciousPatterns.filter(p => p !== pattern));
  };

  const securityFeatures = [
    {
      key: 'cheatDetection' as const,
      title: 'チート行為検出',
      description: 'コード内の不適切な文言やパターンを自動検出',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      key: 'codeExecution' as const,
      title: '安全なコード実行',
      description: 'サンドボックス環境でのコード実行と検証',
      icon: Lock,
      color: 'green'
    },
    {
      key: 'rateLimiting' as const,
      title: 'レート制限',
      description: '短時間での大量提出を制限',
      icon: Shield,
      color: 'blue'
    },
    {
      key: 'contentFiltering' as const,
      title: 'コンテンツフィルタリング',
      description: '有害・不適切なコンテンツをフィルタリング',
      icon: Eye,
      color: 'purple'
    },
    {
      key: 'logSubmissions' as const,
      title: '提出ログ記録',
      description: 'すべての提出内容とアドバイスを記録',
      icon: CheckCircle,
      color: 'gray'
    }
  ];

  const getColorClasses = (color: string, enabled: boolean) => {
    if (!enabled) return 'bg-gray-50 text-gray-400 border-gray-200';
    
    switch (color) {
      case 'red':
        return 'bg-red-50 text-red-600 border-red-200';
      case 'green':
        return 'bg-green-50 text-green-600 border-green-200';
      case 'blue':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'purple':
        return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'gray':
        return 'bg-gray-50 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">セキュリティ設定</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {securityFeatures.map((feature) => {
          const Icon = feature.icon;
          const enabled = settings[feature.key];
          
          return (
            <div
              key={feature.key}
              className={`rounded-lg p-4 border transition-all cursor-pointer ${getColorClasses(feature.color, enabled)}`}
              onClick={() => toggleSetting(feature.key)}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-6 h-6" />
                <div className={`w-12 h-6 rounded-full relative transition-colors ${
                  enabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}></div>
                </div>
              </div>
              <h4 className="font-medium mb-1">{feature.title}</h4>
              <p className="text-xs opacity-80">{feature.description}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <span>チート検出パターン管理</span>
        </h4>
        
        <div className="mb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newPattern}
              onChange={(e) => setNewPattern(e.target.value)}
              placeholder="新しい検出パターンを追加..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && addPattern()}
            />
            <button
              onClick={addPattern}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              追加
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">現在の検出パターン:</p>
          <div className="flex flex-wrap gap-2">
            {suspiciousPatterns.map((pattern, index) => (
              <span
                key={index}
                className="inline-flex items-center space-x-1 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
              >
                <span>{pattern}</span>
                <button
                  onClick={() => removePattern(pattern)}
                  className="ml-1 hover:text-red-600 transition-colors"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
        <h4 className="font-semibold text-green-900 mb-4 flex items-center space-x-2">
          <Shield className="w-5 h-5" />
          <span>セキュリティステータス</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <p className="font-medium text-green-900 mb-2">検出した脅威</p>
            <p className="text-2xl font-bold text-green-600 mb-1">12</p>
            <p className="text-green-700">過去30日間</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <p className="font-medium text-green-900 mb-2">ブロックした提出</p>
            <p className="text-2xl font-bold text-green-600 mb-1">8</p>
            <p className="text-green-700">チート試行をブロック</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <p className="font-medium text-green-900 mb-2">システム健全性</p>
            <p className="text-2xl font-bold text-green-600 mb-1">98%</p>
            <p className="text-green-700">正常稼働率</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;