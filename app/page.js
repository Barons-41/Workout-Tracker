"use client";

import { useState, useEffect } from "react";
import {
  fetchHistory,
  insertSession,
  deleteSession,
  updateSession as dbUpdateSession,
  fetchSplit,
  saveSplit as dbSaveSplit,
} from "../lib/db";
import { DEFAULT_SPLIT, cloneDeep, migrateSplit } from "../components/constants";
import { TabBar, C, s } from "../components/ui";
import DashboardTab from "../components/DashboardTab";
import LogTab from "../components/LogTab";
import HistoryTab from "../components/HistoryTab";
import StatsTab from "../components/StatsTab";
import SettingsTab from "../components/SettingsTab";

export default function App() {
  const [tab, setTab] = useState("home");
  const [split, setSplit] = useState(cloneDeep(DEFAULT_SPLIT));
  const [history, setHistory] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [startDayId, setStartDayId] = useState(null);

  // ── Initial load ──────────────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([fetchSplit(), fetchHistory()]).then(([savedSplit, savedHistory]) => {
      if (savedSplit && savedSplit.length > 0) setSplit(migrateSplit(savedSplit));
      if (savedHistory) setHistory(savedHistory);
      setLoaded(true);
    });
  }, []);

  // ── Session operations ────────────────────────────────────────────────────

  const onAddSession = async (session) => {
    const saved = await insertSession(session);
    if (saved) setHistory((prev) => [saved, ...prev]);
  };

  const onDeleteSession = async (id) => {
    await deleteSession(id);
    setHistory((prev) => prev.filter((s) => s.id !== id));
  };

  const onUpdateSession = async (id, exercises, dateISO, dayLabel) => {
    const updated = await dbUpdateSession(id, { exercises, dateISO, dayLabel });
    if (updated) {
      setHistory((prev) => {
        const next = prev.map((s) => (s.id === id ? updated : s));
        return [...next].sort((a, b) => {
          const da = a.dateISO ? new Date(a.dateISO + "T12:00:00") : new Date(0);
          const db = b.dateISO ? new Date(b.dateISO + "T12:00:00") : new Date(0);
          return db - da;
        });
      });
    }
  };

  // ── Split operations ──────────────────────────────────────────────────────

  const onSaveSplit = async (next) => {
    await dbSaveSplit(next);
  };

  // ── Loading state ─────────────────────────────────────────────────────────

  if (!loaded) {
    return (
      <div style={{ ...s.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: C.textSub, fontSize: 14 }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ ...s.bg, minHeight: "100vh", color: C.text, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "16px 14px" }}>
        <TabBar active={tab} setTab={setTab} />
        {tab === "home" && (
          <DashboardTab
            history={history}
            split={split}
            setTab={setTab}
            setStartDay={setStartDayId}
          />
        )}
        {tab === "log" && (
          <LogTab
            split={split}
            history={history}
            onAddSession={onAddSession}
            startDayId={startDayId}
            onClearStart={() => setStartDayId(null)}
          />
        )}
        {tab === "history" && (
          <HistoryTab
            split={split}
            history={history}
            onDeleteSession={onDeleteSession}
            onUpdateSession={onUpdateSession}
          />
        )}
        {tab === "stats" && <StatsTab history={history} />}
        {tab === "settings" && (
          <SettingsTab
            split={split}
            setSplit={setSplit}
            onSaveSplit={onSaveSplit}
          />
        )}
      </div>
    </div>
  );
}
