import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw } from 'lucide-react';

const defaultHabits = [
  'Hydrate',
  'Stretch',
  'Journaling',
  'Fresh Air',
  'Sleep by 11',
];

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getWeekKey(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${weekNo}`;
}

const HabitTracker = () => {
  const [habits, setHabits] = useState(defaultHabits);
  const [checks, setChecks] = useState({});
  const weekKey = useMemo(() => getWeekKey(), []);

  // Modal state for editing habit name
  const [editingHabitIdx, setEditingHabitIdx] = useState(null);
  const [tempName, setTempName] = useState('');

  // Load from localStorage
  useEffect(() => {
    try {
      const savedHabits = JSON.parse(localStorage.getItem('habits:list'));
      if (savedHabits && Array.isArray(savedHabits) && savedHabits.length) {
        setHabits(savedHabits);
      }
    } catch {}
    try {
      const savedWeek = JSON.parse(localStorage.getItem(`habits:checks:${weekKey}`));
      if (savedWeek && typeof savedWeek === 'object') {
        setChecks(savedWeek);
      }
    } catch {}
  }, [weekKey]);

  // Persist
  useEffect(() => {
    localStorage.setItem('habits:list', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem(`habits:checks:${weekKey}`, JSON.stringify(checks));
  }, [checks, weekKey]);

  const toggleCell = (r, c) => {
    const key = `${r}-${c}`;
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resetWeek = () => {
    setChecks({});
  };

  const openEdit = (idx) => {
    setEditingHabitIdx(idx);
    setTempName(habits[idx] || '');
  };

  const saveEdit = () => {
    if (editingHabitIdx == null) return;
    const next = [...habits];
    next[editingHabitIdx] = tempName.trim() || next[editingHabitIdx];
    setHabits(next);
    setEditingHabitIdx(null);
  };

  const addHabitRow = () => {
    setHabits((h) => [...h, 'New Habit']);
  };

  return (
    <section className="relative mx-auto w-full max-w-6xl px-4 md:px-6">
      <div className="rounded-2xl bg-white/70 backdrop-blur-md shadow-lg ring-1 ring-[#EED4DB] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#EED4DB]/60 to-[#73986F]/40">
          <div>
            <h2 className="text-lg font-semibold text-[#2D4839]">Weekly Habit Tracker</h2>
            <p className="text-sm text-[#426E55]/80">{weekKey}</p>
          </div>
          <button
            onClick={resetWeek}
            className="inline-flex items-center gap-2 rounded-xl bg-[#73986F] px-4 py-2 text-white shadow hover:shadow-lg hover:scale-[1.03] transition-all duration-300"
          >
            <RefreshCcw size={16} /> Reset Week
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr>
                <th className="text-left p-4 text-[#2D4839] font-medium">Habit</th>
                {days.map((d) => (
                  <th key={d} className="p-3 text-sm text-[#2D4839]/80 font-medium">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {habits.map((h, r) => (
                <tr key={r} className="border-t border-[#EED4DB]">
                  <td className="p-3">
                    <button
                      onClick={() => openEdit(r)}
                      className="text-left w-full rounded-lg px-3 py-2 hover:bg-[#EED4DB]/50 transition-all duration-300 text-[#2D4839]"
                    >
                      {h}
                    </button>
                  </td>
                  {days.map((_, c) => {
                    const k = `${r}-${c}`;
                    const active = !!checks[k];
                    return (
                      <td key={c} className="p-2">
                        <motion.button
                          onClick={() => toggleCell(r, c)}
                          initial={false}
                          animate={{ backgroundColor: active ? '#73986F' : 'rgba(226, 232, 240, 0.6)', scale: active ? 1.02 : 1 }}
                          whileTap={{ scale: 0.92 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          className={`w-9 h-9 rounded-lg grid place-items-center mx-auto shadow-sm ${active ? 'text-white' : 'text-[#426E55]'} `}
                          aria-pressed={active}
                        >
                          <AnimatePresence mode="popLayout" initial={false}>
                            {active ? (
                              <motion.span
                                key="on"
                                initial={{ opacity: 0, scale: 0.6 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.6 }}
                              >
                                ✅
                              </motion.span>
                            ) : (
                              <motion.span
                                key="off"
                                initial={{ opacity: 0, scale: 0.6 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.6 }}
                              >
                                ❌
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4">
          <button
            onClick={addHabitRow}
            className="text-sm rounded-lg px-3 py-2 bg-[#EED4DB] text-[#2D4839] hover:shadow hover:scale-[1.03] transition-all"
          >
            + Add Habit
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingHabitIdx != null && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setEditingHabitIdx(null)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className="relative z-10 w-full max-w-md rounded-2xl bg-[#FFF8F9] shadow-xl p-6 border border-[#EED4DB]"
            >
              <h3 className="text-[#2D4839] font-semibold mb-3">Edit Habit</h3>
              <input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="w-full rounded-xl border border-[#EED4DB] bg-white/70 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#CB748E]"
                placeholder="Habit name"
              />
              <div className="mt-4 flex gap-3 justify-end">
                <button
                  onClick={() => setEditingHabitIdx(null)}
                  className="px-4 py-2 rounded-xl bg-[#EED4DB] text-[#2D4839] hover:shadow transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="px-4 py-2 rounded-xl bg-[#73986F] text-white shadow hover:shadow-lg hover:scale-[1.03] transition-all"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HabitTracker;
