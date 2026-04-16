"use client";

import { useState, useEffect } from "react";
import { MUSCLE_GROUPS, DEFAULT_RANGES } from "./constants";
import { getVolumeRanges, saveVolumeRanges } from "../lib/db";
import { Toast, s, C, MONO } from "./ui";

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

  // Gold for on-track, amber for low, red for high, gray for none
  const getColor = (sets, min, max) => {
    if (sets === 0) return "#3a3a3a";
    if (sets < min) return "#a88430";
    if (sets > max) return "#e24b4a";
    return "#c8a857";
  };

  const saveRanges = () => {
    saveVolumeRanges(localRanges);
    setRanges(localRanges);
    setShowEdit(false);
    showToast("Ranges saved!");
  };

  return (
    <div>
      <Toast msg={toast} />

      {/* Week header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: C.textMuted, fontFamily: MONO, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Week of {weekLabel}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
        {[["#c8a857", "on track"], ["#a88430", "low"], ["#e24b4a", "too high"], ["#3a3a3a", "none"]].map(([c, l]) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: C.textMuted, fontFamily: MONO, letterSpacing: "0.08em" }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />{l}
          </div>
        ))}
      </div>

      {/* Volume bars */}
      {MUSCLE_GROUPS.map((m) => {
        const sets = vol[m], { min, max } = ranges[m];
        const color = getColor(sets, min, max);
        const pct = Math.min(sets / maxVal * 100, 100);
        const minPct = min / maxVal * 100;
        const maxPct = Math.min(max / maxVal * 100, 100);
        return (
          <div key={m} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: C.text, textTransform: "capitalize" }}>{m}</span>
              <span style={{ fontSize: 11, fontFamily: MONO, color: C.textSub }}>
                <span style={{ color }}>{sets}</span>
                <span style={{ color: C.textDim }}> ({min}–{max})</span>
              </span>
            </div>
            <div style={{ height: 12, background: C.surfaceAlt, borderRadius: 4, position: "relative", border: `1px solid ${C.borderAlt}` }}>
              <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${pct}%`, background: color, borderRadius: 4, minWidth: sets > 0 ? 2 : 0 }} />
              <div style={{
                position: "absolute", top: -2, height: "calc(100% + 4px)",
                left: `${minPct}%`,
                width: `${Math.max(maxPct - minPct, 0.5)}%`,
                background: "rgba(255,255,255,0.04)",
                borderLeft: `1.5px solid ${color === "#3a3a3a" ? "#444" : color + "88"}`,
                borderRight: `1.5px solid ${color === "#3a3a3a" ? "#444" : color + "88"}`,
              }} />
            </div>
          </div>
        );
      })}

      {/* Edit ranges toggle */}
      <div style={{ marginTop: 20 }}>
        <button onClick={() => setShowEdit(!showEdit)} style={{ ...s.outlineBtn, width: "100%", padding: "10px 14px", fontFamily: MONO, letterSpacing: "0.12em", fontSize: 10 }}>
          {showEdit ? "HIDE" : "EDIT"} OPTIMAL SET RANGES
        </button>
      </div>

      {showEdit && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 12, fontFamily: MONO, letterSpacing: "0.1em" }}>SETS PER WEEK — MIN AND MAX</div>
          {MUSCLE_GROUPS.map((m) => (
            <div key={m} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, padding: "8px 12px", ...s.cardSm }}>
              <span style={{ flex: 1, fontSize: 12, color: C.text, textTransform: "capitalize" }}>{m}</span>
              <input type="number" inputMode="numeric" value={localRanges[m].min}
                onChange={(e) => setLocalRanges((p) => ({ ...p, [m]: { ...p[m], min: parseInt(e.target.value) || 0 } }))}
                style={{ width: 44, padding: "4px 6px", ...s.input, textAlign: "center", fontFamily: MONO, fontSize: 13 }} />
              <span style={{ fontSize: 11, color: C.textDim, fontFamily: MONO }}>–</span>
              <input type="number" inputMode="numeric" value={localRanges[m].max}
                onChange={(e) => setLocalRanges((p) => ({ ...p, [m]: { ...p[m], max: parseInt(e.target.value) || 0 } }))}
                style={{ width: 44, padding: "4px 6px", ...s.input, textAlign: "center", fontFamily: MONO, fontSize: 13 }} />
            </div>
          ))}
          <button onClick={saveRanges} style={{ ...s.greenBtn, marginTop: 12 }}>▸ SAVE RANGES</button>
        </div>
      )}
    </div>
  );
}
