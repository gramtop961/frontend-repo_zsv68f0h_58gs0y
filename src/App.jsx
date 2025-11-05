import React from 'react';
import HeroCover from './components/HeroCover.jsx';
import HabitTracker from './components/HabitTracker.jsx';
import WidgetsGrid from './components/WidgetsGrid.jsx';
import ProfilePanel from './components/ProfilePanel.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-[#EED4DB]" style={{
      backgroundImage: `radial-gradient(800px 400px at 80% 10%, rgba(203,116,142,0.25), rgba(238,212,219,0)),\
        linear-gradient(#EED4DB, #EED4DB),\
        repeating-linear-gradient(0deg, rgba(43,43,43,0.08) 0px, rgba(43,43,43,0.08) 1px, transparent 1px, transparent 24px),\
        repeating-linear-gradient(90deg, rgba(43,43,43,0.08) 0px, rgba(43,43,43,0.08) 1px, transparent 1px, transparent 24px)`,
      backgroundSize: 'auto, auto, 24px 24px, 24px 24px'
    }}>
      <HeroCover />

      <main className="max-w-6xl mx-auto px-4">
        <WidgetsGrid />
        <HabitTracker />
        <ProfilePanel />
      </main>
    </div>
  );
}
