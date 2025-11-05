import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Modal({ open, onClose, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div
            className="absolute inset-0" 
            style={{
              background: `repeating-linear-gradient(45deg, rgba(0,0,0,0.4) 0px, rgba(0,0,0,0.4) 6px, rgba(0,0,0,0.2) 6px, rgba(0,0,0,0.2) 12px)`
            }}
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="relative z-10 max-w-lg w-[90%] bg-[#EED4DB] border-2 border-[#2b2b2b] shadow-[10px_10px_0_#2b2b2b] p-4 font-mono"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Card({ title, children, onOpen }) {
  return (
    <div className="bg-[#EED4DB] border-2 border-[#2b2b2b] shadow-[6px_6px_0_#2b2b2b] p-4 font-mono">
      <div className="flex items-center justify-between">
        <h3 className="text-[#1f1f1f] font-bold">{title}</h3>
        {onOpen && (
          <button onClick={onOpen} className="px-3 py-1 bg-white border-2 border-[#2b2b2b] shadow-[3px_3px_0_#2b2b2b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">Open</button>
        )}
      </div>
      <div className="mt-3 text-sm text-[#1f1f1f]">{children}</div>
    </div>
  );
}

// Utilities
const todayKey = () => new Date().toISOString().slice(0,10);

export default function WidgetsGrid() {
  // Daily Quote
  const [quote, setQuote] = useState(null);
  useEffect(() => {
    const key = `daily:quote:${todayKey()}`;
    const cached = localStorage.getItem(key);
    if (cached) { setQuote(JSON.parse(cached)); return; }
    fetch('https://api.quotable.io/random')
      .then(r=>r.json())
      .then(d => {
        const q = { content: d.content, author: d.author };
        setQuote(q);
        try { localStorage.setItem(key, JSON.stringify(q)); } catch {}
      })
      .catch(()=>{});
  }, []);

  // Weather Peek (Open-Meteo)
  const [weather, setWeather] = useState(null);
  useEffect(() => {
    const run = async () => {
      try {
        const key = `daily:weather:${todayKey()}`;
        const cached = localStorage.getItem(key);
        if (cached) { setWeather(JSON.parse(cached)); return; }
        const pos = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej));
        const lat = pos.coords.latitude.toFixed(4);
        const lon = pos.coords.longitude.toFixed(4);
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&hourly=temperature_2m`;
        const r = await fetch(url);
        const j = await r.json();
        const data = { temp: j?.current?.temperature_2m, humidity: j?.current?.relative_humidity_2m };
        setWeather(data);
        localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        // If blocked, keep null
      }
    };
    run();
  }, []);

  // Mood Tracker
  const moodKey = `daily:mood:${todayKey()}`;
  const [mood, setMood] = useState(() => {
    const raw = localStorage.getItem(moodKey);
    return raw ? Number(raw) : 3;
  });
  useEffect(() => { try { localStorage.setItem(moodKey, String(mood)); } catch {} }, [mood]);

  // Kind Note (local daily rotation)
  const notes = useMemo(() => [
    'You are doing better than you think.',
    'Small steps still move you forward.',
    'Be gentle with yourself today.',
    'Your pace is perfect for you.',
    'Drink water, stretch, breathe.',
  ], []);
  const [note, setNote] = useState('');
  useEffect(() => {
    const key = `daily:kindnote:${todayKey()}`;
    const cached = localStorage.getItem(key);
    if (cached) { setNote(cached); return; }
    const pick = notes[Math.floor(Math.random()*notes.length)];
    setNote(pick);
    try { localStorage.setItem(key, pick); } catch {}
  }, [notes]);

  const [openModal, setOpenModal] = useState(null); // 'quote' | 'weather' | 'mood' | 'note'

  const moodEmoji = ['😞','🙁','😐','🙂','😄'][mood-1] || '😐';

  return (
    <section className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <Card title="Daily Quote" onOpen={() => setOpenModal('quote')}>
        {quote ? (
          <>
            <div className="line-clamp-2">“{quote.content}”</div>
            <div className="mt-1 text-xs text-[#2b2b2b]">— {quote.author}</div>
          </>
        ) : (
          <div>Fetching inspiration…</div>
        )}
      </Card>

      <Card title="Weather Peek" onOpen={() => setOpenModal('weather')}>
        {weather ? (
          <div>Temp: <b>{weather.temp}°C</b> · Humidity: <b>{weather.humidity}%</b></div>
        ) : (
          <div>Enable location to see weather</div>
        )}
      </Card>

      <Card title="Mood Tracker" onOpen={() => setOpenModal('mood')}>
        <div className="flex items-center gap-3">
          <div className="text-2xl">{moodEmoji}</div>
          <input type="range" min="1" max="5" value={mood} onChange={(e)=>setMood(Number(e.target.value))} className="w-full" />
        </div>
      </Card>

      <Card title="Kind Note" onOpen={() => setOpenModal('note')}>
        <div className="line-clamp-2">{note}</div>
      </Card>

      {/* Modals */}
      <Modal open={openModal === 'quote'} onClose={()=>setOpenModal(null)}>
        <div className="flex items-start justify-between">
          <h4 className="font-bold">Today’s Quote</h4>
          <button onClick={()=>setOpenModal(null)} className="px-2 py-1 bg-white border-2 border-[#2b2b2b] shadow-[3px_3px_0_#2b2b2b]">Close</button>
        </div>
        <p className="mt-3">{quote ? `“${quote.content}” — ${quote.author}` : 'Loading…'}</p>
      </Modal>

      <Modal open={openModal === 'weather'} onClose={()=>setOpenModal(null)}>
        <div className="flex items-start justify-between">
          <h4 className="font-bold">Weather Peek</h4>
          <button onClick={()=>setOpenModal(null)} className="px-2 py-1 bg-white border-2 border-[#2b2b2b] shadow-[3px_3px_0_#2b2b2b]">Close</button>
        </div>
        {weather ? (
          <div className="mt-3">
            <div>Temperature: <b>{weather.temp}°C</b></div>
            <div>Humidity: <b>{weather.humidity}%</b></div>
            <p className="mt-2 text-xs text-[#2b2b2b]">Data cached for today</p>
          </div>
        ) : (
          <p className="mt-3">Allow location and refresh to fetch your local weather.</p>
        )}
      </Modal>

      <Modal open={openModal === 'mood'} onClose={()=>setOpenModal(null)}>
        <div className="flex items-start justify-between">
          <h4 className="font-bold">Mood Tracker</h4>
          <button onClick={()=>setOpenModal(null)} className="px-2 py-1 bg-white border-2 border-[#2b2b2b] shadow-[3px_3px_0_#2b2b2b]">Close</button>
        </div>
        <div className="mt-3">
          <div className="text-4xl mb-2 text-center">{moodEmoji}</div>
          <input type="range" min="1" max="5" value={mood} onChange={(e)=>setMood(Number(e.target.value))} className="w-full" />
          <p className="mt-2 text-xs text-[#2b2b2b]">Saved to your device for today</p>
        </div>
      </Modal>

      <Modal open={openModal === 'note'} onClose={()=>setOpenModal(null)}>
        <div className="flex items-start justify-between">
          <h4 className="font-bold">Kind Note</h4>
          <button onClick={()=>setOpenModal(null)} className="px-2 py-1 bg-white border-2 border-[#2b2b2b] shadow-[3px_3px_0_#2b2b2b]">Close</button>
        </div>
        <p className="mt-3">{note}</p>
        <p className="mt-2 text-xs text-[#2b2b2b]">Rotates daily and is cached locally</p>
      </Modal>
    </section>
  );
}
