"use client";

import { useState, useEffect } from "react";
import { cloneDeep, makeSet, makeSets } from "./constants";
import { Toast, SectionTitle, BackBtn, ExerciseBlock, s, C, MONO } from "./ui";

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

  // ── Phase: select day ────────────────────────────────────────────────────

  if (phase === "select_day") return (
    <div>
      <Toast msg={toast} />
      <SectionTitle>Select workout</SectionTitle>
      {split.map((d) => (
        <button key={d.id} onClick={() => selectDay(d.id)} style={{
          width: "100%",
          padding: "14px 16px",
          marginBottom: 8,
          borderRadius: 12,
          border: `1px solid ${C.border}`,
          background: "linear-gradient(135deg, #1c1c20 0%, #24242a 100%)",
          textAlign: "left",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderLeft: `3px solid ${d.color}`,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: d.color, letterSpacing: "0.04em" }}>{d.label}</div>
            <div style={{ fontSize: 10, color: C.textMuted, marginTop: 3, fontFamily: MONO, letterSpacing: "0.12em", textTransform: "uppercase" }}>{d.day}</div>
          </div>
          <div style={{ fontSize: 10, color: C.textDim, fontFamily: MONO, letterSpacing: "0.1em" }}>
            {d.exercises.length} EX
          </div>
        </button>
      ))}
    </div>
  );

  // ── Phase: pick exercises ────────────────────────────────────────────────

  const day = split.find((d) => d.id === selectedDayId);

  if (phase === "pick_exercises") return (
    <div>
      <Toast msg={toast} />
      <BackBtn onClick={() => setPhase("select_day")} />
      <SectionTitle>{day.label} — {day.day}</SectionTitle>
      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 14, fontFamily: MONO, letterSpacing: "0.06em" }}>
        UNCHECK EXERCISES YOU ARE SKIPPING
      </div>
      {day.exercises.map((ex) => (
        <div key={ex.name} style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          padding: "12px 14px",
          ...s.cardSm,
          marginBottom: 6,
          borderLeft: checked[ex.name] ? `2px solid ${C.gold}` : `2px solid ${C.border}`,
        }}>
          <input
            type="checkbox"
            checked={!!checked[ex.name]}
            onChange={() => setChecked((p) => ({ ...p, [ex.name]: !p[ex.name] }))}
            style={{ width: 20, height: 20, minWidth: 20, accentColor: C.gold, marginTop: 2, cursor: "pointer" }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, color: checked[ex.name] ? C.text : C.textMuted, fontWeight: checked[ex.name] ? 600 : 400, transition: "color 0.15s" }}>{ex.name}</div>
            <div style={{ fontSize: 10, color: C.textDim, marginTop: 3, fontFamily: MONO, letterSpacing: "0.06em" }}>{ex.muscles}</div>
          </div>
          {ex.repRange && (
            <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, background: C.goldDim, padding: "2px 7px", borderRadius: 6, fontFamily: MONO, letterSpacing: "0.06em", flexShrink: 0, marginTop: 1 }}>{ex.repRange}</div>
          )}
        </div>
      ))}
      <button
        onClick={() => setPhase("log_sets")}
        disabled={!day.exercises.some((ex) => checked[ex.name])}
        style={{ ...s.greenBtn, marginTop: 16 }}
      >
        ▸ START LOGGING
      </button>
    </div>
  );

  // ── Phase: log sets ──────────────────────────────────────────────────────

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
      <div style={{ ...s.cardAlt, padding: "12px 14px", marginBottom: 12 }}>
        <div style={{ ...s.label, marginBottom: 8 }}>Session date</div>
        <input type="date" value={sessionDate} onChange={(e) => setSessionDate(e.target.value)}
          style={{ ...s.input, fontSize: 14, fontFamily: MONO }} />
      </div>
      <button onClick={saveSession} style={s.greenBtn}>▸ SAVE SESSION</button>
      <div style={{ height: 32 }} />
    </div>
  );
}
