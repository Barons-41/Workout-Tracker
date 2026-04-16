"use client";

import { useState, useEffect } from "react";
import { cloneDeep, makeSet, makeSets } from "./constants";
import { Toast, SectionTitle, BackBtn, ExerciseBlock, s, C } from "./ui";

export default function LogTab({ split, history, onAddSession, startDayId, onClearStart }) {
  const [phase, setPhase] = useState("select_day");
  const [selectedDayId, setSelectedDayId] = useState(null);
  const [checked, setChecked] = useState({});
  const [exData, setExData] = useState({});
  const [toast, setToast] = useState("");
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().slice(0, 10));

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2200); };

  const selectDay = (dayId) => {
    const day = split.find((d) => d.id === dayId);
    const c = {}, e = {};
    day.exercises.forEach((ex) => {
      c[ex.name] = true;
      e[ex.name] = { sets: makeSets(), notes: "" };
    });
    setSelectedDayId(dayId);
    setChecked(c);
    setExData(e);
    setPhase("pick_exercises");
  };

  useEffect(() => {
    if (startDayId) selectDay(startDayId);
  }, [startDayId]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateSet = (exName, idx, field, val) => {
    setExData((prev) => { const n = cloneDeep(prev); n[exName].sets[idx][field] = val; return n; });
  };
  const addSet = (exName) =>
    setExData((prev) => { const n = cloneDeep(prev); n[exName].sets.push(makeSet()); return n; });
  const removeSet = (exName, idx) =>
    setExData((prev) => {
      const n = cloneDeep(prev);
      if (n[exName].sets.length > 1) n[exName].sets.splice(idx, 1);
      return n;
    });
  const updateNotes = (exName, val) =>
    setExData((prev) => { const n = cloneDeep(prev); n[exName].notes = val; return n; });

  const getLastSession = (exName, dayId) => {
    for (const sess of history) {
      if (sess.dayId !== dayId) continue;
      const ex = sess.exercises.find((e) => e.name === exName);
      if (ex?.sets?.length > 0) return ex.sets;
    }
    return null;
  };

  const saveSession = async () => {
    const day = split.find((d) => d.id === selectedDayId);
    const selected = day.exercises.filter((ex) => checked[ex.name]);
    const session = {
      date: new Date(sessionDate + "T12:00:00").toLocaleDateString("en-US", {
        weekday: "short", month: "short", day: "numeric", year: "numeric",
      }),
      dateISO: sessionDate,
      dayId: selectedDayId,
      dayLabel: day.label,
      exercises: selected.map((ex) => ({
        name: ex.name,
        muscles: ex.muscles,
        sets: exData[ex.name].sets.filter((s) => s.weight !== "" || s.reps !== ""),
        notes: exData[ex.name].notes,
      })),
    };
    await onAddSession(session);
    showToast("Session saved!");
    setPhase("select_day");
    setSelectedDayId(null);
    if (onClearStart) onClearStart();
  };

  if (phase === "select_day") return (
    <div>
      <Toast msg={toast} />
      <SectionTitle>Select today's workout</SectionTitle>
      {split.map((d) => (
        <button key={d.id} onClick={() => selectDay(d.id)} style={{ width: "100%", padding: "14px 16px", marginBottom: 8, borderRadius: 12, border: "1.5px solid #333", background: "#242424", textAlign: "left", cursor: "pointer", display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 15, fontWeight: 500, color: d.color }}>{d.label}</span>
          <span style={{ fontSize: 12, color: "#888" }}>{d.day}</span>
        </button>
      ))}
    </div>
  );

  const day = split.find((d) => d.id === selectedDayId);

  if (phase === "pick_exercises") return (
    <div>
      <Toast msg={toast} />
      <BackBtn onClick={() => setPhase("select_day")} />
      <SectionTitle>{day.label} — {day.day}</SectionTitle>
      <div style={{ color: "#aaa", fontSize: 13, marginBottom: 12 }}>Uncheck exercises you're skipping today</div>
      {day.exercises.map((ex) => (
        <div key={ex.name} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", ...s.cardSm, marginBottom: 6 }}>
          <input type="checkbox" checked={!!checked[ex.name]} onChange={() => setChecked((p) => ({ ...p, [ex.name]: !p[ex.name] }))}
            style={{ width: 22, height: 22, minWidth: 22, accentColor: "#1D9E75", marginTop: 1, cursor: "pointer" }} />
          <div>
            <div style={{ fontSize: 14, color: "#f0f0f0" }}>{ex.name}</div>
            <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{ex.muscles}</div>
          </div>
        </div>
      ))}
      <button onClick={() => setPhase("log_sets")} disabled={!day.exercises.some((ex) => checked[ex.name])} style={{ ...s.greenBtn, marginTop: 16 }}>Start Logging →</button>
    </div>
  );

  const selected = day.exercises.filter((ex) => checked[ex.name]);
  return (
    <div>
      <Toast msg={toast} />
      <BackBtn onClick={() => setPhase("pick_exercises")} />
      <SectionTitle>{day.label}</SectionTitle>
      {selected.map((ex) => (
        <ExerciseBlock key={ex.name} ex={ex} exData={exData[ex.name]}
          prevSets={getLastSession(ex.name, selectedDayId)}
          onAddSet={() => addSet(ex.name)}
          onRemoveSet={(i) => removeSet(ex.name, i)}
          onUpdateSet={(i, f, v) => updateSet(ex.name, i, f, v)}
          onUpdateNotes={(v) => updateNotes(ex.name, v)}
          onRemoveExercise={() => setChecked((p) => ({ ...p, [ex.name]: false }))} />
      ))}
      <div style={{ marginBottom: 12 }}>
        <div style={{ ...s.label, marginBottom: 6 }}>Session date</div>
        <input type="date" value={sessionDate} onChange={(e) => setSessionDate(e.target.value)}
          style={{ ...s.input, fontSize: 14 }} />
      </div>
      <button onClick={saveSession} style={s.greenBtn}>Save Session</button>
      <div style={{ height: 32 }} />
    </div>
  );
}
