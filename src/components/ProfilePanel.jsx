import React from 'react';
import { motion } from 'framer-motion';

const ProfilePanel = () => {
  return (
    <footer className="mt-8 bg-white/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-md border border-[#EED4DB]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[#2D4839]">Your Profile</h3>
          <p className="text-sm text-[#426E55]">Personalize with your socials</p>
        </div>
        <div className="flex gap-2">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="px-4 py-2 rounded-lg bg-[#EED4DB] text-[#2D4839] hover:bg-[#D698AB] transition-all duration-300 shadow-sm">Add Instagram</motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="px-4 py-2 rounded-lg bg-[#73986F] text-white hover:bg-[#426E55] transition-all duration-300 shadow-sm">Add Spotify</motion.button>
        </div>
      </div>
    </footer>
  );
};

export default ProfilePanel;
