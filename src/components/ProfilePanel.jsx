import React, { useEffect, useState } from 'react';

const IG_KEY = 'profile:instagram';
const SPOTIFY_KEY = 'profile:spotify';

export default function ProfilePanel() {
  const [ig, setIg] = useState('');
  const [sp, setSp] = useState('');

  useEffect(() => {
    try {
      setIg(localStorage.getItem(IG_KEY) || '');
      setSp(localStorage.getItem(SPOTIFY_KEY) || '');
    } catch {}
  }, []);

  const setInstagram = () => {
    const url = window.prompt('Enter your Instagram URL');
    if (url) {
      setIg(url);
      try { localStorage.setItem(IG_KEY, url); } catch {}
    }
  };
  const setSpotify = () => {
    const url = window.prompt('Enter your Spotify profile URL');
    if (url) {
      setSp(url);
      try { localStorage.setItem(SPOTIFY_KEY, url); } catch {}
    }
  };

  return (
    <footer className="mt-10 mb-8">
      <div className="bg-[#EED4DB] border-2 border-[#2b2b2b] shadow-[6px_6px_0_#2b2b2b] p-4 font-mono">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-[#1f1f1f] font-bold">Your Vintage Profile</div>
            <div className="text-xs text-[#2b2b2b]">Add links to personalize your station. Stored on this device.</div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={setInstagram} className="px-3 py-1 bg-white border-2 border-[#2b2b2b] shadow-[3px_3px_0_#2b2b2b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">{ig ? 'Update Instagram' : 'Add Instagram'}</button>
            <button onClick={setSpotify} className="px-3 py-1 bg-white border-2 border-[#2b2b2b] shadow-[3px_3px_0_#2b2b2b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">{sp ? 'Update Spotify' : 'Add Spotify'}</button>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-4 text-sm">
          {ig && (
            <a href={ig} target="_blank" rel="noreferrer" className="underline text-[#1f1f1f]">Instagram</a>
          )}
          {sp && (
            <a href={sp} target="_blank" rel="noreferrer" className="underline text-[#1f1f1f]">Spotify</a>
          )}
          {(!ig && !sp) && (
            <span className="text-[#2b2b2b]">No links yet</span>
          )}
        </div>
      </div>
    </footer>
  );
}
