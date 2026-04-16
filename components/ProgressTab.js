"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { COMPOUNDS } from "./constants";
import { SectionTitle, s, C } from "./ui";

export default function ProgressTab({ history }) {
  const [active, setActive] = useState(COMPOUNDS.map((c) => c.name));

  const dataByLift = {};
  COMPOUNDS.forEach((c) => { dataByLift[c.name] = []; });

  [...history].reverse().forEach((session) => {
    const d = session.dateISO ? new Date(session.dateISO + "T12:00:00") : new Date(session.id);
    const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    session.exercises.forEach((ex) => {
      if (!dataByLift[ex.name]) return;
      const maxW = Math.max(...ex.sets.map((set) => parseFloat(set.weight) || 0));
      if (maxW > 0) dataByLift[ex.name].push({ date: dateStr, weight: maxW, fullDate: session.id });
    });
  });

  const allDates = [...new Set(
    Object.values(dataByLift).flat().map((p) => p.date)
  )].sort((a, b) => {
    const da = Object.values(dataByLift).flat().find((p) => p.date === a)?.fullDate ?? 0;
    const db = Object.values(dataByLift).flat().find((p) => p.date === b)?.fullDate ?? 0;
    return da - db;
  });

  const chartData = allDates.map((date) => {
    const point = { date };
    COMPOUNDS.forEach((c) => {
      const match = dataByLift[c.name].find((p) => p.date === date);
      if (match) point[c.name] = match.weight;
    });
    return point;
  });

  const hasData = Object.values(dataByLift).some((arr) => arr.length > 0);

  const shortName = (name) =>
    name
      .replace("Barbell Back Squat", "Squat")
      .replace("Incline Smith Bench", "Incline Smith")
      .replace("DB Shoulder Press", "OHP")
      .replace("Flat Bench Press", "Bench")
      .replace("Smith RDL", "RDL");

  return (
    <div>
      <div style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4 }}>Compound progress</div>
      <div style={{ fontSize: 13, color: C.textSub, marginBottom: 16 }}>Max weight per session</div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {COMPOUNDS.map((c) => {
          const on = active.includes(c.name);
          return (
            <button key={c.name}
              onClick={() => setActive((p) => on ? p.filter((n) => n !== c.name) : [...p, c.name])}
              style={{ padding: "5px 10px", borderRadius: 20, border: `1px solid ${on ? c.color : C.border}`, background: on ? c.color + "22" : "transparent", color: on ? c.color : C.textMuted, fontSize: 11, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}>
              {shortName(c.name)}
            </button>
          );
        })}
      </div>

      {!hasData ? (
        <div style={{ ...s.card, padding: "40px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 15, color: C.textSub, marginBottom: 6 }}>No data yet</div>
          <div style={{ fontSize: 13, color: C.textMuted }}>Log sessions with compound lifts to see progress</div>
        </div>
      ) : (
        <div style={{ ...s.card, padding: "16px 8px 12px 0" }}>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 16, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#232323" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: C.textMuted, fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: C.textMuted, fontSize: 10 }} tickLine={false} axisLine={false} width={36} tickFormatter={(v) => `${v}`} />
                <Tooltip
                  contentStyle={{ background: C.surfaceHigh, border: `1px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: 12 }}
                  labelStyle={{ color: C.textSub, marginBottom: 4 }}
                  formatter={(val, name) => [`${val} lbs`, shortName(name)]}
                />
                {COMPOUNDS.filter((c) => active.includes(c.name)).map((c) => (
                  <Line key={c.name} type="monotone" dataKey={c.name} stroke={c.color} strokeWidth={2}
                    dot={{ r: 3, fill: c.color, strokeWidth: 0 }} connectNulls activeDot={{ r: 5 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {hasData && (
        <>
          <SectionTitle>Personal records</SectionTitle>
          {COMPOUNDS.map((c) => {
            const pts = dataByLift[c.name];
            if (pts.length === 0) return null;
            const pr = Math.max(...pts.map((p) => p.weight));
            const recent = pts[pts.length - 1]?.weight;
            const trend = pts.length > 1 ? recent - pts[pts.length - 2]?.weight : null;
            return (
              <div key={c.name} style={{ ...s.card, padding: "12px 16px", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: C.textSub, marginTop: 2 }}>{pts.length} sessions logged</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: c.color }}>{pr} lbs</div>
                  {trend !== null && (
                    <div style={{ fontSize: 11, color: trend > 0 ? C.green : trend < 0 ? C.red : C.textMuted, marginTop: 2 }}>
                      {trend > 0 ? `+${trend}` : trend} lbs last session
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </>
      )}
      <div style={{ height: 32 }} />
    </div>
  );
}
