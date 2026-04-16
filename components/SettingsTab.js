"use client";

import { useState } from "react";
import { cloneDeep, DEFAULT_SPLIT } from "./constants";
import { Toast, SectionTitle, s, C, MONO } from "./ui";

export default function SettingsTab({ split, setSplit, onSaveSplit }) {
  const [openDays, setOpenDays] = useState({});
  const [addTarget, setAddTarget] = useState(null);
  const [newName, setNewName] = useState("");
  const [newMuscles, setNewMuscles] = useState("");
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2200); };

  const save = async (next) => {
    setSplit(next);
    await onSaveSplit(next);
  };

  const removeEx = async (dayId, exName) => {
    const next = cloneDeep(split);
    const day = next.find((d) => d.id === dayId);
    day.exercises = day.exercises.filter((e) => e.name !== exName);
    await save(next);
  };

  const moveEx = async (dayId, idx, dir) => {
    const next = cloneDeep(split);
    const day = next.find((d) => d.id === dayId);
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= day.exercises.length) return;
    [day.exercises[idx], day.exercises[newIdx]] = [day.exercises[newIdx], day.exercises[idx]];
    await save(next);
  };

  const addEx = async (dayId) => {
    if (!newName.trim()) { showToast("Enter exercise name"); return; }
    const next = cloneDeep(split);
    next.find((d) => d.id === dayId).exercises.push({
      name: newName.trim(),
      muscles: newMuscles.trim() || "general",
    });
    await save(next);
    setNewName(""); setNewMuscles(""); setAddTarget(null);
  };

  const renameDay = async (dayId, newLabel) => {
    if (!newLabel.trim()) return;
    const next = cloneDeep(split);
    next.find((d) => d.id === dayId).label = newLabel.trim();
    await save(next);
  };

  const updateRepRange = async (dayId, exName, val) => {
    const next = cloneDeep(split);
    const ex = next.find((d) => d.id === dayId).exercises.find((e) => e.name === exName);
    if (ex) ex.repRange = val;
    await save(next);
  };

  const resetSplit = async () => {
    if (!confirm("Reset split to defaults? This removes all custom changes.")) return;
    const def = cloneDeep(DEFAULT_SPLIT);
    await save(def);
    showToast("Split reset to defaults.");
  };

  return (
    <div>
      <Toast msg={toast} />
      <SectionTitle>Split editor</SectionTitle>
      <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 16, fontFamily: MONO, letterSpacing: "0.06em" }}>
        ADD, REMOVE, RENAME, OR REORDER EXERCISES PER DAY
      </div>

      {split.map((day) => {
        const isOpen = !!openDays[day.id];
        return (
          <div key={day.id} style={{ ...s.card, marginBottom: 10, overflow: "hidden", borderLeft: `3px solid ${day.color}` }}>

            {/* Day header row */}
            <div style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                <input
                  value={day.label}
                  onChange={(e) => {
                    const next = cloneDeep(split);
                    next.find((d) => d.id === day.id).label = e.target.value;
                    setSplit(next);
                  }}
                  onBlur={(e) => renameDay(day.id, e.target.value)}
                  style={{
                    background: "none",
                    border: "none",
                    borderBottom: `1px solid ${C.border}`,
                    color: day.color,
                    fontSize: 14,
                    fontWeight: 700,
                    padding: "2px 0",
                    outline: "none",
                    minWidth: 0,
                    flex: 1,
                    letterSpacing: "0.02em",
                  }}
                />
                <span style={{ color: C.textDim, fontSize: 10, fontWeight: 500, flexShrink: 0, fontFamily: MONO, letterSpacing: "0.1em", textTransform: "uppercase" }}>{day.day}</span>
              </div>
              <div
                onClick={() => setOpenDays((p) => ({ ...p, [day.id]: !p[day.id] }))}
                style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginLeft: 12, flexShrink: 0 }}
              >
                <span style={{ fontSize: 10, color: C.textDim, fontFamily: MONO, letterSpacing: "0.08em" }}>{day.exercises.length} EX</span>
                <span style={{ color: C.textDim, fontSize: 11 }}>{isOpen ? "▲" : "▼"}</span>
              </div>
            </div>

            {/* Expanded exercise list */}
            {isOpen && (
              <div style={{ padding: "0 14px 14px", borderTop: `1px solid ${C.border}` }}>
                {day.exercises.map((ex, idx) => (
                  <div key={idx} style={{ padding: "10px 0", borderBottom: `1px solid ${C.divider}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{ex.name}</div>
                        <div style={{ fontSize: 10, color: C.textDim, marginTop: 2, fontFamily: MONO, letterSpacing: "0.05em" }}>{ex.muscles}</div>
                      </div>
                      {/* Reorder buttons */}
                      <button
                        onClick={() => moveEx(day.id, idx, -1)}
                        disabled={idx === 0}
                        style={{
                          background: "none",
                          border: `1px solid ${C.border}`,
                          borderRadius: 5,
                          color: idx === 0 ? C.border : C.textSub,
                          fontSize: 12,
                          cursor: idx === 0 ? "default" : "pointer",
                          padding: "3px 7px",
                          opacity: idx === 0 ? 0.3 : 1,
                          fontFamily: MONO,
                        }}>↑</button>
                      <button
                        onClick={() => moveEx(day.id, idx, 1)}
                        disabled={idx === day.exercises.length - 1}
                        style={{
                          background: "none",
                          border: `1px solid ${C.border}`,
                          borderRadius: 5,
                          color: idx === day.exercises.length - 1 ? C.border : C.textSub,
                          fontSize: 12,
                          cursor: idx === day.exercises.length - 1 ? "default" : "pointer",
                          padding: "3px 7px",
                          opacity: idx === day.exercises.length - 1 ? 0.3 : 1,
                          fontFamily: MONO,
                        }}>↓</button>
                      <button
                        onClick={() => removeEx(day.id, ex.name)}
                        style={{ ...s.dangerBtn, padding: "4px 9px", fontSize: 12 }}>×</button>
                    </div>

                    {/* Rep range */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 7 }}>
                      <span style={{ fontSize: 9, color: C.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", width: 58, flexShrink: 0, fontFamily: MONO }}>Rep range</span>
                      <input
                        type="text"
                        placeholder="e.g. 8-12"
                        defaultValue={ex.repRange || ""}
                        onBlur={(e) => updateRepRange(day.id, ex.name, e.target.value)}
                        style={{
                          flex: 1,
                          backgroundColor: "#0e0e10",
                          border: `1px solid ${C.border}`,
                          borderRadius: 6,
                          color: C.gold,
                          fontSize: 12,
                          padding: "5px 9px",
                          outline: "none",
                          fontWeight: 700,
                          fontFamily: MONO,
                          letterSpacing: "0.06em",
                        }}
                      />
                    </div>
                  </div>
                ))}

                {/* Add exercise form / button */}
                {addTarget === day.id ? (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                    <input
                      type="text"
                      placeholder="Exercise name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      style={{ ...s.input, marginBottom: 8, fontSize: 14 }}
                    />
                    <input
                      type="text"
                      placeholder="Muscles (e.g. chest, triceps)"
                      value={newMuscles}
                      onChange={(e) => setNewMuscles(e.target.value)}
                      style={{ ...s.input, marginBottom: 10, fontSize: 14 }}
                    />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => addEx(day.id)} style={{ ...s.primaryBtn, fontFamily: MONO, letterSpacing: "0.1em", fontSize: 11 }}>ADD EXERCISE</button>
                      <button onClick={() => setAddTarget(null)} style={{ ...s.outlineBtn, fontFamily: MONO, letterSpacing: "0.1em", fontSize: 11 }}>CANCEL</button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => { setAddTarget(day.id); setNewName(""); setNewMuscles(""); }}
                    style={{
                      ...s.primaryBtn,
                      marginTop: 12,
                      width: "100%",
                      textAlign: "center",
                      fontFamily: MONO,
                      letterSpacing: "0.12em",
                      fontSize: 11,
                    }}>
                    + ADD EXERCISE
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Reset */}
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.divider}` }}>
        <button onClick={resetSplit} style={{ ...s.dangerBtn, width: "100%", fontFamily: MONO, letterSpacing: "0.12em", fontSize: 11 }}>
          RESET SPLIT TO DEFAULTS
        </button>
      </div>
      <div style={{ height: 32 }} />
    </div>
  );
}
