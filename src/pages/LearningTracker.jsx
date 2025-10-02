import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../supabaseClient.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Calendar, ExternalLink } from 'lucide-react';

function LearningTracker() {
  const { user } = useAuth();
  const [completedTasks, setCompletedTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      setLoading(true);
      setError('');
      try {
        const { data, error: err } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_complete', true)
          .order('created_at', { ascending: false });
        if (err) throw err;
        setCompletedTasks(data || []);
        setFilteredTasks(data || []);
      } catch (e) {
        setError(e.message || 'Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id]);

  useEffect(() => {
    let tasks = [...completedTasks];
    const term = searchTerm.trim().toLowerCase();
    if (term) tasks = tasks.filter((t) => (t.description || '').toLowerCase().includes(term));
    switch (sortBy) {
      case 'date_asc':
        tasks.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'name_asc':
        tasks.sort((a, b) => (a.description || '').localeCompare(b.description || ''));
        break;
      default:
        tasks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    setFilteredTasks(tasks);
  }, [searchTerm, sortBy, completedTasks]);

  const stats = useMemo(() => {
    const total = completedTasks.length;
    const now = new Date();
    const thisMonth = completedTasks.filter((t) => {
      const d = new Date(t.created_at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    const withProject = completedTasks.filter((t) => !!t.project_link).length;
    return { total, thisMonth, withProject };
  }, [completedTasks]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Learning Tracker</h2>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-xl p-5 text-white" style={{ backgroundImage: 'linear-gradient(180deg, #10b981, #059669)' }}>
          <div className="text-sm opacity-90">Total Completed</div>
          <div className="text-3xl font-bold">{stats.total}</div>
        </div>
        <div className="rounded-xl p-5 text-white" style={{ backgroundImage: 'linear-gradient(180deg, #3b82f6, #2563eb)' }}>
          <div className="text-sm opacity-90">Completed This Month</div>
          <div className="text-3xl font-bold">{stats.thisMonth}</div>
        </div>
        <div className="rounded-xl p-5 text-white" style={{ backgroundImage: 'linear-gradient(180deg, #8b5cf6, #7c3aed)' }}>
          <div className="text-sm opacity-90">With Project Links</div>
          <div className="text-3xl font-bold">{stats.withProject}</div>
        </div>
      </div>

      {/* Search / Sort */}
      <div className="card flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <input
          type="text"
          placeholder="Search completed tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
        />
        <select
          className="rounded-md border px-3 py-2 text-sm"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
          <option value="name_asc">Name A-Z</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-x-auto">
        {loading ? (
          <div className="text-sm text-gray-600">Loading...</div>
        ) : error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-sm text-gray-600">No completed tasks found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-700">
                <th className="text-left px-3 py-2 font-medium">Task / Topic</th>
                <th className="text-left px-3 py-2 font-medium">Date Completed</th>
                <th className="text-left px-3 py-2 font-medium">Project Link</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">{t.description}</td>
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(t.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    {t.project_link ? (
                      <a href={t.project_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                        <ExternalLink size={14} />
                        View Project
                      </a>
                    ) : (
                      <span className="text-gray-500">No project link</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default LearningTracker;


