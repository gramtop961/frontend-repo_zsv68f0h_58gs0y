import React from 'react';
import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';

const HeroCover = () => {
  return (
    <section className="relative w-full h-[420px] sm:h-[480px] lg:h-[560px] overflow-hidden rounded-2xl shadow-xl">
      <Spline scene="https://prod.spline.design/kqB-rdL4TCJ7pyGb/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      {/* Gradient veil overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#EED4DB]/70 via-transparent to-[#73986F]/40" />

      {/* Headline */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#2D4839] drop-shadow-[0_2px_6px_rgba(255,255,255,0.6)]"
        >
          Your Gentle Self‑Care Space
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          className="mt-3 text-sm sm:text-base text-[#426E55]"
        >
          Track habits, note your mood, and enjoy small, kind moments.
        </motion.p>
      </div>

      {/* Floating accents */}
      <motion.div
        className="absolute left-6 top-6 w-3 h-3 rounded-full bg-[#CB748E]"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-8 bottom-10 w-2.5 h-2.5 rounded-full bg-[#73986F]"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </section>
  );
};

export default HeroCover;
