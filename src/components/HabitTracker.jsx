import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function getISOWeek(date) {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const diff = target - firstThursday;
  return 1 + Math.round(diff / (7 * 24 * 3600 * 1000));
}

function getWeekKey(date = new Date()) {
  const year = date.getFullYear();
  const week = getISOWeek(date);
  return `${year}-W${week}`;
}

const defaultHabits = [
  'Hydrate',
  'Walk 20m',
  'Journal',
  'Meditate',
  'Sleep 7h',
];

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const HabitTracker = () => {
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('habits:list');
    return saved ? JSON.parse(saved) : defaultHabits;
  });
  const weekKey = useMemo(() => getWeekKey(), []);
  const [checks, setChecks] = useState(() => {
    const saved = localStorage.getItem(`habits:checks:${weekKey}`);
    return saved ? JSON.parse(saved) : Array.from({ length: habits.length }, () => Array(7).fill(false));
  });

  useEffect(() => {
    localStorage.setItem('habits:list', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem(`habits:checks:${weekKey}`, JSON.stringify(checks));
  }, [checks, weekKey]);

  useEffect(() => {
    // Adjust checks matrix if habits count changes
    setChecks((prev) => {
      const rows = habits.length;
      const next = Array.from({ length: rows }, (_, r) => prev[r] ? [...prev[r]] : Array(7).fill(false));
      return next.map((row) => row.slice(0, 7));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habits.length]);

  const toggle = (r, c) => {
    setChecks((prev) => {
      const next = prev.map((row) => row.slice());
      next[r][c] = !next[r][c];
      return next;
    });
  };

  const updateHabit = (i, value) => {
    setHabits((prev) => {
      const next = [...prev];
      next[i] = value;
      return next;
    });
  };

  const addHabit = () => setHabits((prev) => [...prev, 'New habit']);
  const removeHabit = (i) => setHabits((prev) => prev.filter((_, idx) => idx !== i));

  const resetWeek = () => {
    const empty = Array.from({ length: habits.length }, () => Array(7).fill(false));
    setChecks(empty);
  };

  return (
    <section className="bg-white/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-md border border-[#EED4DB]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-[#2D4839]">Weekly Habits</h2>
          <p className="text-xs text-[#426E55]">Week {weekKey}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={addHabit} className="px-3 py-2 rounded-lg bg-[#EED4DB] text-[#2D4839] hover:bg-[#D698AB] transition-all duration-300 shadow-sm">Add</button>
          <button onClick={resetWeek} className="px-3 py-2 rounded-lg bg-[#73986F] text-white hover:bg-[#426E55] transition-all duration-300 shadow-sm">Reset Week</button>
        </div>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="text-left p-2 text-[#426E55]">Habit</th>
              {days.map((d) => (
                <th key={d} className="p-2 text-[#426E55] font-medium">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {habits.map((h, r) => (
              <tr key={r} className="border-t border-[#EED4DB]">
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <input
                      value={h}
                      onChange={(e) => updateHabit(r, e.target.value)}
                      className="w-full bg-white/60 border border-[#EED4DB] rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#CB748E]/40"
                    />
                    <button onClick={() => removeHabit(r)} className="text-[#CB748E] hover:text-[#D698AB]">✕</button>
                  </div>
                </td>
                {days.map((_, c) => {
                  const checked = checks[r]?.[c] || false;
                  return (
                    <td key={c} className="p-1 sm:p-2">
                      <button
                        onClick={() => toggle(r, c)}
                        className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-md border transition-all duration-300 ${checked ? 'bg-[#73986F] text-white border-[#426E55] shadow' : 'bg-white text-[#2D4839] border-[#EED4DB] hover:bg-[#EED4DB]/50'}`}
                      >
                        <AnimatePresence initial={false}>
                          <motion.span
                            key={checked ? 'yes' : 'no'}
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.6, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {checked ? '✅' : '❌'}
                          </motion.span>
                        </AnimatePresence>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default HabitTracker;
