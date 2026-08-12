import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { todayKey, addDaysKey } from "./lib/dates";

const KEY = "xinghai-shiguang-v1";

function defaultState() {
  return {
    points: 0,
    coins: 0,
    streak: 0,
    lastLogin: null,
    loginRewards: {},
    logRewardDates: [],
    logs: [],
    inventory: [],
    reminder: { date: null, text: "" },
    memo: "",
    quoteIndex: 0,
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch {
    return defaultState();
  }
}

// 每日登录：连续第 n 天给 min(n,5) 积分，并给 1 金币
function applyLogin(state) {
  const t = todayKey();
  if (state.lastLogin === t) return { state, award: null };
  const streak = state.lastLogin === addDaysKey(t, -1) ? state.streak + 1 : 1;
  const points = Math.min(streak, 5);
  const award = { date: t, streak, points, coins: 1 };
  return {
    state: {
      ...state,
      points: state.points + points,
      coins: state.coins + 1,
      streak,
      lastLogin: t,
      loginRewards: { ...state.loginRewards, [t]: { points, coins: 1 } },
    },
    award,
  };
}

const StoreContext = createContext(null);
let pendingLoginAward = null;

export function StoreProvider({ children }) {
  const [state, setState] = useState(() => {
    const base = loadState();
    const res = applyLogin(base);
    pendingLoginAward = res.award;
    return res.state;
  });
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  useEffect(() => {
    if (pendingLoginAward) {
      const a = pendingLoginAward;
      pendingLoginAward = null;
      pushToast(`今日登录 · 连续第 ${a.streak} 天  +${a.points} 积分 · +1 金币`, "gold");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function pushToast(message, tone = "gold") {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4400);
  }

  function dismissToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  function saveLog({ id, date, title, content, tags, mood }) {
    const t = todayKey();
    let coins = state.coins;
    let logRewardDates = state.logRewardDates;
    const isNew = !id;
    const isToday = date === t;
    const earnedCoin = isNew && isToday && !logRewardDates.includes(t);

    if (earnedCoin) {
      coins += 1;
      logRewardDates = [...logRewardDates, t];
    }

    const now = new Date().toISOString();
    if (isNew) {
      const log = { id: String(Date.now()), date, title, content, tags, mood, createdAt: now, updatedAt: now };
      setState((s) => ({
        ...s,
        coins,
        logRewardDates,
        logs: [log, ...s.logs].sort((a, b) => (a.date < b.date ? 1 : -1)),
      }));
      if (earnedCoin) pushToast("完成今日记录 · 金币 +1", "teal");
      return { id: log.id, earnedCoin };
    }

    setState((s) => ({
      ...s,
      logs: s.logs.map((l) => (l.id === id ? { ...l, date, title, content, tags, mood, updatedAt: now } : l)),
    }));
    return { id, earnedCoin: false };
  }

  function deleteLog(id) {
    setState((s) => ({ ...s, logs: s.logs.filter((l) => l.id !== id) }));
  }

  function buyItem(id, price, name) {
    if (state.coins < price) {
      pushToast("金币不足，去写日志赚金币吧", "rose");
      return false;
    }
    setState((s) => ({
      ...s,
      coins: s.coins - price,
      inventory: [...s.inventory, id],
    }));
    pushToast(`已购入「${name}」· 金币 -${price}`, "gold");
    return true;
  }

  function setQuoteIndex(index) {
    setState((s) => ({ ...s, quoteIndex: index }));
  }

  function saveReminder(text) {
    setState((s) => ({ ...s, reminder: { date: todayKey(), text } }));
    pushToast("已为明天留好提醒", "teal");
  }

  function saveMemo(text) {
    setState((s) => ({ ...s, memo: text }));
    pushToast("备忘录已保存", "teal");
  }

  const today = todayKey();
  const todayInfo = useMemo(() => {
    const loginToday = state.loginRewards[today] || null;
    const logToday = state.logRewardDates.includes(today);
    return {
      loginPoints: loginToday ? loginToday.points : 0,
      todayCoins: (loginToday ? 1 : 0) + (logToday ? 1 : 0),
      logToday,
      canLogCoin: !logToday,
      canLoginCoin: !loginToday,
    };
  }, [state, today]);

  const value = useMemo(
    () => ({
      state,
      todayInfo,
      toasts,
      pushToast,
      dismissToast,
      saveLog,
      deleteLog,
      buyItem,
      setQuoteIndex,
      saveReminder,
      saveMemo,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, todayInfo, toasts]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

