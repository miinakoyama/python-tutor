import React from 'react';
import { Code } from 'lucide-react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, placeholder }) => {
  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
      <div className="bg-gray-800 text-gray-300 px-4 py-2 flex items-center space-x-2 text-sm">
        <Code className="w-4 h-4" />
        <span>Python</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-64 p-4 font-mono text-sm bg-white border-0 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{
          fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
          lineHeight: '1.5'
        }}
      />
    </div>
  );
};

export default CodeEditor;