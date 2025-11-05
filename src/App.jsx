import React from 'react';
import { motion } from 'framer-motion';
import HeroCover from './components/HeroCover';
import HabitTracker from './components/HabitTracker';
import WidgetsGrid from './components/WidgetsGrid';
import ProfilePanel from './components/ProfilePanel';

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EED4DB] via-white to-[#73986F]/20 text-[#2D4839]">
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
