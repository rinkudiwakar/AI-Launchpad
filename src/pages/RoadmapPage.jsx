import React from 'react';
import { mockRoadmap } from '../data/mockData.js';

function RoadmapPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">18-Month Roadmap</h2>
      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-black/10" />
        <div className="space-y-6">
          {mockRoadmap.map((item) => (
            <div key={item.month} className="relative pl-12">
              <div className="absolute left-4 top-3 h-2.5 w-2.5 rounded-full bg-black" />
              <div className="card">
                <div className="text-sm text-gray-500">Month {item.month}</div>
                <div className="font-semibold">{item.title}</div>
                <div className="text-sm text-gray-600 mt-1">{item.skills}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RoadmapPage;


