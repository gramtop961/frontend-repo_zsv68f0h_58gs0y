import React from 'react';
import { motion } from 'framer-motion';
import HeroCover from './components/HeroCover';
import HabitTracker from './components/HabitTracker';
import WidgetsGrid from './components/WidgetsGrid';
import ProfilePanel from './components/ProfilePanel';

function App() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#EED4DB] via-white to-[#73986F]/30 text-slate-800 selection:bg-[#CB748E]/20">
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="pb-12"
      >
        <HeroCover />
        <div className="-mt-8 md:-mt-12" />
        <HabitTracker />
        <WidgetsGrid />
        <ProfilePanel />
      </motion.main>
    </div>
  );
}

export default App;
