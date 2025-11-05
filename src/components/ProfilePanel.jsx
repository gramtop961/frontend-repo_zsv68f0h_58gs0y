import React from 'react';
import { User, Instagram, Spotify } from 'lucide-react';

const ProfilePanel = () => {
  return (
    <footer className="mx-auto mt-10 w-full max-w-6xl px-4 md:px-6">
      <div className="rounded-2xl bg-white/70 backdrop-blur-md shadow-lg ring-1 ring-[#EED4DB] p-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#EED4DB] p-3 text-[#2D4839]"><User size={20} /></div>
            <div>
              <p className="text-[#2D4839] font-semibold">Your Profile</p>
              <p className="text-[#426E55]/80 text-sm">“Be gentle with yourself. You’re doing great.”</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-xl bg-[#CB748E]/90 text-white px-4 py-2 shadow hover:shadow-lg hover:scale-[1.03] transition-all"
            >
              <Instagram size={16} /> Add Instagram
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-xl bg-[#426E55] text-white px-4 py-2 shadow hover:shadow-lg hover:scale-[1.03] transition-all"
            >
              <Spotify size={16} /> Add Spotify
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ProfilePanel;
