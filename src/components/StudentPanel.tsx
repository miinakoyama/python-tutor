import React, { useState } from 'react';
import { Play, Lightbulb, AlertTriangle, CheckCircle, Trophy, BookOpen, LogIn } from 'lucide-react';
import CodeEditor from './CodeEditor';
import AdvicePanel from './AdvicePanel';
import ProblemSelector from './ProblemSelector';
import AuthModal from './AuthModal';
import { useAuth } from '../hooks/useAuth';
import { useProblems } from '../hooks/useProblems';
import { useSubmissions } from '../hooks/useSubmissions';

const StudentPanel: React.FC = () => {
  const { user, profile } = useAuth();
  const { problems } = useProblems();
  const { submitCode, loading: submissionLoading } = useSubmissions();
  
  const [selectedProblem, setSelectedProblem] = useState<any>(null);
  const [code, setCode] = useState('');
  const [advice, setAdvice] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSubmitCode = async () => {
    if (!selectedProblem || !code.trim() || !user) return;

    const result = await submitCode(code, selectedProblem.id, user.id);
    if (result) {
      setAdvice(result);
    }
  };

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
            <LogIn className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">ログインが必要です</h2>
          <p className="text-gray-600 mb-6">
            Python課題を提出してアドバイスを受けるには、ログインしてください。
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ログイン / アカウント作成
          </button>
        </div>
        
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <BookOpen className="w-7 h-7 text-blue-600" />
            <span>Python課題提出</span>
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span>学習進捗: 12/20問完了</span>
            </div>
            <div className="text-sm text-gray-600">
              ようこそ、{profile?.display_name || profile?.email}さん
            </div>
          </div>
        </div>

        <ProblemSelector 
          problems={problems}
          onProblemSelect={setSelectedProblem}
          selectedProblem={selectedProblem}
        />

        {selectedProblem && (
          <div className="mt-6 grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">問題: {selectedProblem.title}</h3>
                <p className="text-blue-800 mb-3">{selectedProblem.description}</p>
                <div className="text-sm text-blue-700">
                  <strong>入力例:</strong> {selectedProblem.example_input}<br />
                  <strong>出力例:</strong> {selectedProblem.example_output}
                </div>
              </div>

              <CodeEditor
                value={code}
                onChange={setCode}
                placeholder="ここにPythonコードを入力してください..."
              />

              <button
                onClick={handleSubmitCode}
                disabled={!selectedProblem || !code.trim() || submissionLoading}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {submissionLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>解析中...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>コードを提出してアドバイスを受ける</span>
                  </>
                )}
              </button>
            </div>

            <div>
              {advice && (
                <AdvicePanel advice={advice} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPanel;