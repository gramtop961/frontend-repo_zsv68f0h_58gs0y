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
    setChecks((prev) => {
      const rows = habits.length;
      const next = Array.from({ length: rows }, (_, r) => (prev[r] ? [...prev[r]] : Array(7).fill(false)));
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
    <section
      className="rounded-sm p-4 sm:p-5 bg-[#FFF9F7] border-2 border-[#2b2b2b]"
      style={{ boxShadow: '6px 6px 0 #2b2b2b' }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-mono text-base sm:text-lg text-[#1f1f1f]">Weekly Habits</h2>
          <p className="font-mono text-[11px] text-[#2b2b2b]">Week {weekKey}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={addHabit}
            className="font-mono px-3 py-2 bg-[#EED4DB] border-2 border-[#2b2b2b] hover:bg-[#D698AB] transition-colors"
            style={{ boxShadow: '3px 3px 0 #2b2b2b' }}
          >
            + Add
          </button>
          <button
            onClick={resetWeek}
            className="font-mono px-3 py-2 bg-[#73986F] text-white border-2 border-[#2b2b2b] hover:bg-[#426E55] transition-colors"
            style={{ boxShadow: '3px 3px 0 #2b2b2b' }}
          >
            Reset Week
          </button>
        </div>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full text-sm font-mono">
          <thead>
            <tr className="bg-[#EED4DB] border-2 border-[#2b2b2b]">
              <th className="text-left p-2 border-r-2 border-[#2b2b2b] text-[#1f1f1f]">Habit</th>
              {days.map((d) => (
                <th key={d} className="p-2 text-[#1f1f1f] border-r-2 last:border-r-0 border-[#2b2b2b]">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {habits.map((h, r) => (
              <tr key={r} className="border-b-2 border-[#2b2b2b]">
                <td className="p-2 border-r-2 border-[#2b2b2b]">
                  <div className="flex items-center gap-2">
                    <input
                      value={h}
                      onChange={(e) => updateHabit(r, e.target.value)}
                      className="w-full font-mono bg-white border-2 border-[#2b2b2b] px-2 py-1 focus:outline-none focus:ring-0"
                    />
                    <button
                      onClick={() => removeHabit(r)}
                      className="font-mono px-2 py-1 bg-[#CB748E] text-white border-2 border-[#2b2b2b] hover:bg-[#D698AB]"
                      style={{ boxShadow: '2px 2px 0 #2b2b2b' }}
                    >
                      X
                    </button>
                  </div>
                </td>
                {days.map((_, c) => {
                  const checked = checks[r]?.[c] || false;
                  return (
                    <td key={c} className="p-1 sm:p-2 border-r-2 last:border-r-0 border-[#2b2b2b]">
                      <button
                        onClick={() => toggle(r, c)}
                        className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center border-2 border-[#2b2b2b] ${checked ? 'bg-[#73986F] text-white' : 'bg-white hover:bg-[#EED4DB]'}`}
                        style={{ boxShadow: '2px 2px 0 #2b2b2b' }}
                      >
                        <AnimatePresence initial={false}>
                          <motion.span
                            key={checked ? 'yes' : 'no'}
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.6, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            {checked ? '✅' : '✖'}
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
