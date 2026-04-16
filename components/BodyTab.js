"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { fetchBodyStats, insertBodyStat, deleteBodyStat } from "../lib/db";
import { Toast, SectionTitle, s, C, MONO } from "./ui";

// Chart line colours — distinct from gold so they're readable
const LINE_COLORS = {
  weight:  "#c8a857",  // gold — primary metric
  muscle:  "#7f77dd",  // purple
  bf:      "#378add",  // blue
  bmi:     "#e07b39",  // amber-orange
};

export default function BodyTab() {
  const [stats, setStats] = useState([]);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    weight: "", bf: "", bmi: "", muscle: "",
  });
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2200); };

  useEffect(() => {
    fetchBodyStats().then((data) => setStats(data || []));
  }, []);

  const save = async () => {
    if (!form.weight && !form.bf && !form.bmi && !form.muscle) {
      showToast("Enter at least one value");
      return;
    }
    const entry = {
      date: form.date,
      weight: form.weight ? parseFloat(form.weight) : null,
      bf: form.bf ? parseFloat(form.bf) : null,
      bmi: form.bmi ? parseFloat(form.bmi) : null,
      muscle: form.muscle ? parseFloat(form.muscle) : null,
    };
    const saved = await insertBodyStat(entry);
    if (saved) {
      setStats((prev) => [...prev, saved].sort((a, b) => a.date.localeCompare(b.date)));
      setForm({ date: new Date().toISOString().slice(0, 10), weight: "", bf: "", bmi: "", muscle: "" });
      showToast("Stats saved!");
    }
  };

  const del = async (id) => {
    await deleteBodyStat(id);
    setStats((prev) => prev.filter((s) => s.id !== id));
  };

  const chartData = stats.map((e) => ({
    date: e.date, weight: e.weight, bf: e.bf, bmi: e.bmi, muscle: e.muscle,
  }));

  const fields = [
    ["weight", "Weight (lbs)", "185"],
    ["muscle", "Muscle mass (lbs)", "155"],
    ["bf", "Body fat %", "12.5"],
    ["bmi", "BMI", "22.1"],
  ];

  return (
    <div>
      <Toast msg={toast} />

      {/* Log form */}
      <SectionTitle>Log body stats</SectionTitle>
      <div style={{ ...s.cardAlt, padding: "14px", marginBottom: 14 }}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ ...s.label, marginBottom: 8 }}>Date</div>
          <input type="date" value={form.date}
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            style={{ ...s.input, fontFamily: MONO }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {fields.map(([k, lbl, ph]) => (
            <div key={k}>
              <div style={{ ...s.label, marginBottom: 6 }}>{lbl}</div>
              <input type="number" inputMode="decimal" placeholder={ph} value={form[k]}
                onChange={(e) => setForm((p) => ({ ...p, [k]: e.target.value }))}
                style={{ ...s.input, padding: "9px 8px", fontFamily: MONO, fontSize: 14 }} />
            </div>
          ))}
        </div>
      </div>
      <button onClick={save} style={s.greenBtn}>▸ SAVE ENTRY</button>

      {stats.length > 0 && (
        <>
          {/* Chart */}
          <div style={{ ...s.card, padding: "16px 8px 12px 0", marginTop: 20 }}>
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#242428" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: C.textDim, fontSize: 9, fontFamily: MONO }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fill: C.textDim, fontSize: 9, fontFamily: MONO }}
                    tickLine={false}
                    axisLine={false}
                    width={32}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: C.textDim, fontSize: 9, fontFamily: MONO }}
                    tickLine={false}
                    axisLine={false}
                    width={28}
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
                    labelStyle={{ color: C.textSub, marginBottom: 6, fontSize: 10, letterSpacing: "0.08em" }}
                  />
                  <Line yAxisId="left"  type="monotone" dataKey="weight" stroke={LINE_COLORS.weight} strokeWidth={2} dot={{ r: 3, fill: LINE_COLORS.weight, strokeWidth: 0 }} connectNulls />
                  <Line yAxisId="left"  type="monotone" dataKey="muscle" stroke={LINE_COLORS.muscle} strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3, fill: LINE_COLORS.muscle, strokeWidth: 0 }} connectNulls />
                  <Line yAxisId="right" type="monotone" dataKey="bf"     stroke={LINE_COLORS.bf}     strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3, fill: LINE_COLORS.bf,     strokeWidth: 0 }} connectNulls />
                  <Line yAxisId="right" type="monotone" dataKey="bmi"    stroke={LINE_COLORS.bmi}    strokeWidth={2} strokeDasharray="2 2" dot={{ r: 3, fill: LINE_COLORS.bmi,    strokeWidth: 0 }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart legend */}
          <div style={{ display: "flex", gap: 14, marginTop: 10, flexWrap: "wrap" }}>
            {[
              [LINE_COLORS.weight, "weight"],
              [LINE_COLORS.muscle, "muscle"],
              [LINE_COLORS.bf,     "body fat %"],
              [LINE_COLORS.bmi,    "bmi"],
            ].map(([c, l]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: C.textMuted, fontFamily: MONO, letterSpacing: "0.06em" }}>
                <div style={{ width: 10, height: 2, background: c, borderRadius: 1 }} />{l}
              </div>
            ))}
          </div>

          {/* Entry log */}
          <SectionTitle>Entry log</SectionTitle>
          {[...stats].reverse().map((entry) => (
            <div key={entry.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", ...s.cardSm, marginBottom: 6 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.text, fontFamily: MONO }}>{entry.date}</div>
                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 3, fontFamily: MONO }}>
                  {[
                    entry.weight != null && `${entry.weight} lbs`,
                    entry.muscle != null && `${entry.muscle} lbs muscle`,
                    entry.bf     != null && `${entry.bf}%`,
                    entry.bmi    != null && `BMI ${entry.bmi}`,
                  ].filter(Boolean).join(" · ")}
                </div>
              </div>
              <button onClick={() => del(entry.id)} style={{ ...s.dangerBtn, padding: "5px 10px", fontSize: 13 }}>×</button>
            </div>
          ))}
        </>
      )}

      {stats.length === 0 && (
        <div style={{ color: C.textMuted, fontSize: 11, textAlign: "center", padding: "32px 0", marginTop: 8, fontFamily: MONO, letterSpacing: "0.1em" }}>
          NO ENTRIES YET
        </div>
      )}
      <div style={{ height: 32 }} />
    </div>
  );
}
