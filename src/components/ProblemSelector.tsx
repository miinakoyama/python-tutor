import React, { useState } from 'react';
import { ChevronDown, BookOpen } from 'lucide-react';
import type { Database } from '../lib/supabase';

type Problem = Database['public']['Tables']['problems']['Row'];

interface ProblemSelectorProps {
  problems: Problem[];
  onProblemSelect: (problem: Problem | null) => void;
  selectedProblem: Problem | null;
}

const ProblemSelector: React.FC<ProblemSelectorProps> = ({ problems, onProblemSelect, selectedProblem }) => {
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        課題を選択してください
      </label>
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <div className="flex items-center space-x-3">
            <BookOpen className="w-5 h-5 text-gray-400" />
            <span className="text-gray-900">
              {selectedProblem ? selectedProblem.title : '課題を選択...'}
            </span>
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
            {problems.map((problem) => (
              <button
                key={problem.id}
                onClick={() => {
                  onProblemSelect(problem);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">{problem.title}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(problem.difficulty)}`}>
                    {getDifficultyLabel(problem.difficulty)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{problem.description}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemSelector;