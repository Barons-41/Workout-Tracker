"use client";

import { useState, useEffect } from "react";
import { MUSCLE_GROUPS, DEFAULT_RANGES } from "./constants";
import { getVolumeRanges, saveVolumeRanges } from "../lib/db";
import { Toast, s, C } from "./ui";

export default function VolumeTab({ history }) {
  const [ranges, setRanges] = useState(DEFAULT_RANGES);
  const [showEdit, setShowEdit] = useState(false);
  const [localRanges, setLocalRanges] = useState(DEFAULT_RANGES);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const saved = getVolumeRanges();
    if (saved) {
      setRanges({ ...DEFAULT_RANGES, ...saved });
      setLocalRanges({ ...DEFAULT_RANGES, ...saved });
    }
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2200); };

  const getWeekBounds = () => {
    const now = new Date(), day = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
    monday.setHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    return { monday, sunday };
  };

  const { monday, sunday } = getWeekBounds();
  const weekLabel = `${monday.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${sunday.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

  const vol = Object.fromEntries(MUSCLE_GROUPS.map((m) => [m, 0]));
  history.forEach((session) => {
    const d = session.dateISO ? new Date(session.dateISO + "T12:00:00") : new Date(session.id);
    if (d < monday || d > sunday) return;
    session.exercises.forEach((ex) => {
      const ms = (ex.muscles || "").toLowerCase();
      MUSCLE_GROUPS.forEach((m) => { if (ms.includes(m)) vol[m] += ex.sets.length; });
    });
  });

  const maxVal = Math.max(...MUSCLE_GROUPS.map((m) => vol[m]), 20, 1);

  const saveRanges = () => {
    saveVolumeRanges(localRanges);
    setRanges(localRanges);
    setShowEdit(false);
    showToast("Ranges saved!");
  };

  return (
    <div>
      <Toast msg={toast} />
      <div style={{ fontSize: 12, color: "#666", marginBottom: 14 }}>Week of {weekLabel}</div>
      <div style={{ display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
        {[["#1D9E75","on track"],["#BA7517","low"],["#E24B4A","too high"],["#888780","none"]].map(([c, l]) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#aaa" }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />{l}
          </div>
        ))}
      </div>
      {MUSCLE_GROUPS.map((m) => {
        const sets = vol[m], { min, max } = ranges[m];
        const color = sets === 0 ? "#888780" : sets < min ? "#BA7517" : sets > max ? "#E24B4A" : "#1D9E75";
        const pct = Math.min(sets / maxVal * 100, 100);
        const minPct = min / maxVal * 100, maxPct = Math.min(max / maxVal * 100, 100);
        return (
          <div key={m} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
              <span style={{ fontSize: 13, color: "#f0f0f0" }}>{m}</span>
              <span style={{ fontSize: 12, color: "#aaa" }}>{sets} sets <span style={{ color: "#666" }}>({min}–{max})</span></span>
            </div>
            <div style={{ height: 14, background: "#242424", borderRadius: 4, position: "relative" }}>
              <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${pct}%`, background: color, borderRadius: 4, minWidth: sets > 0 ? 2 : 0 }} />
              <div style={{ position: "absolute", top: -3, height: 20, left: `${minPct}%`, width: `${Math.max(maxPct - minPct, 0.5)}%`, background: "rgba(255,255,255,0.07)", borderLeft: `1.5px solid ${color === "#888780" ? "#555" : color}`, borderRight: `1.5px solid ${color === "#888780" ? "#555" : color}` }} />
            </div>
          </div>
        );
      })}
      <div style={{ marginTop: 20 }}>
        <button onClick={() => setShowEdit(!showEdit)} style={{ ...s.outlineBtn, width: "100%", padding: "10px 14px" }}>
          {showEdit ? "Hide" : "Edit"} optimal set ranges
        </button>
      </div>
      {showEdit && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>Sets per week — min and max</div>
          {MUSCLE_GROUPS.map((m) => (
            <div key={m} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, padding: "8px 10px", ...s.cardSm }}>
              <span style={{ flex: 1, fontSize: 13, color: "#f0f0f0" }}>{m}</span>
              <input type="number" inputMode="numeric" value={localRanges[m].min}
                onChange={(e) => setLocalRanges((p) => ({ ...p, [m]: { ...p[m], min: parseInt(e.target.value) || 0 } }))}
                style={{ width: 44, padding: "4px 6px", ...s.input }} />
              <span style={{ fontSize: 12, color: "#666" }}>–</span>
              <input type="number" inputMode="numeric" value={localRanges[m].max}
                onChange={(e) => setLocalRanges((p) => ({ ...p, [m]: { ...p[m], max: parseInt(e.target.value) || 0 } }))}
                style={{ width: 44, padding: "4px 6px", ...s.input }} />
            </div>
          ))}
          <button onClick={saveRanges} style={{ ...s.greenBtn, marginTop: 12 }}>Save ranges</button>
        </div>
      )}
    </div>
  );
}
