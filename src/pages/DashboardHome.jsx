import React, { useEffect, useMemo, useState } from 'react';
import TaskItem from '../components/TaskItem.jsx';
import { mockTasks, mockProfile } from '../data/mockData.js';
import { supabase } from '../supabaseClient.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Camera, ArrowUpRight } from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import googleCalendarPlugin from '@fullcalendar/google-calendar';

function DashboardHome() {
  const [tasks, setTasks] = useState(mockTasks);
  const [newTask, setNewTask] = useState('');
  const [newProjectLink, setNewProjectLink] = useState('');
  const [profile, setProfile] = useState({ full_name: '', bio: '', avatar_url: '' });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  const fallbackProfile = useMemo(() => mockProfile, []);

  const handleToggle = async (id) => {
    const t = tasks.find((x) => x.id === id);
    if (!t) return;
    setTasks((prev) => prev.map((x) => (x.id === id ? { ...x, completed: !x.completed } : x)));
    try {
      if (user?.id && typeof id === 'number') {
        await supabase.from('tasks').update({ is_complete: !t.completed }).eq('id', id);
      }
    } catch { }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const nextId = tasks.length ? Math.max(...tasks.map((t) => (typeof t.id === 'number' ? t.id : 0))) + 1 : 1;
    setTasks((prev) => [...prev, { id: nextId, description: newTask.trim(), project_link: newProjectLink || null, completed: false }]);
    setNewTask('');
    setNewProjectLink('');
    try {
      if (user?.id) {
        await supabase.from('tasks').insert({ user_id: user.id, description: newTask.trim(), project_link: newProjectLink || null, is_complete: false });
        // Optional: refetch for fresh IDs
        const { data } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (data) setTasks(data.map((d) => ({ id: d.id, description: d.description, project_link: d.project_link, completed: d.is_complete })));
      }
    } catch { }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      try {
        const { data } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (data) setTasks(data.map((d) => ({ id: d.id, description: d.description, project_link: d.project_link, completed: d.is_complete })));
      } catch { }
    };
    fetchData();
  }, [user?.id]);

  // Profile fetch
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      try {
        const { data } = await supabase
          .from('profiles')
          .select('full_name,bio,avatar_url')
          .eq('id', user.id)
          .single();
        if (data) setProfile({ full_name: data.full_name || '', bio: data.bio || '', avatar_url: data.avatar_url || '' });
      } catch { }
    };
    fetchProfile();
  }, [user?.id]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).slice(2)}.${ext}`;
      const filePath = `avatars/${fileName}`;
      const { error: upErr } = await supabase.storage.from('avatars').upload(filePath, file);
      if (upErr) throw upErr;
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const publicUrl = data?.publicUrl || '';
      setProfile((p) => ({ ...p, avatar_url: publicUrl }));
    } catch (err) {
      console.error(err);
      alert('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: profile.full_name, bio: profile.bio, avatar_url: profile.avatar_url })
        .eq('id', user.id);
      if (error) throw error;
      setIsEditingProfile(false);
      alert('Profile updated');
    } catch (e) {
      alert(e.message || 'Failed to update profile');
    }
  };

  return (
    <div className="grid gap-6">
      {/* Profile card */}
      <div className="card">
        <div className="flex items-start gap-4">
          <div className="relative">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="avatar" className="h-12 w-12 rounded-full border" />
            ) : (
              <div className="h-12 w-12 rounded-full bg-black/90" />
            )}
            {isEditingProfile && (
              <label className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-white border flex items-center justify-center cursor-pointer">
                <Camera size={14} />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
              </label>
            )}
          </div>
          <div className="flex-1">
            {isEditingProfile ? (
              <div className="grid gap-2">
                <input
                  value={profile.full_name}
                  onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))}
                  placeholder="Full name"
                  disabled={uploading}
                  className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                />
                <textarea
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                  placeholder="Short bio"
                  disabled={uploading}
                  className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold">{profile.full_name || fallbackProfile.name}</h3>
                <p className="text-sm text-gray-600">{profile.bio || fallbackProfile.bio}</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isEditingProfile ? (
              <button onClick={handleSaveProfile} className="btn-primary h-9 px-4" disabled={uploading}>Save</button>
            ) : (
              <button onClick={() => setIsEditingProfile(true)} className="btn-secondary h-9 px-4">Edit</button>
            )}
          </div>
        </div>
      </div>

      {/* Today's Focus */}
      <div className="card">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Today's Focus</h3>
          <button
            type="button"
            onClick={async () => {
              try {
                const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                const today = new Date();
                const todaysIncomplete = tasks.filter((t) => !t.completed && new Date(t.created_at || Date.now()).toDateString() === today.toDateString());
                // naive example: alert to confirm
                alert(`Ready to sync ${todaysIncomplete.length} tasks to your Google Calendar after you sign in.`);
              } catch (e) { console.error(e); }
            }}
            className="btn-secondary h-9 px-4"
          >
            Sync to Calendar
          </button>
        </div>
        <div className="mt-2 divide-y">
          {tasks.filter((t) => !t.completed).map((task) => (
            <div key={task.id} className="py-2">
              <TaskItem task={{ id: task.id, description: task.description, completed: task.completed }} onToggle={handleToggle} />
              {task.project_link && (
                <a href={task.project_link} target="_blank" rel="noreferrer" className="ml-7 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
                  <ArrowUpRight size={14} /> Project link
                </a>
              )}
            </div>
          ))}
        </div>
        <form onSubmit={handleAdd} className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="What do you want to learn today?"
            className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
          />
          <input
            type="url"
            value={newProjectLink}
            onChange={(e) => setNewProjectLink(e.target.value)}
            placeholder="Project link (optional)"
            className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
          />
          <button type="submit" className="btn-primary">Add Task</button>
        </form>
      </div>

      {/* My Schedule (Google Calendar / FullCalendar) */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">My Schedule 📅</h3>
        </div>
        <FullCalendar
          plugins={[dayGridPlugin, googleCalendarPlugin]}
          initialView="dayGridMonth"
          height="auto"
          googleCalendarApiKey={import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY}
          events={{ googleCalendarId: 'primary' }}
        />
      </div>
    </div>
  );
}

export default DashboardHome;


