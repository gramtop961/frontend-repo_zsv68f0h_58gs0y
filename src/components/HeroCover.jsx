import React from 'react';
import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';

const HeroCover = () => {
  return (
    <section className="relative w-full h-[52vh] min-h-[360px] overflow-hidden">
      {/* Spline Background */}
      <div className="absolute inset-0" aria-hidden>
        <Spline
          scene="https://prod.spline.design/kqB-rdL4TCJ7pyGb/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
        {/* Soft gradient veil to blend Spline with the app palette */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#EED4DB]/60 via-transparent to-[#73986F]/40" />
      </div>

      {/* Floating leaves/sparkles background accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {[...Array(10)].map((_, i) => (
          <span
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white/50 backdrop-blur-sm"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `floatY ${8 + Math.random() * 6}s ease-in-out infinite`,
              boxShadow: '0 0 12px rgba(255,255,255,0.6)'
            }}
          />
        ))}
      </div>

      {/* Headline */}
      <div className="relative z-10 flex h-full items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#2D4839] drop-shadow-sm">
            Gentle Self-Care Dashboard
          </h1>
          <p className="mt-3 text-[#426E55] opacity-90">
            A cozy space to track habits, moods, and tiny wins — wrapped in calm pink and green.
          </p>
        </motion.div>
      </div>

      {/* Local keyframes for floating dots */}
      <style>{`
        @keyframes floatY {
          0% { transform: translateY(-8px); opacity: 0.8; }
          50% { transform: translateY(8px); opacity: 1; }
          100% { transform: translateY(-8px); opacity: 0.8; }
        }
      `}</style>
    </section>
  );
};

export default HeroCover;
