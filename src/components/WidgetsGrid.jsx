import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Card = ({ children, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="text-left bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-md border border-[#EED4DB] w-full"
  >
    {children}
  </motion.button>
);

const Modal = ({ open, onClose, title, children }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div onClick={onClose} className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="relative z-10 max-w-lg w-[92%] bg-[#FFF9F7] rounded-2xl p-6 shadow-xl border border-[#EED4DB]"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-[#2D4839]">{title}</h3>
            <button onClick={onClose} className="text-[#CB748E] hover:text-[#D698AB]">Close</button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Utilities
const todayKey = () => new Date().toISOString().slice(0, 10);

// Daily Quote (quotable)
const DailyQuote = () => {
  const key = useMemo(() => `quote:${todayKey()}`, []);
  const [data, setData] = useState(() => {
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : null;
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (data) return;
    fetch('https://api.quotable.io/random')
      .then((r) => r.json())
      .then((q) => {
        const payload = { content: q.content, author: q.author };
        setData(payload);
        localStorage.setItem(key, JSON.stringify(payload));
      })
      .catch(() => {});
  }, [data, key]);

  return (
    <>
      <Card onClick={() => setOpen(true)}>
        <p className="text-xs text-[#426E55] mb-1">Daily Quote</p>
        <p className="text-[#2D4839] line-clamp-2">{data ? `“${data.content}”` : 'Loading…'}</p>
        <p className="text-xs text-[#426E55] mt-1">{data?.author || ''}</p>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title="Daily Quote">
        {data ? (
          <div>
            <p className="text-[#2D4839] text-lg">“{data.content}”</p>
            <p className="text-sm text-[#426E55] mt-2">— {data.author}</p>
          </div>
        ) : (
          <p className="text-[#426E55]">Loading…</p>
        )}
      </Modal>
    </>
  );
};

// Weather (Open-Meteo)
const WeatherPeek = () => {
  const [open, setOpen] = useState(false);
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('Geolocation unavailable');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`)
          .then((r) => r.json())
          .then((data) => setWeather(data.current_weather))
          .catch(() => setStatus('Failed to load weather'));
      },
      () => setStatus('Location permission denied')
    );
  }, []);

  return (
    <>
      <Card onClick={() => setOpen(true)}>
        <p className="text-xs text-[#426E55] mb-1">Weather</p>
        {weather ? (
          <div className="text-[#2D4839]">
            <span className="text-xl font-semibold">{Math.round(weather.temperature)}°C</span>
            <span className="ml-2 text-sm">Wind {Math.round(weather.windspeed)} km/h</span>
          </div>
        ) : (
          <p className="text-[#426E55]">{status || 'Loading…'}</p>
        )}
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title="Weather details">
        {weather ? (
          <div className="text-[#2D4839] space-y-2">
            <p>Temperature: {weather.temperature} °C</p>
            <p>Wind: {weather.windspeed} km/h</p>
            <p>Direction: {weather.winddirection}°</p>
          </div>
        ) : (
          <p className="text-[#426E55]">{status || 'Loading…'}</p>
        )}
      </Modal>
    </>
  );
};

// Mood
const moodEmojis = ['😞', '😐', '🙂', '😊', '🤩'];
const MoodTracker = () => {
  const key = useMemo(() => `mood:${todayKey()}`, []);
  const [value, setValue] = useState(() => {
    const v = localStorage.getItem(key);
    return v ? Number(v) : 3;
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(key, String(value));
  }, [key, value]);

  return (
    <>
      <Card onClick={() => setOpen(true)}>
        <p className="text-xs text-[#426E55] mb-1">Mood</p>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{moodEmojis[value - 1]}</span>
          <span className="text-[#2D4839]">{value}/5</span>
        </div>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title="How are you feeling?">
        <div className="space-y-4">
          <div className="flex justify-between text-xl">
            {moodEmojis.map((m, i) => (
              <button
                key={i}
                onClick={() => setValue(i + 1)}
                className={`p-2 rounded-lg transition ${value === i + 1 ? 'bg-[#EED4DB]' : 'hover:bg-[#EED4DB]/50'}`}
              >
                {m}
              </button>
            ))}
          </div>
          <input
            type="range"
            min={1}
            max={5}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </Modal>
    </>
  );
};

// Kind Note
const notes = [
  'You’re doing better than you think.',
  'Small steps still move you forward.',
  'Breathe in calm, breathe out tension.',
  'Your kindness matters—especially to yourself.',
  'Rest is productive too.',
  'You are allowed to take up space.',
];
const KindNote = () => {
  const key = useMemo(() => `kindnote:${todayKey()}`, []);
  const [note, setNote] = useState(() => {
    const cached = localStorage.getItem(key);
    return cached || '';
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (note) return;
    const pick = notes[Math.floor(Math.random() * notes.length)];
    setNote(pick);
    localStorage.setItem(key, pick);
  }, [key, note]);

  return (
    <>
      <Card onClick={() => setOpen(true)}>
        <p className="text-xs text-[#426E55] mb-1">Kind Note</p>
        <p className="text-[#2D4839] line-clamp-2">{note || 'Loading…'}</p>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title="A kind note">
        <p className="text-[#2D4839] text-lg">{note}</p>
      </Modal>
    </>
  );
};

const WidgetsGrid = () => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <DailyQuote />
      <WeatherPeek />
      <MoodTracker />
      <KindNote />
    </section>
  );
};

export default WidgetsGrid;
