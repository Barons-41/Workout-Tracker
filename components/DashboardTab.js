"use client";

import { useState } from "react";
import { HEATMAP_MUSCLES } from "./constants";
import { StatCard, s, C } from "./ui";

// ── CompletionRing ─────────────────────────────────────────────────────────

function CompletionRing({ trained, total = 6 }) {
  const r = 30, cx = 40, cy = 40, stroke = 5;
  const circumference = 2 * Math.PI * r;
  const pct = Math.min(trained / total, 1);
  const dash = pct * circumference;
  return (
    <svg width="80" height="80" style={{ display: "block" }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.border} strokeWidth={stroke} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.green} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circumference}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`} />
      <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
        style={{ fill: C.text, fontSize: 14, fontWeight: 700, fontFamily: "inherit" }}>
        {trained}/{total}
      </text>
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
        style={{ width: "100%", padding: "11px 14px", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.07em" }}>Weekly muscle volume</span>
        <span style={{ fontSize: 12, color: C.textMuted }}>{heatmapOpen ? "▲" : "▼"}</span>
      </button>
      {heatmapOpen && (
        <div style={{ padding: "0 14px 14px", borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginTop: 10 }}>
            {HEATMAP_MUSCLES.map((m) => {
              const sets = vol[m] || 0;
              const { bg, text } = sets > 0 ? heatColor(m) : { bg: C.surface, text: C.textMuted };
              return (
                <div key={m} style={{ background: bg, borderRadius: 8, padding: "7px 4px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: text, textTransform: "capitalize", lineHeight: 1.3 }}>{HEATMAP_LABELS[m]}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: text, marginTop: 2 }}>{sets}</div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 10, justifyContent: "center" }}>
            {[[C.surface, C.textMuted, "none"], ["#1a2e1a", "#5db85d", "low"], ["#0f3323", "#1D9E75", "optimal"], ["#2e1a1a", "#e24b4a", "high"]].map(([bg, fg, lbl]) => (
              <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: C.textMuted }}>
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
    if (sets === 0) return { bg: C.surface, text: C.textMuted };
    if (sets < min) return { bg: "#1a2e1a", text: "#5db85d" };
    if (sets > max) return { bg: "#2e1a1a", text: "#e24b4a" };
    return { bg: "#0f3323", text: "#1D9E75" };
  };

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.text, lineHeight: 1.1 }}>
          Good {now.getHours() < 12 ? "morning" : now.getHours() < 17 ? "afternoon" : "evening"}
        </div>
        <div style={{ fontSize: 14, color: C.textSub, marginTop: 4 }}>
          {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </div>
      </div>

      {hasPRs && (
        <div style={{ ...s.card, padding: "12px 14px", marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>All-time PRs</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px" }}>
            {PR_LIFTS.map((l) => {
              const pr = prs[l.name];
              if (!pr) return null;
              return (
                <div key={l.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "3px 0", borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 12, color: C.textSub }}>{l.short}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{pr.w} × {pr.r}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <div style={{ ...s.card, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
          <CompletionRing trained={workDaysUnique} total={6} />
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.07em" }}>This week</div>
            <div style={{ fontSize: 12, color: C.textSub, marginTop: 4 }}>work sessions</div>
          </div>
        </div>
        <StatCard label="Streak" value={streak} sub={streak === 1 ? "day" : "days"} accent={streak >= 5 ? "#BA7517" : C.text} />
      </div>

      {last && (
        <div style={{ ...s.card, padding: "12px 14px", marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Last session</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: colorMap[last.dayId] || C.text }}>{last.dayLabel}</div>
              <div style={{ fontSize: 13, color: C.textSub, marginTop: 2 }}>{last.date}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, color: C.textSub }}>{last.exercises.length} exercises</div>
              <div style={{ fontSize: 12, color: C.textMuted, marginTop: 1 }}>
                {(() => { let t = 0; last.exercises.forEach((e) => t += e.sets.length); return t; })()} sets
              </div>
            </div>
          </div>
        </div>
      )}

      {todayDay ? (
        <button onClick={() => { setStartDay(todayDay.id); setTab("log"); }}
          style={{ ...s.greenBtn, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 14 }}>
          Start {todayDay.label}
        </button>
      ) : (
        <button onClick={() => setTab("log")} style={{ ...s.greenBtn, marginBottom: 14 }}>Log a workout</button>
      )}

      <BodyHeatmapGrid vol={vol} heatColor={heatColor} heatmapOpen={heatmapOpen} setHeatmapOpen={setHeatmapOpen} />

      {history.length === 0 && (
        <div style={{ textAlign: "center", padding: "32px 0 16px" }}>
          <div style={{ fontSize: 15, color: C.textSub, marginBottom: 6 }}>No sessions yet</div>
          <div style={{ fontSize: 13, color: C.textMuted }}>Log your first workout to get started</div>
        </div>
      )}
    </div>
  );
}
