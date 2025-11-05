import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, CloudSun, Smile, Sparkles } from 'lucide-react';

const Card = ({ children, onClick }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    className="group relative w-full rounded-2xl bg-white/70 backdrop-blur-md p-4 shadow-lg ring-1 ring-[#EED4DB] text-left transition-all hover:shadow-xl"
  >
    <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-[#EED4DB]/0 via-transparent to-[#73986F]/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    {children}
  </motion.button>
);

const Modal = ({ open, onClose, title, children }) => (
  <AnimatePresence>
    {open && (
      <motion.div className="fixed inset-0 z-50 grid place-items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="relative z-10 w-full max-w-lg rounded-3xl bg-[#FFF8F9] p-6 shadow-2xl border border-[#EED4DB]"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-[#2D4839]">{title}</h4>
            <button onClick={onClose} className="text-[#426E55] hover:opacity-80 transition">✕</button>
          </div>
          <div className="mt-4">{children}</div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const DailyQuote = () => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const key = 'widgets:quote';
    const today = new Date().toDateString();
    const saved = JSON.parse(localStorage.getItem(key) || 'null');
    if (saved && saved.date === today) {
      setQuote(saved.quote);
      setAuthor(saved.author);
      return;
    }
    fetch('https://api.quotable.io/random')
      .then((r) => r.json())
      .then((d) => {
        const q = d.content || 'Breathe. Be here now.';
        const a = d.author || 'Unknown';
        setQuote(q);
        setAuthor(a);
        localStorage.setItem(key, JSON.stringify({ date: today, quote: q, author: a }));
      })
      .catch(() => {
        const q = 'Small steps grow into big changes.';
        const a = 'Kind Reminder';
        setQuote(q);
        setAuthor(a);
      });
  }, []);

  return (
    <>
      <Card onClick={() => setOpen(true)}>
        <div className="flex items-start gap-3">
          <div className="rounded-xl p-2 bg-[#EED4DB] text-[#2D4839]"><Quote size={18} /></div>
          <div>
            <p className="text-sm text-[#2D4839]">Daily Affirmation</p>
            <p className="mt-1 text-[#426E55] line-clamp-3">“{quote}”</p>
          </div>
        </div>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title="Daily Affirmation">
        <p className="text-[#2D4839] text-lg">“{quote}”</p>
        <p className="text-[#426E55] mt-2">— {author}</p>
      </Modal>
    </>
  );
};

const WeatherPeek = () => {
  const [temp, setTemp] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`)
          .then((r) => r.json())
          .then((d) => {
            setTemp(Math.round(d?.current_weather?.temperature));
          })
          .catch(() => {});
      },
      () => {}
    );
  }, []);

  return (
    <>
      <Card onClick={() => setOpen(true)}>
        <div className="flex items-start gap-3">
          <div className="rounded-xl p-2 bg-[#EED4DB] text-[#2D4839]"><CloudSun size={18} /></div>
          <div>
            <p className="text-sm text-[#2D4839]">Weather Peek</p>
            <p className="mt-1 text-[#426E55]">{temp == null ? 'Fetching...' : `${temp}°C`}</p>
          </div>
        </div>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title="Weather">
        <p className="text-[#2D4839]">Current temperature near you:</p>
        <p className="mt-2 text-2xl font-semibold text-[#426E55]">{temp == null ? 'Fetching…' : `${temp}°C`}</p>
        <p className="text-sm text-[#426E55] mt-3">Powered by Open‑Meteo</p>
      </Modal>
    </>
  );
};

const MoodTracker = () => {
  const [value, setValue] = useState(3);
  const [open, setOpen] = useState(false);
  const emojis = ['😞', '🙁', '😐', '🙂', '😄'];

  useEffect(() => {
    const saved = localStorage.getItem('widgets:mood');
    if (saved) setValue(parseInt(saved, 10));
  }, []);

  useEffect(() => {
    localStorage.setItem('widgets:mood', String(value));
  }, [value]);

  return (
    <>
      <Card onClick={() => setOpen(true)}>
        <div className="flex items-start gap-3">
          <div className="rounded-xl p-2 bg-[#EED4DB] text-[#2D4839]"><Smile size={18} /></div>
          <div>
            <p className="text-sm text-[#2D4839]">Mood Tracker</p>
            <p className="mt-1 text-[#426E55] text-2xl leading-none">{emojis[value - 1]}</p>
          </div>
        </div>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title="How are you feeling?">
        <div className="flex items-center justify-between text-2xl select-none">
          {emojis.map((e, i) => (
            <button
              key={e}
              onClick={() => setValue(i + 1)}
              className={`transition-transform ${i + 1 === value ? 'scale-110' : 'opacity-70 hover:opacity-100'}`}
            >
              {e}
            </button>
          ))}
        </div>
        <input
          type="range"
          min="1"
          max="5"
          value={value}
          onChange={(e) => setValue(parseInt(e.target.value, 10))}
          className="mt-5 w-full accent-[#73986F]"
        />
      </Modal>
    </>
  );
};

const KindNote = () => {
  const [line, setLine] = useState('');
  const [open, setOpen] = useState(false);
  const lines = useMemo(
    () => [
      'You’re growing at your own perfect pace.',
      'Drink water and unclench your jaw.',
      'Five deep breaths can reset a day.',
      'Progress, not perfection.',
      'A short walk counts as a win.',
    ],
    []
  );

  useEffect(() => {
    const key = 'widgets:note';
    const today = new Date().toDateString();
    const saved = JSON.parse(localStorage.getItem(key) || 'null');
    if (saved && saved.date === today) {
      setLine(saved.line);
      return;
    }
    const pick = lines[Math.floor(Math.random() * lines.length)];
    setLine(pick);
    localStorage.setItem(key, JSON.stringify({ date: today, line: pick }));
  }, [lines]);

  return (
    <>
      <Card onClick={() => setOpen(true)}>
        <div className="flex items-start gap-3">
          <div className="rounded-xl p-2 bg-[#EED4DB] text-[#2D4839]"><Sparkles size={18} /></div>
          <div>
            <p className="text-sm text-[#2D4839]">Kind Note</p>
            <p className="mt-1 text-[#426E55] line-clamp-3">{line}</p>
          </div>
        </div>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title="A gentle reminder">
        <p className="text-[#2D4839] text-lg">{line}</p>
      </Modal>
    </>
  );
};

const WidgetsGrid = () => {
  return (
    <section className="mx-auto mt-8 w-full max-w-6xl px-4 md:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DailyQuote />
        <WeatherPeek />
        <MoodTracker />
        <KindNote />
      </div>
    </section>
  );
};

export default WidgetsGrid;
