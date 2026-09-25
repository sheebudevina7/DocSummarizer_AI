import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, History, Sparkles } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold text-indigo-400">
        <Sparkles className="w-6 h-6 text-indigo-400" />
        <span>DocuSummarize AI</span>
      </Link>
      <div className="flex gap-4">
        <Link
          to="/"
          className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition ${
            location.pathname === '/' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          Summarize
        </Link>
        <Link
          to="/history"
          className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition ${
            location.pathname === '/history' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          History
        </Link>
      </div>
    </nav>
  );
}