import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="w-full sticky top-0 z-30">
      <div className="section py-4">
        <div className="bg-white/60 backdrop-blur-xl border border-black/5 shadow-sm rounded-full px-4 h-14 flex items-center justify-between">
          <Link to="/" className="font-semibold text-[15px] tracking-tight">
            AI Learning
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn-secondary h-9 px-4">Login</Link>
            <Link to="/signup" className="btn-primary h-9 px-4">Signup</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;


