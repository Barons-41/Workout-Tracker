"use client";

import { useState } from "react";
import { cloneDeep, makeSet } from "./constants";
import { Toast, SectionTitle, BackBtn, s, C, MONO } from "./ui";

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
    ["EXERCISES", session.exercises.length],
    ["TOTAL SETS", totalSets],
    ["VOLUME", Math.round(totalVol).toLocaleString() + " lbs"],
    ["DURATION", "—"],
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, margin: "12px 0" }}>
      {cards.map(([lbl, val]) => (
        <div key={lbl} style={{ ...s.cardAlt, padding: "10px 12px" }}>
          <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 5, fontFamily: MONO, letterSpacing: "0.15em", textTransform: "uppercase" }}>{lbl}</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: lbl === "DURATION" ? C.textDim : C.goldLight, fontFamily: MONO }}>{val}</div>
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
      <div style={{ ...s.cardAlt, padding: "12px 14px", marginBottom: 14 }}>
        <div style={{ ...s.label, marginBottom: 8 }}>Session date</div>
        <input type="date" value={editDateISO} onChange={(e) => setEditDateISO(e.target.value)}
          style={{ ...s.input, fontSize: 14, fontFamily: MONO }} />
      </div>
      <SectionTitle>{formattedDate} — {session.dayLabel}</SectionTitle>
      {exercises.map((ex, ei) => (
        <div key={ei} style={{ ...s.card, marginBottom: 10, overflow: "hidden" }}>
          <div style={{ padding: "12px 14px 8px", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{ex.name}</div>
            <div style={{ fontSize: 10, color: C.textMuted, marginTop: 3, fontFamily: MONO, letterSpacing: "0.05em" }}>{ex.muscles}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr 28px", gap: 6, padding: "6px 14px 2px" }}>
            <div />
            <div style={{ fontSize: 10, color: C.textDim, textAlign: "center", fontFamily: MONO, letterSpacing: "0.1em" }}>LBS</div>
            <div style={{ fontSize: 10, color: C.textDim, textAlign: "center", fontFamily: MONO, letterSpacing: "0.1em" }}>REPS</div>
            <div />
          </div>
          <div style={{ padding: "4px 14px" }}>
            {ex.sets.map((set, si) => (
              <div key={si} style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr 28px", gap: 6, alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.textDim, fontFamily: MONO }}>S{si + 1}</div>
                <input type="number" inputMode="decimal" value={set.weight}
                  onChange={(e) => upSet(ei, si, "weight", e.target.value)}
                  style={{ ...s.input, textAlign: "center", fontFamily: MONO }} />
                <input type="number" inputMode="numeric" value={set.reps}
                  onChange={(e) => upSet(ei, si, "reps", e.target.value)}
                  style={{ ...s.input, textAlign: "center", fontFamily: MONO }} />
                <button onClick={() => rmSet(ei, si)} disabled={ex.sets.length <= 1}
                  style={{ background: "none", border: "none", color: ex.sets.length > 1 ? C.textMuted : C.border, fontSize: 18, cursor: ex.sets.length > 1 ? "pointer" : "default", width: 28 }}>×</button>
              </div>
            ))}
          </div>
          <button onClick={() => addSet(ei)} style={{
            margin: "4px 14px 8px", padding: 8, borderRadius: 8,
            border: `1px dashed ${C.border}`, background: "transparent",
            color: C.textMuted, fontSize: 12, cursor: "pointer",
            width: "calc(100% - 28px)", fontFamily: MONO, letterSpacing: "0.1em",
          }}>+ ADD SET</button>
          <textarea rows={1} value={ex.notes || ""} onChange={(e) => upNotes(ei, e.target.value)} placeholder="notes"
            style={{ margin: "0 14px 12px", ...s.input, width: "calc(100% - 28px)", resize: "none", fontFamily: "inherit", fontSize: 13, color: C.textSub }} />
        </div>
      ))}
      <button onClick={() => onSave(exercises, editDateISO)} style={s.greenBtn}>▸ SAVE CHANGES</button>
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
    <div style={{ ...s.card, padding: "14px", marginBottom: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: C.textSub, marginBottom: 12, fontFamily: MONO, letterSpacing: "0.12em", textTransform: "uppercase" }}>{monthName}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 14 }}>
        {["M","T","W","T","F","S","S"].map((d, i) => (
          <div key={i} style={{ fontSize: 10, color: C.textMuted, textAlign: "center", paddingBottom: 4, fontFamily: MONO }}>{d}</div>
        ))}
        {Array.from({ length: startOffset }, (_, i) => <div key={"e" + i} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const sess = sessionMap[day];
          const isToday = day === now.getDate();
          return (
            <div key={day} style={{
              aspectRatio: "1",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: sess ? 700 : 400,
              fontFamily: MONO,
              background: sess
                ? (colorMap[sess.dayId] || C.gold) + "22"
                : C.surfaceAlt,
              color: sess ? (colorMap[sess.dayId] || C.gold) : C.textDim,
              border: isToday ? `1px solid ${C.gold}` : `1px solid ${C.borderAlt}`,
            }}>{day}</div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", paddingTop: 10, borderTop: `1px solid ${C.divider}` }}>
        {split.map((d) => (
          <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: C.textMuted, fontFamily: MONO, letterSpacing: "0.06em" }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
            {d.label.toUpperCase()}
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

      {/* View toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[["list", "LIST"], ["calendar", "CALENDAR"]].map(([id, label]) => (
          <button key={id} onClick={() => setView(id)} style={{
            flex: 1,
            padding: "9px 0",
            borderRadius: 8,
            fontSize: 10,
            fontWeight: view === id ? 700 : 500,
            cursor: "pointer",
            border: `1px solid ${view === id ? C.gold : C.border}`,
            background: view === id ? "linear-gradient(135deg, #c8a857 0%, #a88430 100%)" : "transparent",
            color: view === id ? "#141416" : C.textSub,
            letterSpacing: "0.15em",
            fontFamily: MONO,
          }}>{label}</button>
        ))}
      </div>

      {view === "calendar" && <CalendarView history={history} split={split} />}

      {history.length === 0 && (
        <div style={{ color: C.textMuted, fontSize: 12, textAlign: "center", padding: "40px 0", fontFamily: MONO, letterSpacing: "0.1em" }}>
          NO SESSIONS LOGGED YET
        </div>
      )}

      {view === "list" && (
        <>
          {/* Delete confirmation */}
          {confirmDelete !== null && (
            <div style={{ ...s.card, border: `1px solid ${C.redDim}`, padding: 14, marginBottom: 10 }}>
              <div style={{ fontSize: 13, color: C.text, marginBottom: 12 }}>Delete this session? This can't be undone.</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => doDelete(confirmDelete)} style={s.dangerBtn}>YES, DELETE</button>
                <button onClick={() => setConfirmDelete(null)} style={s.outlineBtn}>Cancel</button>
              </div>
            </div>
          )}

          {/* Session cards */}
          {history.map((session) => {
            const isOpen = !!expanded[session.id];
            const dayColor = colorMap[session.dayId] || C.gold;
            return (
              <div key={session.id} style={{ ...s.card, marginBottom: 8, overflow: "hidden", borderLeft: `2px solid ${dayColor}22` }}>
                <div
                  onClick={() => setExpanded((p) => ({ ...p, [session.id]: !p[session.id] }))}
                  style={{ padding: "12px 14px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{session.date}</div>
                    <div style={{ fontSize: 11, color: dayColor, marginTop: 3, fontFamily: MONO, letterSpacing: "0.06em" }}>{session.dayLabel}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button onClick={(e) => { e.stopPropagation(); setEditingId(session.id); }} style={{ ...s.primaryBtn, fontSize: 10, padding: "6px 10px", fontFamily: MONO, letterSpacing: "0.1em" }}>EDIT</button>
                    <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(session.id); }} style={{ ...s.dangerBtn, fontSize: 10, padding: "6px 10px", fontFamily: MONO, letterSpacing: "0.1em" }}>DEL</button>
                    <span style={{ color: C.textDim, fontSize: 11, marginLeft: 2 }}>{isOpen ? "▲" : "▼"}</span>
                  </div>
                </div>

                {isOpen && (
                  <div style={{ padding: "0 14px 14px", borderTop: `1px solid ${C.border}` }}>
                    <SessionStats session={session} />
                    {session.exercises.map((ex, i) => (
                      <div key={i} style={{ marginTop: 12 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.textSub, marginBottom: 6, fontFamily: MONO, letterSpacing: "0.06em", textTransform: "uppercase" }}>{ex.name}</div>
                        {!ex.sets || ex.sets.length === 0
                          ? <div style={{ fontSize: 11, color: C.textDim, fontFamily: MONO }}>NO SETS LOGGED</div>
                          : ex.sets.map((set, si) => (
                            <div key={si} style={{ fontSize: 12, color: C.textMuted, marginBottom: 3, fontFamily: MONO }}>
                              <span style={{ color: C.textDim }}>S{si + 1}</span>
                              {"  "}{set.weight || "–"} lbs × {set.reps || "–"} reps
                            </div>
                          ))
                        }
                        {ex.notes && (
                          <div style={{ fontSize: 12, color: C.textDim, fontStyle: "italic", marginTop: 4 }}>{ex.notes}</div>
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
