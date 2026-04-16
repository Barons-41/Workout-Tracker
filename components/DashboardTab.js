"use client";

import { useState } from "react";
import { HEATMAP_MUSCLES } from "./constants";
import { s, C, MONO } from "./ui";

// ── CompletionRing ─────────────────────────────────────────────────────────

function CompletionRing({ trained, total = 6 }) {
  const r = 30, cx = 40, cy = 40, stroke = 4;
  const circumference = 2 * Math.PI * r;
  const pct = Math.min(trained / total, 1);
  const dash = pct * circumference;
  return (
    <svg width="80" height="80" style={{ display: "block", flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.borderAlt} strokeWidth={stroke} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.gold} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circumference}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`} />
    </svg>
  );
}

// ── BodyHeatmapGrid ────────────────────────────────────────────────────────

const HEATMAP_LABELS = {
  chest: "Chest", back: "Back", shoulders: "Shoulders", biceps: "Biceps",
  triceps: "Triceps", quads: "Quads", hamstrings: "Hamstrings", glutes: "Glutes",
  calves: "Calves", abs: "Abs", core: "Core", rear_delts: "Rear delts",
};

function BodyHeatmapGrid({ vol, heatColor, heatmapOpen, setHeatmapOpen }) {
  return (
    <div style={{ ...s.card, overflow: "hidden", marginBottom: 4 }}>
      <button onClick={() => setHeatmapOpen((p) => !p)}
        style={{
          width: "100%",
          padding: "11px 14px",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.2em", fontFamily: MONO }}>MUSCLE.VOLUME</span>
        <span style={{ fontSize: 11, color: C.textMuted }}>{heatmapOpen ? "▲" : "▼"}</span>
      </button>
      {heatmapOpen && (
        <div style={{ padding: "0 14px 14px", borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginTop: 10 }}>
            {HEATMAP_MUSCLES.map((m) => {
              const sets = vol[m] || 0;
              const { bg, text } = sets > 0 ? heatColor(m) : { bg: C.surfaceAlt, text: C.textDim };
              return (
                <div key={m} style={{ background: bg, borderRadius: 8, padding: "7px 4px", textAlign: "center" }}>
                  <div style={{ fontSize: 9, fontWeight: 600, color: text, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: MONO, lineHeight: 1.3 }}>{HEATMAP_LABELS[m]}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: text, marginTop: 2, fontFamily: MONO }}>{sets}</div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 10, justifyContent: "center" }}>
            {[
              [C.surfaceAlt, C.textDim, "none"],
              ["#2a2210", "#9a7830", "low"],
              ["#2e2808", "#c8a857", "optimal"],
              ["#2e1a1a", "#e24b4a", "high"],
            ].map(([bg, fg, lbl]) => (
              <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: C.textMuted, fontFamily: MONO, letterSpacing: "0.08em" }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: bg, border: `1px solid ${fg}` }} />
                {lbl}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── DashboardTab ───────────────────────────────────────────────────────────

const PR_LIFTS = [
  { name: "Flat Bench Press", short: "Bench" },
  { name: "Barbell Back Squat", short: "Squat" },
  { name: "Smith RDL", short: "RDL" },
  { name: "Incline Smith Bench", short: "Inc. Smith" },
  { name: "DB Shoulder Press", short: "OHP" },
];

const VOL_RANGES = {
  chest: { min: 10, max: 20 }, back: { min: 10, max: 20 }, shoulders: { min: 10, max: 20 },
  biceps: { min: 10, max: 20 }, triceps: { min: 10, max: 20 }, quads: { min: 10, max: 20 },
  hamstrings: { min: 10, max: 20 }, glutes: { min: 10, max: 20 },
  calves: { min: 6, max: 12 }, abs: { min: 6, max: 12 }, core: { min: 6, max: 12 },
};

export default function DashboardTab({ history, split, setTab, setStartDay }) {
  const [heatmapOpen, setHeatmapOpen] = useState(false);
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  monday.setHours(0, 0, 0, 0);

  const thisWeek = history.filter((sess) => {
    const d = sess.dateISO ? new Date(sess.dateISO + "T12:00:00") : new Date(sess.id);
    return d >= monday;
  });

  const workDaysUnique = new Set(
    thisWeek
      .filter((s) => s.dayId !== "active_rest")
      .map((s) => (s.dateISO ? new Date(s.dateISO + "T12:00:00") : new Date(s.id)).toDateString())
  ).size;

  const trainedDates = new Set(
    history.map((s) => (s.dateISO ? new Date(s.dateISO + "T12:00:00") : new Date(s.id)).toDateString())
  );
  let streak = 0;
  const cursor = new Date(now);
  cursor.setHours(0, 0, 0, 0);
  if (!trainedDates.has(cursor.toDateString())) cursor.setDate(cursor.getDate() - 1);
  while (trainedDates.has(cursor.toDateString())) { streak++; cursor.setDate(cursor.getDate() - 1); }

  const last = history[0] || null;
  const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const todayDay = split.find((d) => d.day === dayNames[dayOfWeek]);
  const colorMap = Object.fromEntries(split.map((d) => [d.id, d.color]));

  // PR tracker
  const prs = {};
  PR_LIFTS.forEach((l) => { prs[l.name] = null; });
  history.forEach((session) => {
    session.exercises.forEach((ex) => {
      if (!Object.prototype.hasOwnProperty.call(prs, ex.name)) return;
      ex.sets.forEach((set) => {
        const w = parseFloat(set.weight) || 0;
        const r = parseInt(set.reps) || 0;
        if (w > 0 && (!prs[ex.name] || w > prs[ex.name].w || (w === prs[ex.name].w && r > prs[ex.name].r))) {
          prs[ex.name] = { w, r };
        }
      });
    });
  });
  const hasPRs = PR_LIFTS.some((l) => prs[l.name]);

  // Top PR for hero card
  const topPR = PR_LIFTS.find((l) => prs[l.name]) || null;

  // Weekly muscle heatmap
  const vol = Object.fromEntries(HEATMAP_MUSCLES.map((m) => [m, 0]));
  thisWeek.forEach((session) => {
    session.exercises.forEach((ex) => {
      const ms = (ex.muscles || "").toLowerCase();
      HEATMAP_MUSCLES.forEach((m) => {
        const msKey = m === "rear_delts" ? "rear delts" : m;
        if (ms.includes(msKey)) vol[m] += ex.sets.length;
      });
    });
  });

  const heatColor = (m) => {
    const sets = vol[m], { min, max } = VOL_RANGES[m] || { min: 8, max: 16 };
    if (sets === 0) return { bg: C.surfaceAlt, text: C.textDim };
    if (sets < min) return { bg: "#2a2210", text: "#9a7830" };
    if (sets > max) return { bg: "#2e1a1a", text: "#e24b4a" };
    return { bg: "#2e2808", text: "#c8a857" };
  };

  // Date formatted: WED · 04.16
  const weekdayShort = now.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const dateReadout = `${weekdayShort} · ${mm}.${dd}`;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.gold, letterSpacing: "0.35em", fontFamily: MONO }}>F · O · R · G · E</div>
        <div style={{ fontSize: 11, color: C.textMuted, fontFamily: MONO, letterSpacing: "0.12em" }}>{dateReadout}</div>
      </div>

      {/* Hero — completion ring + sessions readout */}
      <div style={{ ...s.card, padding: "20px 20px", marginBottom: 12, display: "flex", alignItems: "center", gap: 20 }}>
        <CompletionRing trained={workDaysUnique} total={6} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 38, fontWeight: 700, color: C.goldLight, lineHeight: 1, fontFamily: MONO, letterSpacing: "-0.02em" }}>
            {String(workDaysUnique).padStart(2, "0")}<span style={{ color: C.textDim, fontSize: 28 }}>/</span>{String(6).padStart(2, "0")}
          </div>
          <div style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.22em", marginTop: 7, fontFamily: MONO }}>SESSIONS</div>
          <div style={{ fontSize: 11, color: C.textDim, marginTop: 3, fontFamily: MONO, letterSpacing: "0.06em" }}>this week</div>
        </div>
      </div>

      {/* STREAK + TOP PR */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
        <div style={{ ...s.card, padding: "14px 16px" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: 8, fontFamily: MONO }}>STREAK</div>
          <div style={{ fontSize: 30, fontWeight: 700, color: C.goldLight, lineHeight: 1, fontFamily: MONO }}>{streak}</div>
          <div style={{ fontSize: 10, color: C.textSub, marginTop: 6, fontFamily: MONO, letterSpacing: "0.1em", textTransform: "uppercase" }}>{streak === 1 ? "DAY" : "DAYS"}</div>
        </div>
        {topPR ? (
          <div style={{ ...s.card, padding: "14px 16px" }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 8, fontFamily: MONO }}>PR.{topPR.short.toUpperCase()}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: C.goldLight, lineHeight: 1, fontFamily: MONO }}>{prs[topPR.name].w}</div>
            <div style={{ fontSize: 10, color: C.textSub, marginTop: 6, fontFamily: MONO, letterSpacing: "0.08em" }}>× {prs[topPR.name].r} REPS</div>
          </div>
        ) : (
          <div style={{ ...s.card, padding: "14px 16px" }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 8, fontFamily: MONO }}>TOP PR</div>
            <div style={{ fontSize: 13, color: C.textDim, fontFamily: MONO }}>NO DATA</div>
          </div>
        )}
      </div>

      {/* All-time PRs */}
      {hasPRs && (
        <div style={{ ...s.cardAlt, padding: "12px 14px", marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 10, fontFamily: MONO }}>ALL-TIME.RECORDS</div>
          {PR_LIFTS.map((l) => {
            const pr = prs[l.name];
            if (!pr) return null;
            return (
              <div key={l.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${C.divider}` }}>
                <span style={{ fontSize: 11, color: C.textSub, fontFamily: MONO, letterSpacing: "0.08em" }}>{l.short.toUpperCase()}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.gold, fontFamily: MONO }}>{pr.w} × {pr.r}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Last session */}
      {last && (
        <div style={{ ...s.card, padding: "12px 14px", marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 8, fontFamily: MONO }}>LAST.SESSION</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: colorMap[last.dayId] || C.text }}>{last.dayLabel}</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 3, fontFamily: MONO, letterSpacing: "0.05em" }}>{last.date}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, color: C.textSub, fontFamily: MONO }}>{last.exercises.length} EX</div>
              <div style={{ fontSize: 11, color: C.textDim, marginTop: 2, fontFamily: MONO }}>
                {(() => { let t = 0; last.exercises.forEach((e) => t += e.sets.length); return t; })()} SETS
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      {todayDay ? (
        <button onClick={() => { setStartDay(todayDay.id); setTab("log"); }}
          style={{ ...s.greenBtn, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 14 }}>
          ▸ BEGIN {todayDay.label.toUpperCase()}
        </button>
      ) : (
        <button onClick={() => setTab("log")} style={{ ...s.greenBtn, marginBottom: 14 }}>▸ LOG WORKOUT</button>
      )}

      <BodyHeatmapGrid vol={vol} heatColor={heatColor} heatmapOpen={heatmapOpen} setHeatmapOpen={setHeatmapOpen} />

      {history.length === 0 && (
        <div style={{ textAlign: "center", padding: "32px 0 16px" }}>
          <div style={{ fontSize: 14, color: C.textSub, marginBottom: 6 }}>No sessions yet</div>
          <div style={{ fontSize: 12, color: C.textMuted, fontFamily: MONO }}>LOG YOUR FIRST WORKOUT TO GET STARTED</div>
        </div>
      )}
    </div>
  );
}
