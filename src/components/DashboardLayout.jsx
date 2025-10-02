import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Menu, X, GraduationCap, Map, BookText, LogOut, Briefcase, ListTodo } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (e) {
      console.error(e);
    }
  };

  const navLinkBase = 'flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition';
  const navLinkActive = 'bg-gray-100 font-medium';

  return (
    <div className="min-h-screen">
      <div className="section py-4 sticky top-0 z-30">
        <div className="bg-white/60 backdrop-blur-xl border border-black/5 shadow-sm rounded-full px-4 h-14 flex items-center justify-between">
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle sidebar">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link to="/" className="font-semibold text-[15px] tracking-tight">Dashboard</Link>
          <div className="w-5" />
        </div>
      </div>

      <div className="section grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 pb-10">
        {/* Sidebar */}
        <aside className={`${open ? 'block' : 'hidden'} md:block card p-3 h-max`}>
          <nav className="flex flex-col gap-1">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : ''}`}
              onClick={() => setOpen(false)}
            >
              <GraduationCap size={16} /> Dashboard Home
            </NavLink>
            <NavLink
              to="/dashboard/roadmap"
              className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : ''}`}
              onClick={() => setOpen(false)}
            >
              <Map size={16} /> Roadmap
            </NavLink>
            <NavLink
              to="/dashboard/resources"
              className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : ''}`}
              onClick={() => setOpen(false)}
            >
              <BookText size={16} /> Resources
            </NavLink>
            <NavLink
              to="/dashboard/professional-hub"
              className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : ''}`}
              onClick={() => setOpen(false)}
            >
              <Briefcase size={16} /> Professional Hub
            </NavLink>
            <NavLink
              to="/dashboard/learning-tracker"
              className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : ''}`}
              onClick={() => setOpen(false)}
            >
              <ListTodo size={16} /> Learning Tracker
            </NavLink>
            <button
              onClick={handleLogout}
              className="mt-2 flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 transition"
            >
              <LogOut size={16} /> Logout
            </button>
          </nav>
        </aside>

        {/* Main content */}
        <main className="min-h-[60vh]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;


