"use client";

import { useState } from "react";
import { cloneDeep, makeSet } from "./constants";
import { Toast, SectionTitle, BackBtn, s, C } from "./ui";

// ── SessionStats ───────────────────────────────────────────────────────────

function SessionStats({ session }) {
  let totalSets = 0, totalVol = 0;
  session.exercises.forEach((ex) =>
    ex.sets.forEach((set) => {
      totalSets++;
      totalVol += (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0);
    })
  );
  const cards = [
    ["exercises", session.exercises.length],
    ["total sets", totalSets],
    ["total volume", Math.round(totalVol).toLocaleString() + " lbs"],
    ["duration", "—"],
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, margin: "12px 0" }}>
      {cards.map(([lbl, val]) => (
        <div key={lbl} style={{ ...s.cardSm, padding: "10px 12px" }}>
          <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>{lbl}</div>
          <div style={{ fontSize: 20, fontWeight: 500, color: lbl === "duration" ? "#555" : "#f0f0f0" }}>{val}</div>
        </div>
      ))}
    </div>
  );
}

// ── EditSession ────────────────────────────────────────────────────────────

function EditSession({ session, onSave, onCancel }) {
  const [exercises, setExercises] = useState(
    session.exercises.map((ex) => ({ ...ex, sets: ex.sets.map((set) => ({ ...set })) }))
  );
  const [editDateISO, setEditDateISO] = useState(
    session.dateISO || new Date(session.id).toISOString().slice(0, 10)
  );

  const upSet = (ei, si, field, val) =>
    setExercises((p) => { const n = cloneDeep(p); n[ei].sets[si][field] = val; return n; });
  const addSet = (ei) =>
    setExercises((p) => { const n = cloneDeep(p); n[ei].sets.push(makeSet()); return n; });
  const rmSet = (ei, si) =>
    setExercises((p) => { const n = cloneDeep(p); if (n[ei].sets.length > 1) n[ei].sets.splice(si, 1); return n; });
  const upNotes = (ei, val) =>
    setExercises((p) => { const n = cloneDeep(p); n[ei].notes = val; return n; });

  const formattedDate = new Date(editDateISO + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });

  return (
    <div>
      <BackBtn onClick={onCancel} label="← Cancel edit" />
      <div style={{ ...s.card, padding: "12px 14px", marginBottom: 14 }}>
        <div style={{ ...s.label, marginBottom: 6 }}>Session date</div>
        <input type="date" value={editDateISO} onChange={(e) => setEditDateISO(e.target.value)}
          style={{ ...s.input, fontSize: 14 }} />
      </div>
      <SectionTitle>{formattedDate} — {session.dayLabel}</SectionTitle>
      {exercises.map((ex, ei) => (
        <div key={ei} style={{ ...s.card, marginBottom: 10, overflow: "hidden" }}>
          <div style={{ padding: "12px 14px 8px", borderBottom: "1px solid #333" }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: "#f0f0f0" }}>{ex.name}</div>
            <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{ex.muscles}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr 28px", gap: 6, padding: "6px 14px 2px" }}>
            <div /><div style={{ fontSize: 11, color: "#666", textAlign: "center" }}>lbs</div>
            <div style={{ fontSize: 11, color: "#666", textAlign: "center" }}>reps</div><div />
          </div>
          <div style={{ padding: "4px 14px" }}>
            {ex.sets.map((set, si) => (
              <div key={si} style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr 28px", gap: 6, alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: "#888" }}>S{si + 1}</div>
                <input type="number" inputMode="decimal" value={set.weight}
                  onChange={(e) => upSet(ei, si, "weight", e.target.value)}
                  style={{ ...s.input, textAlign: "center" }} />
                <input type="number" inputMode="numeric" value={set.reps}
                  onChange={(e) => upSet(ei, si, "reps", e.target.value)}
                  style={{ ...s.input, textAlign: "center" }} />
                <button onClick={() => rmSet(ei, si)} disabled={ex.sets.length <= 1}
                  style={{ background: "none", border: "none", color: ex.sets.length > 1 ? "#666" : "#333", fontSize: 18, cursor: ex.sets.length > 1 ? "pointer" : "default", width: 28 }}>×</button>
              </div>
            ))}
          </div>
          <button onClick={() => addSet(ei)} style={{ margin: "4px 14px 8px", padding: 8, borderRadius: 8, border: "1px dashed #444", background: "transparent", color: "#888", fontSize: 13, cursor: "pointer", width: "calc(100% - 28px)" }}>+ add set</button>
          <textarea rows={1} value={ex.notes || ""} onChange={(e) => upNotes(ei, e.target.value)} placeholder="notes"
            style={{ margin: "0 14px 12px", ...s.input, width: "calc(100% - 28px)", resize: "none", fontFamily: "inherit" }} />
        </div>
      ))}
      <button onClick={() => onSave(exercises, editDateISO)} style={s.greenBtn}>Save Changes</button>
      <div style={{ height: 32 }} />
    </div>
  );
}

// ── CalendarView ───────────────────────────────────────────────────────────

function CalendarView({ history, split }) {
  const now = new Date();
  const year = now.getFullYear(), month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const sessionMap = {};
  history.forEach((sess) => {
    const d = sess.dateISO
      ? new Date(sess.dateISO + "T12:00:00")
      : new Date(sess.id);
    if (d.getFullYear() === year && d.getMonth() === month)
      sessionMap[d.getDate()] = { dayId: sess.dayId, dayLabel: sess.dayLabel };
  });

  const colorMap = Object.fromEntries(split.map((d) => [d.id, d.color]));
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const monthName = new Date(year, month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div>
      <div style={{ fontSize: 14, fontWeight: 500, color: "#f0f0f0", marginBottom: 10 }}>{monthName}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 16 }}>
        {["M","T","W","T","F","S","S"].map((d, i) => (
          <div key={i} style={{ fontSize: 10, color: "#666", textAlign: "center", paddingBottom: 4 }}>{d}</div>
        ))}
        {Array.from({ length: startOffset }, (_, i) => <div key={"e" + i} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const sess = sessionMap[day];
          return (
            <div key={day} style={{ aspectRatio: "1", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, background: sess ? (colorMap[sess.dayId] || "#888") : "#242424", color: sess ? "#fff" : "#666" }}>{day}</div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {split.map((d) => (
          <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#aaa" }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color }} />{d.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── HistoryTab ─────────────────────────────────────────────────────────────

export default function HistoryTab({ split, history, onDeleteSession, onUpdateSession }) {
  const [expanded, setExpanded] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [view, setView] = useState("list");
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2200); };

  const doDelete = async (id) => {
    await onDeleteSession(id);
    setConfirmDelete(null);
  };

  const doSaveEdit = async (exercises, dateISO) => {
    const session = history.find((s) => s.id === editingId);
    await onUpdateSession(editingId, exercises, dateISO, session.dayLabel);
    setEditingId(null);
    showToast("Session updated!");
  };

  if (editingId) {
    const session = history.find((s) => s.id === editingId);
    return <EditSession session={session} onSave={doSaveEdit} onCancel={() => setEditingId(null)} />;
  }

  const colorMap = Object.fromEntries(split.map((d) => [d.id, d.color]));

  return (
    <div>
      <Toast msg={toast} />
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <button onClick={() => setView("list")} style={{ ...view === "list" ? s.primaryBtn : s.outlineBtn }}>List</button>
        <button onClick={() => setView("calendar")} style={{ ...view === "calendar" ? s.primaryBtn : s.outlineBtn }}>Calendar</button>
      </div>
      {view === "calendar" && <CalendarView history={history} split={split} />}
      {history.length === 0 && (
        <div style={{ color: "#888", fontSize: 14, textAlign: "center", padding: "40px 0" }}>No sessions logged yet.</div>
      )}
      {view === "list" && (
        <>
          {confirmDelete !== null && (
            <div style={{ ...s.card, border: "1px solid #7f1f1f", padding: 14, marginBottom: 8 }}>
              <div style={{ fontSize: 14, color: "#f0f0f0", marginBottom: 12 }}>Delete this session? This can't be undone.</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => doDelete(confirmDelete)} style={s.dangerBtn}>Yes, delete</button>
                <button onClick={() => setConfirmDelete(null)} style={s.outlineBtn}>Cancel</button>
              </div>
            </div>
          )}
          {history.map((session) => {
            const isOpen = !!expanded[session.id];
            const dayColor = colorMap[session.dayId] || "#888";
            return (
              <div key={session.id} style={{ ...s.card, marginBottom: 8, overflow: "hidden" }}>
                <div onClick={() => setExpanded((p) => ({ ...p, [session.id]: !p[session.id] }))}
                  style={{ padding: "12px 14px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#f0f0f0" }}>{session.date}</div>
                    <div style={{ fontSize: 12, color: dayColor, marginTop: 2 }}>{session.dayLabel}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button onClick={(e) => { e.stopPropagation(); setEditingId(session.id); }} style={s.primaryBtn}>edit</button>
                    <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(session.id); }} style={s.dangerBtn}>delete</button>
                    <span style={{ color: "#666", fontSize: 12 }}>{isOpen ? "▲" : "▼"}</span>
                  </div>
                </div>
                {isOpen && (
                  <div style={{ padding: "0 14px 12px", borderTop: "1px solid #333" }}>
                    <SessionStats session={session} />
                    {session.exercises.map((ex, i) => (
                      <div key={i} style={{ marginTop: 10 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "#f0f0f0", marginBottom: 4 }}>{ex.name}</div>
                        {!ex.sets || ex.sets.length === 0
                          ? <div style={{ fontSize: 12, color: "#555" }}>no sets logged</div>
                          : ex.sets.map((set, si) => (
                            <div key={si} style={{ fontSize: 12, color: "#aaa", marginBottom: 2 }}>
                              Set {si + 1}: {set.weight || "–"} lbs × {set.reps || "–"} reps
                            </div>
                          ))
                        }
                        {ex.notes && (
                          <div style={{ fontSize: 12, color: "#666", fontStyle: "italic", marginTop: 3 }}>{ex.notes}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
