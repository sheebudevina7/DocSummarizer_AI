import { useState } from 'react';
import { summarizeText, summarizeFile } from '../services/api';

export default function Home() {
  const [activeTab, setActiveTab] = useState('text'); // 'text' or 'file'
  const [inputText, setInputText] = useState('');
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setLoading(true);
    setError('');
    setSummary(null);

    try {
      const result = await summarizeText(inputText);
      setSummary(result);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to summarize text.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError('');
    setSummary(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const result = await summarizeFile(formData);
      setSummary(result);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to process document file.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const textToCopy = summary?.summaryText || summary?.summary;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      alert('Summary copied to clipboard!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        AI Document & Text Summarizer
      </h1>

      {/* Mode Navigation Tabs */}
      <div className="flex justify-center border-b border-gray-200 mb-6">
        <button
          onClick={() => { setActiveTab('text'); setError(''); }}
          className={`py-3 px-6 font-semibold border-b-2 transition ${
            activeTab === 'text'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Paste Text
        </button>
        <button
          onClick={() => { setActiveTab('file'); setError(''); }}
          className={`py-3 px-6 font-semibold border-b-2 transition ${
            activeTab === 'file'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Upload Document (.txt, .pdf)
        </button>
      </div>

      {/* Text Input Form */}
      {activeTab === 'text' && (
        <form onSubmit={handleTextSubmit} className="space-y-4">
          <div>
            <textarea
              rows="8"
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Paste your text content here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Generating Summary...' : 'Summarize Text'}
          </button>
        </form>
      )}

      {/* File Upload Form */}
      {activeTab === 'file' && (
        <form onSubmit={handleFileSubmit} className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg text-center hover:border-blue-500 transition">
            <input
              type="file"
              accept=".txt,.pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="mt-2 text-xs text-gray-500">Supported file formats: TXT, PDF (up to 10MB)</p>
          </div>
          <button
            type="submit"
            disabled={loading || !file}
            className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Reading & Summarizing File...' : 'Summarize Document'}
          </button>
        </form>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Render Summary Display */}
      {summary && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Generated Summary</h2>
            <button
              onClick={copyToClipboard}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition"
            >
              Copy
            </button>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {summary.summaryText || summary.summary}
          </p>
        </div>
      )}
    </div>
  );
}