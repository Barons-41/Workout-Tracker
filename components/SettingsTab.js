"use client";

import { useState } from "react";
import { cloneDeep, DEFAULT_SPLIT } from "./constants";
import { Toast, SectionTitle, s, C } from "./ui";

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
      <div style={{ fontSize: 13, color: "#aaa", marginBottom: 14 }}>Add, remove, rename, or reorder exercises per day.</div>
      {split.map((day) => {
        const isOpen = !!openDays[day.id];
        return (
          <div key={day.id} style={{ ...s.card, marginBottom: 12, overflow: "hidden" }}>
            <div style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                <input
                  value={day.label}
                  onChange={(e) => {
                    const next = cloneDeep(split);
                    next.find((d) => d.id === day.id).label = e.target.value;
                    setSplit(next);
                  }}
                  onBlur={(e) => renameDay(day.id, e.target.value)}
                  style={{ background: "none", border: "none", borderBottom: `1px solid ${C.borderMid}`, color: day.color, fontSize: 14, fontWeight: 600, padding: "2px 0", outline: "none", minWidth: 0, flex: 1 }}
                />
                <span style={{ color: C.textMuted, fontSize: 12, fontWeight: 400, flexShrink: 0 }}>{day.day}</span>
              </div>
              <span onClick={() => setOpenDays((p) => ({ ...p, [day.id]: !p[day.id] }))}
                style={{ color: C.textMuted, fontSize: 12, marginLeft: 12, cursor: "pointer", flexShrink: 0 }}>
                {day.exercises.length} ex {isOpen ? "▲" : "▼"}
              </span>
            </div>
            {isOpen && (
              <div style={{ padding: "12px 14px", borderTop: "1px solid #333" }}>
                {day.exercises.map((ex, idx) => (
                  <div key={idx} style={{ padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, color: C.text }}>{ex.name}</div>
                        <div style={{ fontSize: 11, color: C.textMuted }}>{ex.muscles}</div>
                      </div>
                      <button onClick={() => moveEx(day.id, idx, -1)} disabled={idx === 0}
                        style={{ background: "none", border: `1px solid ${C.borderMid}`, borderRadius: 4, color: C.textSub, fontSize: 12, cursor: idx === 0 ? "default" : "pointer", padding: "3px 6px", opacity: idx === 0 ? 0.3 : 1 }}>↑</button>
                      <button onClick={() => moveEx(day.id, idx, 1)} disabled={idx === day.exercises.length - 1}
                        style={{ background: "none", border: `1px solid ${C.borderMid}`, borderRadius: 4, color: C.textSub, fontSize: 12, cursor: idx === day.exercises.length - 1 ? "default" : "pointer", padding: "3px 6px", opacity: idx === day.exercises.length - 1 ? 0.3 : 1 }}>↓</button>
                      <button onClick={() => removeEx(day.id, ex.name)} style={{ ...s.dangerBtn, padding: "4px 8px", fontSize: 12 }}>×</button>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 5 }}>
                      <span style={{ fontSize: 10, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", width: 56, flexShrink: 0 }}>Rep range</span>
                      <input
                        type="text" placeholder="e.g. 8-12"
                        defaultValue={ex.repRange || ""}
                        onBlur={(e) => updateRepRange(day.id, ex.name, e.target.value)}
                        style={{ flex: 1, background: "#111", border: `1px solid ${C.borderMid}`, borderRadius: 6, color: C.green, fontSize: 12, padding: "4px 8px", outline: "none", fontWeight: 600 }}
                      />
                    </div>
                  </div>
                ))}
                {addTarget === day.id ? (
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #333" }}>
                    <input type="text" placeholder="Exercise name" value={newName}
                      onChange={(e) => setNewName(e.target.value)} style={{ ...s.input, marginBottom: 6 }} />
                    <input type="text" placeholder="Muscles (e.g. chest, triceps)" value={newMuscles}
                      onChange={(e) => setNewMuscles(e.target.value)} style={{ ...s.input, marginBottom: 8 }} />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => addEx(day.id)} style={s.primaryBtn}>Add exercise</button>
                      <button onClick={() => setAddTarget(null)} style={s.outlineBtn}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => { setAddTarget(day.id); setNewName(""); setNewMuscles(""); }}
                    style={{ ...s.primaryBtn, marginTop: 10, width: "100%", textAlign: "center" }}>
                    + Add exercise
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #333" }}>
        <button onClick={resetSplit} style={{ ...s.dangerBtn, width: "100%" }}>Reset split to defaults</button>
      </div>
      <div style={{ height: 32 }} />
    </div>
  );
}
