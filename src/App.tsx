import React, { useState } from 'react';
import { Code, Users, Settings, BookOpen, Trophy, AlertTriangle, CheckCircle, Play, Lightbulb } from 'lucide-react';
import AdminPanel from './components/AdminPanel';
import StudentPanel from './components/StudentPanel';
import Header from './components/Header';
import Navigation from './components/Navigation';

function App() {
  const [currentView, setCurrentView] = useState<'student' | 'admin'>('student');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {currentView === 'student' ? <StudentPanel /> : <AdminPanel />}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 GCI講座 Python学習支援システム</p>
        </div>
      </footer>
    </div>
  );
}

export default App;