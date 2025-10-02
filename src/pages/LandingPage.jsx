import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <header className="section pt-16 pb-12 text-center">
        <h1 className="text-[40px] md:text-[56px] leading-tight font-extrabold tracking-tight">
          Forging an AI Engineer
          <span className="block text-[22px] md:text-[28px] mt-2 font-medium text-gray-700">A Coded Journey</span>
        </h1>
        <p className="mt-5 text-gray-600 max-w-2xl mx-auto text-[15px]">
          Track your 18-month path to AI engineering with a clean, focused dashboard.
        </p>
        <div className="mt-7 flex items-center justify-center gap-3">
          <Link to="/signup" className="btn-primary">Get Started</Link>
          <Link to="/login" className="btn-secondary">Login</Link>
        </div>
      </header>

      <section className="section pb-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card hover:shadow-md transition">
            <div className="h-40 rounded-xl bg-gradient-to-b from-black/5 to-black/0 mb-4" />
            <h3 className="font-semibold text-[17px]">Project {i}</h3>
            <p className="text-[13px] text-gray-600 mt-1">
              Showcase your progress, milestones, and curated resources.
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default LandingPage;


