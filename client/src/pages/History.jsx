import { useEffect, useState } from 'react';
import { getHistory, deleteSummary } from '../services/api';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    try {
      // getHistory() already returns array of summaries directly
      const data = await getHistory();
      setHistory(data);
    } catch (err) {
      setError('Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this summary?')) return;

    try {
      await deleteSummary(id);
      setHistory(history.filter((item) => item._id !== id));
    } catch (err) {
      alert('Failed to delete summary');
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading history...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Saved Summaries History
      </h1>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4">{error}</div>
      )}

      {history.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No saved summaries found. Generate one on the Home tab!
        </div>
      ) : (
        <div className="space-y-6">
          {history.map((item) => (
            <div
              key={item._id}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs text-gray-400">
                  {new Date(item.createdAt).toLocaleString()}
                </span>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Delete
                </button>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Original Content
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 bg-gray-50 p-3 rounded">
                  {item.originalText || item.text}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Summary
                </h3>
                <p className="text-gray-800 leading-relaxed">
                  {item.summaryText || item.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}