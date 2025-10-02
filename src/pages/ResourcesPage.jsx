import React, { useEffect, useMemo, useState } from 'react';
import { mockResources } from '../data/mockData.js';
import { supabase } from '../supabaseClient.js';
import { useAuth } from '../context/AuthContext.jsx';

function ResourcesPage() {
  const [resources, setResources] = useState(mockResources);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('');
  const { user } = useAuth();

  const grouped = useMemo(() => {
    return resources.reduce((acc, r) => {
      acc[r.category] = acc[r.category] || [];
      acc[r.category].push(r);
      return acc;
    }, {});
  }, [resources]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim() || !url.trim() || !category.trim()) return;
    const nextId = resources.length ? Math.max(...resources.map((r) => r.id)) + 1 : 1;
    setResources((prev) => [...prev, { id: nextId, title: title.trim(), url: url.trim(), category: category.trim() }]);
    setTitle('');
    setUrl('');
    setCategory('');
    try {
      if (user?.id) {
        await supabase.from('resources').insert({ user_id: user.id, title: title.trim(), url: url.trim(), category: category.trim() });
      }
    } catch { }
  };

  const handleDelete = async (id) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
    try {
      await supabase.from('resources').delete().eq('id', id);
    } catch { }
  };

  useEffect(() => {
    const fetchResources = async () => {
      if (!user?.id) return;
      try {
        const { data } = await supabase
          .from('resources')
          .select('*')
          .eq('user_id', user.id);
        if (data) setResources(data);
      } catch { }
    };
    fetchResources();
  }, [user?.id]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Resources</h2>
      <form onSubmit={handleAdd} className="card grid md:grid-cols-[1fr_1fr_1fr_auto] gap-3">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
        />
        <input
          type="url"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
        />
        <button type="submit" className="btn-primary">Add Resource</button>
      </form>

      <div className="grid gap-6">
        {Object.keys(grouped).map((cat) => (
          <div key={cat}>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">{cat}</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {grouped[cat].map((res) => (
                <div key={res.id} className="card flex flex-col gap-2">
                  <a href={res.url} target="_blank" rel="noreferrer" className="font-medium hover:underline">
                    {res.title}
                  </a>
                  <div className="text-xs text-gray-500">{res.category}</div>
                  <button
                    onClick={() => handleDelete(res.id)}
                    className="mt-2 text-xs self-start px-3 py-1 rounded-full border hover:bg-black/5 transition"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResourcesPage;


