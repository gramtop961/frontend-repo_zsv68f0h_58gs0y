import React from 'react';
import { motion } from 'framer-motion';

const ProfilePanel = () => {
  return (
    <footer
      className="mt-8 bg-[#FFF9F7] p-4 sm:p-5 border-2 border-[#2b2b2b] font-mono"
      style={{ boxShadow: '6px 6px 0 #2b2b2b' }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base text-[#1f1f1f]">User Profile</h3>
          <p className="text-[12px] text-[#2b2b2b]">Plug in your retro socials</p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
            className="px-4 py-2 bg-[#EED4DB] border-2 border-[#2b2b2b] hover:bg-[#D698AB]"
            style={{ boxShadow: '3px 3px 0 #2b2b2b' }}
          >
            Add Instagram
          </motion.button>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
            className="px-4 py-2 bg-[#73986F] text-white border-2 border-[#2b2b2b] hover:bg-[#426E55]"
            style={{ boxShadow: '3px 3px 0 #2b2b2b' }}
          >
            Add Spotify
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default ProfilePanel;
