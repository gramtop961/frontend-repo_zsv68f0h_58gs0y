import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Helpers for ISO week handling
function isoWeek(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7; // 1-7, Monday=1
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return { year: d.getUTCFullYear(), week: weekNo };
}

function weekKey(year, week) { return `habits:checks:${year}-W${String(week).padStart(2,'0')}`; }
const HABITS_KEY = 'habits:list';

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export default function HabitTracker() {
  const { year: curYear, week: curWeek } = useMemo(() => isoWeek(new Date()), []);
  const [year, setYear] = useState(curYear);
  const [week, setWeek] = useState(curWeek);
  const [habits, setHabits] = useState([]);
  const [checks, setChecks] = useState({});
  const [newHabit, setNewHabit] = useState('');

  // Load habits list
  useEffect(() => {
    try {
      const raw = localStorage.getItem(HABITS_KEY);
      if (raw) setHabits(JSON.parse(raw));
    } catch {}
  }, []);

  // Save habits list
  useEffect(() => {
    try { localStorage.setItem(HABITS_KEY, JSON.stringify(habits)); } catch {}
  }, [habits]);

  // Load checks for current week
  useEffect(() => {
    try {
      const raw = localStorage.getItem(weekKey(year, week));
      setChecks(raw ? JSON.parse(raw) : {});
    } catch { setChecks({}); }
  }, [year, week]);

  // Save checks for current week
  useEffect(() => {
    try { localStorage.setItem(weekKey(year, week), JSON.stringify(checks)); } catch {}
  }, [year, week, checks]);

  const addHabit = () => {
    const name = newHabit.trim();
    if (!name) return;
    if (habits.includes(name)) return;
    setHabits([...habits, name]);
    setNewHabit('');
  };
  const removeHabit = (name) => {
    setHabits(habits.filter(h => h !== name));
    // also remove any checks for this habit in current week
    setChecks(prev => {
      const nxt = { ...prev };
      delete nxt[name];
      return nxt;
    });
  };

  const toggle = (habit, dayIdx) => {
    setChecks(prev => {
      const habitDays = prev[habit] || Array(7).fill(false);
      const updated = { ...prev, [habit]: habitDays.map((v,i)=> i===dayIdx ? !v : v) };
      return updated;
    });
  };

  const goWeek = (delta) => {
    // Build a date from ISO year/week (Mon)
    const simple = new Date(Date.UTC(year, 0, 4));
    const dow = simple.getUTCDay() || 7;
    const monday = new Date(simple);
    monday.setUTCDate(simple.getUTCDate() - dow + 1 + (week-1)*7);
    monday.setUTCDate(monday.getUTCDate() + delta*7);
    const { year: y, week: w } = isoWeek(monday);
    setYear(y); setWeek(w);
  };

  return (
    <section className="mt-8">
      <div className="bg-[#EED4DB] border-2 border-[#2b2b2b] shadow-[6px_6px_0_#2b2b2b] p-4 font-mono">
        {/* Header & Controls */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg text-[#1f1f1f] font-bold">Weekly Habit Tracker</h2>
            <p className="text-xs text-[#2b2b2b]">Data is saved on your device. Use the arrows to browse previous weeks.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => goWeek(-1)} className="px-3 py-1 bg-white border-2 border-[#2b2b2b] shadow-[3px_3px_0_#2b2b2b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">◀</button>
            <div className="px-3 py-1 bg-white border-2 border-[#2b2b2b] text-sm">{year}-W{String(week).padStart(2,'0')}</div>
            <button onClick={() => goWeek(1)} className="px-3 py-1 bg-white border-2 border-[#2b2b2b] shadow-[3px_3px_0_#2b2b2b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">▶</button>
          </div>
        </div>

        {/* Add Habit */}
        <div className="mt-4 flex gap-2">
          <input
            className="flex-1 px-3 py-2 border-2 border-[#2b2b2b] bg-white text-[#1f1f1f] shadow-[3px_3px_0_#2b2b2b]"
            placeholder="Add a habit (e.g., Stretch, Read)"
            value={newHabit}
            onChange={(e)=>setNewHabit(e.target.value)}
            onKeyDown={(e)=>{ if(e.key==='Enter') addHabit(); }}
          />
          <button onClick={addHabit} className="px-4 py-2 bg-[#73986F] text-white border-2 border-[#2b2b2b] shadow-[3px_3px_0_#2b2b2b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">Add</button>
        </div>

        {/* Table */}
        <div className="overflow-auto mt-4">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="bg-[#D698AB] text-[#1f1f1f] border-2 border-[#2b2b2b] px-3 py-2 text-left">Habit</th>
                {DAYS.map(d => (
                  <th key={d} className="bg-[#D698AB] text-[#1f1f1f] border-2 border-[#2b2b2b] px-3 py-2">{d}</th>
                ))}
                <th className="bg-[#D698AB] text-[#1f1f1f] border-2 border-[#2b2b2b] px-3 py-2">Remove</th>
              </tr>
            </thead>
            <tbody>
              {habits.length === 0 && (
                <tr>
                  <td colSpan={DAYS.length+2} className="text-center border-2 border-[#2b2b2b] bg-white text-[#1f1f1f] px-3 py-8">Add your first habit above</td>
                </tr>
              )}
              {habits.map(habit => (
                <tr key={habit}>
                  <td className="bg-white text-[#1f1f1f] border-2 border-[#2b2b2b] px-3 py-2 whitespace-nowrap">{habit}</td>
                  {Array.from({length:7}).map((_, idx) => {
                    const val = (checks[habit]||Array(7).fill(false))[idx];
                    return (
                      <td key={idx} className="bg-white border-2 border-[#2b2b2b] text-center">
                        <button
                          onClick={() => toggle(habit, idx)}
                          className="w-full h-full min-w-[48px] min-h-[44px]"
                        >
                          <AnimatePresence initial={false}>
                            {val ? (
                              <motion.span
                                key="yes"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                className="text-green-700"
                              >
                                ✅
                              </motion.span>
                            ) : (
                              <motion.span
                                key="no"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                className="text-rose-700"
                              >
                                ✖
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </button>
                      </td>
                    );
                  })}
                  <td className="bg-white border-2 border-[#2b2b2b] text-center">
                    <button onClick={() => removeHabit(habit)} className="px-3 py-1 bg-[#CB748E] text-white border-2 border-[#2b2b2b] shadow-[3px_3px_0_#2b2b2b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
