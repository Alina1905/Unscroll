// Storage keys
const LS_PREFS = 'us_prefs_v2';
const LS_SEEN = 'us_seen_cards';
const LS_STREAK = 'us_streak_data';
const LS_DAY_SEED = 'us_day_seed';
const LS_INTENTIONS = 'us_intentions';
const LS_STATS = 'us_stats_v2';

// Save user preferences
export const savePrefs = (theme, interests) => {
  localStorage.setItem(LS_PREFS, JSON.stringify({
    theme,
    interests: [...interests],
    savedAt: Date.now(),
  }));
};

// Load user preferences
export const loadPrefs = () => {
  try {
    const raw = localStorage.getItem(LS_PREFS);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (!saved || !Array.isArray(saved.interests)) return null;
    return saved;
  } catch (e) {
    return null;
  }
};

// Clear all preferences
export const clearPrefs = () => {
  [LS_PREFS, LS_SEEN, LS_STREAK, LS_DAY_SEED, LS_INTENTIONS, LS_STATS].forEach(key => localStorage.removeItem(key));
};

// Seen cards management
export const getSeenCards = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(LS_SEEN) || '[]'));
  } catch (e) {
    return new Set();
  }
};

export const markSeen = (cardKey) => {
  const seen = getSeenCards();
  seen.add(cardKey);
  const arr = [...seen].slice(-150);
  localStorage.setItem(LS_SEEN, JSON.stringify(arr));
};

// Daily seed for shuffling
export const getDailySeed = () => {
  const today = new Date().toDateString();
  const saved = JSON.parse(localStorage.getItem(LS_DAY_SEED) || '{}');
  if (saved.date === today) return saved.seed;
  const seed = Math.floor(Math.random() * 1000000);
  localStorage.setItem(LS_DAY_SEED, JSON.stringify({ date: today, seed }));
  return seed;
};

// Streak management
export const getStreak = () => {
  const today = new Date().toDateString();
  const saved = JSON.parse(localStorage.getItem(LS_STREAK) || '{"streak":1,"lastDate":""}');
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (saved.lastDate === today) return saved.streak;
  if (saved.lastDate === yesterday.toDateString()) {
    const ns = saved.streak + 1;
    localStorage.setItem(LS_STREAK, JSON.stringify({ streak: ns, lastDate: today }));
    return ns;
  }
  localStorage.setItem(LS_STREAK, JSON.stringify({ streak: 1, lastDate: today }));
  return 1;
};

// Stats management
export const loadStats = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_STATS) || '{"focusMins":0,"cardsOpened":0,"intentionLog":[]}');
  } catch (e) {
    return { focusMins: 0, cardsOpened: 0, intentionLog: [] };
  }
};

export const saveStats = (stats) => {
  localStorage.setItem(LS_STATS, JSON.stringify(stats));
};

export const addFocusMinutes = (mins) => {
  const stats = loadStats();
  stats.focusMins = (stats.focusMins || 0) + mins;
  saveStats(stats);
};

// Intention logging
export const logIntention = (reason, title, url) => {
  const log = JSON.parse(localStorage.getItem(LS_INTENTIONS) || '[]');
  log.push({ reason, title, url, time: new Date().toISOString() });
  localStorage.setItem(LS_INTENTIONS, JSON.stringify(log.slice(-100)));
};

// Profile code generation/restoration
export const generateProfileCode = (theme, interests) => {
  const data = { t: theme, i: [...interests] };
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(data))))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  } catch (e) {
    return '';
  }
};

export const applyProfileCode = (code) => {
  try {
    const padded = code.replace(/-/g, '+').replace(/_/g, '/');
    const padding = (4 - padded.length % 4) % 4;
    const base64 = padded + '='.repeat(padding);
    const data = JSON.parse(decodeURIComponent(escape(atob(base64))));
    if (!data || !Array.isArray(data.i)) throw new Error('bad');
    return { theme: data.t || '', interests: new Set(data.i) };
  } catch (e) {
    return null;
  }
};

// Seeded shuffle
export const seededShuffle = (arr, seed) => {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};