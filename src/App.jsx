import React from 'react';
import { motion } from 'framer-motion';
import HeroCover from './components/HeroCover';
import HabitTracker from './components/HabitTracker';
import WidgetsGrid from './components/WidgetsGrid';
import ProfilePanel from './components/ProfilePanel';

const App = () => {
  return (
    <div
      className="min-h-screen text-[#1f1f1f]"
      style={{
        backgroundImage: `
          linear-gradient(0deg, rgba(0,0,0,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px),
          radial-gradient(circle at 0 0, #EED4DB 0, #EED4DB 40%, #ffffff 100%)
        `,
        backgroundSize: '24px 24px, 24px 24px, 100% 100%',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="space-y-6 sm:space-y-8">
          <HeroCover />
          <WidgetsGrid />
          <HabitTracker />
          <ProfilePanel />
        </motion.div>
      </div>
    </div>
  );
};

export default App;
