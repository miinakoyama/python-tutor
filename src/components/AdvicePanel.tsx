import React from 'react';
import { Lightbulb, AlertTriangle, CheckCircle, Heart, BookOpen } from 'lucide-react';

interface AdvicePanelProps {
  advice: {
    type: 'success' | 'warning' | 'error';
    message: string;
    hints: string[];
    encouragement: string;
    additionalPractice?: string[];
  };
}

const AdvicePanel: React.FC<AdvicePanelProps> = ({ advice }) => {
  const getIcon = () => {
    switch (advice.type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="w-6 h-6 text-red-600" />;
    }
  };

  const getBgColor = () => {
    switch (advice.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
    }
  };

  const getTextColor = () => {
    switch (advice.type) {
      case 'success':
        return 'text-green-800';
      case 'warning':
        return 'text-yellow-800';
      case 'error':
        return 'text-red-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className={`rounded-lg p-4 border ${getBgColor()}`}>
        <div className="flex items-start space-x-3">
          {getIcon()}
          <div className="flex-1">
            <h3 className={`font-semibold mb-2 ${getTextColor()}`}>
              アドバイス結果
            </h3>
            <p className={getTextColor()}>{advice.message}</p>
          </div>
        </div>
      </div>

      {advice.hints.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-2">改善のヒント</h4>
              <ul className="space-y-1">
                {advice.hints.map((hint, index) => (
                  <li key={index} className="text-blue-800 text-sm flex items-start space-x-2">
                    <span className="text-blue-600 font-medium">•</span>
                    <span>{hint}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {advice.additionalPractice && advice.additionalPractice.length > 0 && (
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-start space-x-3">
            <BookOpen className="w-5 h-5 text-purple-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-purple-900 mb-2">追加の練習</h4>
              <ul className="space-y-1">
                {advice.additionalPractice.map((practice, index) => (
                  <li key={index} className="text-purple-800 text-sm flex items-start space-x-2">
                    <span className="text-purple-600 font-medium">•</span>
                    <span>{practice}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 border border-pink-200">
        <div className="flex items-start space-x-3">
          <Heart className="w-5 h-5 text-pink-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-pink-900 mb-1">応援メッセージ</h4>
            <p className="text-pink-800 text-sm">{advice.encouragement}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvicePanel;