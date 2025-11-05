import React from 'react';
import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';

const HeroCover = () => {
  return (
    <section
      className="relative w-full h-[420px] sm:h-[480px] lg:h-[560px] overflow-hidden rounded-lg border-2 border-[#2b2b2b]"
      style={{ boxShadow: '6px 6px 0 #2b2b2b' }}
    >
      <Spline scene="https://prod.spline.design/Jd4wcqFfe70N-TXP/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      {/* Pixel gradient veil overlay */}
      <div className="pointer-events-none absolute inset-0" style={{
        backgroundImage:
          'repeating-linear-gradient(180deg, rgba(238,212,219,0.6) 0 2px, rgba(238,212,219,0.6) 2px 4px, rgba(115,152,111,0.25) 4px 6px, rgba(115,152,111,0.25) 6px 8px)'
      }} />

      {/* Window title bar */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-[#EED4DB] border-b-2 border-[#2b2b2b] flex items-center justify-between px-3">
        <span className="font-mono text-sm text-[#2b2b2b]">Retro Self‑Care Console</span>
        <div className="flex gap-1">
          <span className="w-3.5 h-3.5 bg-[#CB748E] border-2 border-[#2b2b2b]" />
          <span className="w-3.5 h-3.5 bg-[#D698AB] border-2 border-[#2b2b2b]" />
          <span className="w-3.5 h-3.5 bg-[#73986F] border-2 border-[#2b2b2b]" />
        </div>
      </div>

      {/* Headline */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="font-mono text-2xl sm:text-3xl lg:text-4xl text-[#1f1f1f]"
          style={{ textShadow: '0 0 0 #000' }}
        >
          Welcome to your Pixel Sanctuary
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          className="mt-2 font-mono text-xs sm:text-sm text-[#2b2b2b]"
        >
          Track habits, moods, and moments — retro style.
        </motion.p>
      </div>

      {/* Pixel accents */}
      <motion.div
        className="absolute left-4 top-12 w-3 h-3 bg-[#CB748E] border-2 border-[#2b2b2b]"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-6 bottom-12 w-3 h-3 bg-[#73986F] border-2 border-[#2b2b2b]"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </section>
  );
};

export default HeroCover;
