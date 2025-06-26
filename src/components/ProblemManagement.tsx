import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useProblems } from '../hooks/useProblems';
import { useAuth } from '../hooks/useAuth';
import type { Database } from '../lib/supabase';

type Problem = Database['public']['Tables']['problems']['Row'];
type ProblemInsert = Database['public']['Tables']['problems']['Insert'];

const ProblemManagement: React.FC = () => {
  const { problems, createProblem, updateProblem, deleteProblem } = useProblems();
  const { user } = useAuth();
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateNew = () => {
    const newProblem: any = {
      title: '',
      description: '',
      difficulty: 'beginner',
      example_input: '',
      example_output: '',
      test_cases: []
    };
    setEditingProblem(newProblem);
    setIsCreating(true);
  };

  const handleSave = async () => {
    if (!editingProblem || !user) return;

    if (isCreating) {
      const problemData: ProblemInsert = {
        ...editingProblem,
        created_by: user.id
      };
      await createProblem(problemData);
      setIsCreating(false);
    } else {
      await updateProblem(editingProblem.id, editingProblem);
    }
    setEditingProblem(null);
  };

  const handleCancel = () => {
    setEditingProblem(null);
    setIsCreating(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('この問題を削除しても良いですか？')) {
      await deleteProblem(id);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '初級';
      case 'intermediate':
        return '中級';
      case 'advanced':
        return '上級';
      default:
        return difficulty;
    }
  };

  if (editingProblem) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {isCreating ? '新しい問題を作成' : '問題を編集'}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>キャンセル</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>保存</span>
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">問題タイトル</label>
            <input
              type="text"
              value={editingProblem.title}
              onChange={(e) => setEditingProblem({...editingProblem, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="問題のタイトルを入力..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">問題説明</label>
            <textarea
              value={editingProblem.description}
              onChange={(e) => setEditingProblem({...editingProblem, description: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="問題の詳細な説明を入力..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">難易度</label>
            <select
              value={editingProblem.difficulty}
              onChange={(e) => setEditingProblem({...editingProblem, difficulty: e.target.value as any})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="beginner">初級</option>
              <option value="intermediate">中級</option>
              <option value="advanced">上級</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">入力例</label>
              <input
                type="text"
                value={editingProblem.example_input}
                onChange={(e) => setEditingProblem({
                  ...editingProblem, 
                  example_input: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="add(3, 5)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">出力例</label>
              <input
                type="text"
                value={editingProblem.example_output}
                onChange={(e) => setEditingProblem({
                  ...editingProblem, 
                  example_output: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="8"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">問題一覧</h3>
        <button
          onClick={handleCreateNew}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>新しい問題を作成</span>
        </button>
      </div>

      <div className="space-y-4">
        {problems.map((problem) => (
          <div key={problem.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-medium text-gray-900">{problem.title}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(problem.difficulty)}`}>
                    {getDifficultyLabel(problem.difficulty)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{problem.description}</p>
                <div className="text-xs text-gray-500">
                  入力例: {problem.example_input} → 出力例: {problem.example_output}
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => setEditingProblem(problem)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  title="編集"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(problem.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="削除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemManagement;