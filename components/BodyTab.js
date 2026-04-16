"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { fetchBodyStats, insertBodyStat, deleteBodyStat } from "../lib/db";
import { Toast, SectionTitle, s, C } from "./ui";

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

  return (
    <div>
      <Toast msg={toast} />
      <SectionTitle>Log body stats</SectionTitle>
      <div style={{ marginBottom: 10 }}>
        <div style={s.label}>Date</div>
        <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} style={s.input} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        {[["weight","Weight (lbs)","185"],["muscle","Muscle mass (lbs)","155"],["bf","Body fat %","12.5"],["bmi","BMI","22.1"]].map(([k, lbl, ph]) => (
          <div key={k}>
            <div style={s.label}>{lbl}</div>
            <input type="number" inputMode="decimal" placeholder={ph} value={form[k]}
              onChange={(e) => setForm((p) => ({ ...p, [k]: e.target.value }))}
              style={{ ...s.input, padding: "9px 6px" }} />
          </div>
        ))}
      </div>
      <button onClick={save} style={s.greenBtn}>Save Entry</button>

      {stats.length > 0 && (
        <>
          <div style={{ marginTop: 20, height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" tick={{ fill: "#666", fontSize: 10 }} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fill: "#888", fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: "#888", fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#242424", border: "1px solid #444", borderRadius: 8, color: "#f0f0f0", fontSize: 12 }} />
                <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#1D9E75" strokeWidth={2} dot={{ r: 3 }} connectNulls />
                <Line yAxisId="left" type="monotone" dataKey="muscle" stroke="#7F77DD" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3 }} connectNulls />
                <Line yAxisId="right" type="monotone" dataKey="bf" stroke="#378ADD" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} connectNulls />
                <Line yAxisId="right" type="monotone" dataKey="bmi" stroke="#BA7517" strokeWidth={2} strokeDasharray="2 2" dot={{ r: 3 }} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
            {[["#1D9E75","weight (lbs)"],["#7F77DD","muscle (lbs)"],["#378ADD","body fat %"],["#BA7517","BMI"]].map(([c, l]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#aaa" }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />{l}
              </div>
            ))}
          </div>
          <SectionTitle>Entry log</SectionTitle>
          {[...stats].reverse().map((entry) => (
            <div key={entry.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", ...s.cardSm, marginBottom: 6 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#f0f0f0" }}>{entry.date}</div>
                <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>
                  {[
                    entry.weight != null && `${entry.weight} lbs`,
                    entry.muscle != null && `${entry.muscle} lbs muscle`,
                    entry.bf != null && `${entry.bf}%`,
                    entry.bmi != null && `BMI ${entry.bmi}`,
                  ].filter(Boolean).join(" · ")}
                </div>
              </div>
              <button onClick={() => del(entry.id)} style={s.dangerBtn}>×</button>
            </div>
          ))}
        </>
      )}
      {stats.length === 0 && (
        <div style={{ color: "#888", fontSize: 14, textAlign: "center", padding: "32px 0", marginTop: 8 }}>No entries yet.</div>
      )}
      <div style={{ height: 32 }} />
    </div>
  );
}
