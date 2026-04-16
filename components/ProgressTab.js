"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { COMPOUNDS } from "./constants";
import { SectionTitle, s, C, MONO } from "./ui";

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
      <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 2, letterSpacing: "0.04em" }}>Compound progress</div>
      <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 16, fontFamily: MONO, letterSpacing: "0.08em" }}>MAX WEIGHT PER SESSION</div>

      {/* Lift filter pills */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        {COMPOUNDS.map((c) => {
          const on = active.includes(c.name);
          return (
            <button key={c.name}
              onClick={() => setActive((p) => on ? p.filter((n) => n !== c.name) : [...p, c.name])}
              style={{
                padding: "5px 10px",
                borderRadius: 20,
                border: `1px solid ${on ? c.color : C.border}`,
                background: on ? c.color + "18" : "transparent",
                color: on ? c.color : C.textDim,
                fontSize: 10,
                fontWeight: on ? 600 : 400,
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontFamily: MONO,
                letterSpacing: "0.08em",
              }}>
              {shortName(c.name).toUpperCase()}
            </button>
          );
        })}
      </div>

      {!hasData ? (
        <div style={{ ...s.card, padding: "40px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 13, color: C.textSub, marginBottom: 6 }}>No data yet</div>
          <div style={{ fontSize: 11, color: C.textMuted, fontFamily: MONO, letterSpacing: "0.08em" }}>LOG SESSIONS WITH COMPOUND LIFTS TO SEE PROGRESS</div>
        </div>
      ) : (
        <div style={{ ...s.card, padding: "16px 8px 12px 0" }}>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 16, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#242428" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: C.textDim, fontSize: 9, fontFamily: MONO }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: C.textDim, fontSize: 9, fontFamily: MONO }}
                  tickLine={false}
                  axisLine={false}
                  width={36}
                  tickFormatter={(v) => `${v}`}
                />
                <Tooltip
                  contentStyle={{
                    background: "#18181c",
                    border: `1px solid ${C.border}`,
                    borderRadius: 10,
                    color: C.text,
                    fontSize: 12,
                    fontFamily: MONO,
                  }}
                  labelStyle={{ color: C.textSub, marginBottom: 6, letterSpacing: "0.08em", fontSize: 10 }}
                  formatter={(val, name) => [`${val} lbs`, shortName(name).toUpperCase()]}
                />
                {COMPOUNDS.filter((c) => active.includes(c.name)).map((c) => (
                  <Line key={c.name} type="monotone" dataKey={c.name} stroke={c.color} strokeWidth={2}
                    dot={{ r: 3, fill: c.color, strokeWidth: 0 }} connectNulls activeDot={{ r: 5, stroke: c.color, strokeWidth: 2 }} />
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
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{c.name}</div>
                  <div style={{ fontSize: 10, color: C.textMuted, marginTop: 3, fontFamily: MONO, letterSpacing: "0.06em" }}>{pts.length} SESSIONS LOGGED</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: C.goldLight, fontFamily: MONO }}>{pr}<span style={{ fontSize: 12, color: C.textMuted, marginLeft: 3 }}>lbs</span></div>
                  {trend !== null && (
                    <div style={{ fontSize: 10, color: trend > 0 ? C.gold : trend < 0 ? C.red : C.textMuted, marginTop: 3, fontFamily: MONO, letterSpacing: "0.06em" }}>
                      {trend > 0 ? `+${trend}` : trend} LBS LAST SESSION
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
