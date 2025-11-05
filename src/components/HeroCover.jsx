import React from 'react';
import Spline from '@splinetool/react-spline';

export default function HeroCover() {
  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden rounded-none">
      {/* Spline scene */}
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/Jd4wcqFfe70N-TXP/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Veil gradient so Spline doesn't overpower UI. Ensure it doesn't block pointer. */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: 'radial-gradient(1200px 600px at 60% 40%, rgba(238,212,219,0.55), rgba(31,31,31,0.65))'
      }} />

      {/* Window title bar */}
      <div className="absolute top-6 left-6 right-6 select-none">
        <div className="bg-[#EED4DB]/90 text-[#1f1f1f] border-2 border-[#2b2b2b] shadow-[6px_6px_0_#2b2b2b] font-mono">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#CB748E] border-2 border-[#2b2b2b]" />
              <span className="w-3 h-3 bg-[#D698AB] border-2 border-[#2b2b2b]" />
              <span className="w-3 h-3 bg-[#73986F] border-2 border-[#2b2b2b]" />
            </div>
            <div className="text-sm tracking-tight font-bold">Self-Care Station // v0.1</div>
            <div className="text-xs">8-bit</div>
          </div>
        </div>
      </div>

      {/* Bottom tagline */}
      <div className="absolute bottom-6 left-6">
        <div className="bg-[#EED4DB] text-[#1f1f1f] border-2 border-[#2b2b2b] shadow-[6px_6px_0_#2b2b2b] px-4 py-2 font-mono text-sm">
          Daily calm in chunky pixels
        </div>
      </div>
    </section>
  );
}
