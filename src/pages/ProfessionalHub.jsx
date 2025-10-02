import React, { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient.js';
import { useAuth } from '../context/AuthContext.jsx';

function ProfessionalHub() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    linkedin_url: '',
    twitter_url: '',
    medium_url: '',
    github_username: '',
    kaggle_url: '',
    leetcode_username: '',
    hackerrank_username: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [githubRepos, setGithubRepos] = useState([]);
  const [leetcodeStats, setLeetcodeStats] = useState(null);
  const [mediumArticles, setMediumArticles] = useState([]);
  const [loadingGithub, setLoadingGithub] = useState(false);
  const [loadingLeetcode, setLoadingLeetcode] = useState(false);
  const [loadingMedium, setLoadingMedium] = useState(false);
  const [errorGithub, setErrorGithub] = useState('');
  const [errorLeetcode, setErrorLeetcode] = useState('');
  const [errorMedium, setErrorMedium] = useState('');

  // Fetch profile links
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      try {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) {
          setProfile((p) => ({ ...p, ...data }));
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchProfile();
  }, [user?.id]);

  // GitHub repos
  useEffect(() => {
    const fetchRepos = async () => {
      if (!profile.github_username) return;
      setLoadingGithub(true);
      setErrorGithub('');
      try {
        const res = await fetch(`https://api.github.com/users/${profile.github_username}/repos?sort=updated&per_page=6`);
        if (!res.ok) throw new Error('Failed to fetch repos');
        const json = await res.json();
        setGithubRepos(json);
      } catch (e) {
        setErrorGithub(e.message || 'Failed to load GitHub repos');
      } finally {
        setLoadingGithub(false);
      }
    };
    fetchRepos();
  }, [profile.github_username]);

  // LeetCode stats
  useEffect(() => {
    const fetchLeetcode = async () => {
      if (!profile.leetcode_username) return;
      setLoadingLeetcode(true);
      setErrorLeetcode('');
      try {
        const query = {
          query: `query userProblemsSolved($username: String!) { matchedUser(username: $username) { submitStatsGlobal { acSubmissionNum { difficulty count } } profile { ranking } } }`,
          variables: { username: profile.leetcode_username },
        };
        const res = await fetch('https://leetcode.com/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(query),
        });
        if (!res.ok) throw new Error('Failed to fetch LeetCode stats');
        const json = await res.json();
        setLeetcodeStats(json.data?.matchedUser || null);
      } catch (e) {
        setErrorLeetcode(e.message || 'Failed to load LeetCode stats');
      } finally {
        setLoadingLeetcode(false);
      }
    };
    fetchLeetcode();
  }, [profile.leetcode_username]);

  // Medium articles via RSS2JSON
  useEffect(() => {
    const fetchArticles = async () => {
      if (!profile.medium_url) return;
      setLoadingMedium(true);
      setErrorMedium('');
      try {
        const username = extractMediumUsername(profile.medium_url);
        if (!username) throw new Error('Invalid Medium URL');
        const feedUrl = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${username}`;
        const res = await fetch(feedUrl);
        if (!res.ok) throw new Error('Failed to fetch Medium articles');
        const json = await res.json();
        setMediumArticles(json.items?.slice(0, 5) || []);
      } catch (e) {
        setErrorMedium(e.message || 'Failed to load Medium articles');
      } finally {
        setLoadingMedium(false);
      }
    };
    fetchArticles();
  }, [profile.medium_url]);

  // Load Twitter widget script dynamically
  useEffect(() => {
    if (!profile.twitter_url) return;
    const id = 'twitter-wjs';
    if (document.getElementById(id)) {
      // Trigger re-render of widgets
      window.twttr && window.twttr.widgets && window.twttr.widgets.load();
      return;
    }
    const script = document.createElement('script');
    script.id = id;
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      // keep script; Twitter manages itself
    };
  }, [profile.twitter_url]);

  const stripHtml = (html) => html.replace(/<[^>]+>/g, '');
  const extractFirstImage = (html) => {
    const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    return match ? match[1] : '';
  };
  const getReadingTime = (text) => {
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
  };

  const extractMediumUsername = (url) => {
    try {
      if (!url) return '';
      const u = new URL(url.startsWith('http') ? url : `https://${url}`);
      // Handles https://medium.com/@username and custom domains like https://username.medium.com
      if (u.hostname.endsWith('medium.com')) {
        const at = u.pathname.match(/@([^/]+)/);
        if (at) return at[1];
        const sub = u.hostname.split('.')[0];
        return sub !== 'medium' ? sub : '';
      }
      // Fallback: attempt to extract @username from path
      const at = url.match(/@([^/]+)/);
      return at ? at[1] : '';
    } catch {
      return '';
    }
  };

  const onSaveProfile = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('profiles').update(profile).eq('id', user.id);
      if (error) throw error;
      setIsEditing(false);
      alert('Profile links updated');
    } catch (e) {
      alert(e.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Professional Hub</h2>
        <button
          onClick={() => (isEditing ? onSaveProfile() : setIsEditing(true))}
          className="btn-primary h-9 px-4"
          disabled={saving}
        >
          {isEditing ? (saving ? 'Saving...' : 'Save') : 'Edit'}
        </button>
      </div>

      {/* Profile Links Form */}
      <div className="card grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { key: 'linkedin_url', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/...' },
          { key: 'twitter_url', label: 'Twitter URL', placeholder: 'https://x.com/...' },
          { key: 'medium_url', label: 'Medium URL', placeholder: 'https://medium.com/@username' },
          { key: 'github_username', label: 'GitHub Username', placeholder: 'octocat' },
          { key: 'kaggle_url', label: 'Kaggle URL', placeholder: 'https://kaggle.com/...' },
          { key: 'leetcode_username', label: 'LeetCode Username', placeholder: 'leetcode_handle' },
          { key: 'hackerrank_username', label: 'HackerRank Username', placeholder: 'hackerrank_handle' },
        ].map((f) => (
          <div key={f.key}>
            <label className="block text-sm font-medium">{f.label}</label>
            <input
              type="text"
              value={profile[f.key] || ''}
              onChange={(e) => setProfile({ ...profile, [f.key]: e.target.value })}
              disabled={!isEditing}
              placeholder={f.placeholder}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 disabled:bg-gray-50"
            />
          </div>
        ))}
      </div>

      {/* GitHub repos */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">GitHub Repositories</h3>
          {loadingGithub && <Loader2 className="animate-spin" size={16} />}
        </div>
        {errorGithub && <div className="text-sm text-red-600 mb-2">{errorGithub}</div>}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {githubRepos.map((r) => (
            <a key={r.id} href={r.html_url} target="_blank" rel="noreferrer" className="block card hover:shadow-md transition">
              <div className="font-medium flex items-center justify-between">
                <span>{r.name}</span>
                <ExternalLink size={14} />
              </div>
              <div className="text-sm text-gray-600 mt-1 line-clamp-2">{r.description || 'No description'}</div>
              <div className="text-xs text-gray-500 mt-2 flex items-center gap-3">
                <span>★ {r.stargazers_count}</span>
                <span>⑂ {r.forks_count}</span>
                {r.language && <span>{r.language}</span>}
              </div>
            </a>
          ))}
          {!loadingGithub && githubRepos.length === 0 && (
            <div className="text-sm text-gray-600">No repositories found.</div>
          )}
        </div>
      </div>

      {/* LeetCode stats */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">LeetCode Stats</h3>
          {loadingLeetcode && <Loader2 className="animate-spin" size={16} />}
        </div>
        {errorLeetcode && <div className="text-sm text-red-600 mb-2">{errorLeetcode}</div>}
        {leetcodeStats ? (
          <div className="grid grid-cols-3 gap-3">
            {leetcodeStats.submitStatsGlobal.acSubmissionNum.map((s) => (
              <div key={s.difficulty} className="rounded-xl p-4 text-white" style={{ backgroundImage: 'linear-gradient(180deg, #f59e0b, #f97316)' }}>
                <div className="text-sm opacity-90">{s.difficulty}</div>
                <div className="text-2xl font-bold">{s.count}</div>
              </div>
            ))}
            <div className="col-span-3 mt-2 text-sm text-gray-700">
              Global Ranking: <span className="font-medium">{leetcodeStats.profile?.ranking ?? 'N/A'}</span>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-600">Connect your LeetCode username to see stats.</div>
        )}
      </div>

      {/* Medium articles */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Medium Articles</h3>
          {loadingMedium && <Loader2 className="animate-spin" size={16} />}
        </div>
        {errorMedium && <div className="text-sm text-red-600 mb-2">{errorMedium}</div>}
        <div className="grid sm:grid-cols-2 gap-4">
          {mediumArticles.map((a) => {
            const img = extractFirstImage(a.content || '');
            const text = stripHtml(a.description || '');
            const preview = text.length > 150 ? `${text.slice(0, 150)}…` : text;
            const rt = getReadingTime(text);
            return (
              <a key={a.guid} href={a.link} target="_blank" rel="noreferrer" className="card hover:shadow-md transition">
                {img && <img src={img} alt="thumb" className="h-36 w-full object-cover rounded-lg" />}
                <div className="mt-3 font-medium flex items-center justify-between">
                  <span className="line-clamp-1">{a.title}</span>
                  <ExternalLink size={14} />
                </div>
                <div className="text-sm text-gray-600 mt-1">{preview}</div>
                <div className="text-xs text-gray-500 mt-2 flex items-center gap-3">
                  <span>{new Date(a.pubDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span>{rt} min read</span>
                </div>
              </a>
            );
          })}
          {!loadingMedium && mediumArticles.length === 0 && (
            <div className="text-sm text-gray-600">No articles found.</div>
          )}
        </div>
      </div>

      {/* Twitter embed */}
      {profile.twitter_url && (
        <div className="card">
          <h3 className="font-semibold mb-4">Twitter Feed</h3>
          <a
            className="twitter-timeline"
            data-height="400"
            href={profile.twitter_url}
          >Tweets by profile</a>
        </div>
      )}
    </div>
  );
}

export default ProfessionalHub;


