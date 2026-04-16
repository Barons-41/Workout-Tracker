"use client";

// ── Design tokens ──────────────────────────────────────────────────────────
export const C = {
  bg: "#151515", surface: "#1e1e1e", surfaceHigh: "#272727",
  border: "#2a2a2a", borderMid: "#383838",
  green: "#1D9E75", greenDim: "#0f5c44",
  text: "#f0f0f0", textSub: "#999", textMuted: "#555",
  red: "#e24b4a", redDim: "#7f1f1f",
};

export const s = {
  bg: { backgroundColor: C.bg },
  card: { backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 14 },
  cardSm: { backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 10 },
  input: { backgroundColor: "#111", border: `1px solid ${C.borderMid}`, borderRadius: 8, color: C.text, fontSize: 15, padding: "10px 12px", width: "100%", outline: "none", WebkitAppearance: "none", MozAppearance: "textfield" },
  label: { fontSize: 11, fontWeight: 500, color: C.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" },
  textPrimary: { color: C.text },
  textSecondary: { color: C.textSub },
  textMuted: { color: C.textMuted },
  greenBtn: { backgroundColor: C.green, border: "none", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 600, padding: "15px 16px", width: "100%", cursor: "pointer" },
  outlineBtn: { backgroundColor: "transparent", border: `1px solid ${C.borderMid}`, borderRadius: 8, color: C.textSub, fontSize: 13, padding: "8px 14px", cursor: "pointer" },
  dangerBtn: { backgroundColor: "transparent", border: `1px solid ${C.redDim}`, borderRadius: 8, color: C.red, fontSize: 13, padding: "8px 12px", cursor: "pointer" },
  primaryBtn: { backgroundColor: "transparent", border: `1px solid ${C.green}`, borderRadius: 8, color: C.green, fontSize: 13, padding: "8px 14px", cursor: "pointer" },
};

// ── Shared components ──────────────────────────────────────────────────────

export function Toast({ msg }) {
  return msg ? (
    <div style={{ background: C.green, color: "#fff", borderRadius: 10, padding: "11px 20px", fontSize: 14, fontWeight: 500, textAlign: "center", margin: "8px 0" }}>{msg}</div>
  ) : null;
}

export function TabBar({ active, setTab }) {
  const tabs = [["home","Home"],["log","Log"],["history","History"],["stats","Stats"],["settings","Split"]];
  return (
    <div style={{ display: "flex", gap: 4, marginBottom: 20, overflowX: "auto", paddingBottom: 2 }}>
      {tabs.map(([id, label]) => (
        <button key={id} onClick={() => setTab(id)} style={{ flexShrink: 0, padding: "8px 12px", borderRadius: 8, border: `1px solid ${active === id ? C.green : C.border}`, background: active === id ? C.green : "transparent", color: active === id ? "#fff" : C.textSub, fontSize: 12, fontWeight: active === id ? 600 : 400, cursor: "pointer", whiteSpace: "nowrap" }}>{label}</button>
      ))}
    </div>
  );
}

export function SectionTitle({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", margin: "20px 0 10px" }}>{children}</div>;
}

export function BackBtn({ onClick, label = "← Back" }) {
  return <button onClick={onClick} style={{ background: "none", border: "none", color: C.textSub, fontSize: 14, cursor: "pointer", padding: "6px 0", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>{label}</button>;
}

export function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{ ...s.card, padding: "14px 16px" }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: accent || C.text, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: C.textSub, marginTop: 5 }}>{sub}</div>}
    </div>
  );
}

// ── SetRow ─────────────────────────────────────────────────────────────────

export function SetRow({ setNum, set, prev, onUpdate, onRemove, canRemove }) {
  const beat = (() => {
    if (!prev) return false;
    const cw = parseFloat(set.weight) || 0, cr = parseInt(set.reps) || 0;
    const pw = parseFloat(prev.weight) || 0, pr = parseInt(prev.reps) || 0;
    if (cw === 0 && cr === 0) return false;
    return cw > pw || cr > pr;
  })();
  const beatStyle = beat ? { border: "1px solid #1D9E75" } : {};
  const rowBg = beat ? { background: "rgba(29,158,117,0.12)", borderRadius: 8, padding: "2px 0" } : { padding: "2px 0" };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr 28px", gap: 6, alignItems: "center", marginBottom: 6, ...rowBg }}>
      <div style={{ fontSize: 12, fontWeight: 500, color: beat ? "#1D9E75" : "#888" }}>S{setNum}</div>
      <input type="number" inputMode="decimal" placeholder={prev?.weight || "0"} value={set.weight}
        onChange={e => onUpdate("weight", e.target.value)}
        style={{ ...s.input, textAlign: "center", fontSize: 15, ...beatStyle }} />
      <input type="number" inputMode="numeric" placeholder={prev?.reps || "0"} value={set.reps}
        onChange={e => onUpdate("reps", e.target.value)}
        style={{ ...s.input, textAlign: "center", fontSize: 15, ...beatStyle }} />
      <button onClick={onRemove} disabled={!canRemove} style={{ background: "none", border: "none", color: canRemove ? "#666" : "#333", fontSize: 18, cursor: canRemove ? "pointer" : "default", width: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
    </div>
  );
}

// ── ExerciseBlock ──────────────────────────────────────────────────────────

export function ExerciseBlock({ ex, exData, prevSets, onAddSet, onRemoveSet, onUpdateSet, onUpdateNotes, onRemoveExercise }) {
  return (
    <div style={{ ...s.card, marginBottom: 10, overflow: "hidden" }}>
      <div style={{ padding: "12px 14px 8px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{ex.name}</div>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 3 }}>{ex.muscles}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            {ex.repRange && <div style={{ fontSize: 11, fontWeight: 600, color: C.green, background: C.greenDim + "44", padding: "2px 7px", borderRadius: 6 }}>{ex.repRange}</div>}
            {onRemoveExercise && <button onClick={onRemoveExercise} style={{ background: "none", border: `1px solid ${C.borderMid}`, borderRadius: 6, color: C.textMuted, fontSize: 14, cursor: "pointer", width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }} title="Skip this exercise">×</button>}
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr 28px", gap: 6, padding: "6px 14px 2px" }}>
        <div /><div style={{ fontSize: 11, color: "#666", textAlign: "center" }}>lbs</div>
        <div style={{ fontSize: 11, color: "#666", textAlign: "center" }}>reps</div><div />
      </div>
      {prevSets && prevSets.length > 0 && (
        <div style={{ padding: "0 14px 4px", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, color: "#555", fontWeight: 500, width: 40, flexShrink: 0 }}>prev</span>
          <div style={{ flex: 1, display: "flex", gap: 4, flexWrap: "wrap" }}>
            {prevSets.slice(0, 6).map((ps, i) => (
              <span key={i} style={{ fontSize: 11, color: "#555", background: "#111", borderRadius: 4, padding: "3px 6px", whiteSpace: "nowrap" }}>{ps.weight || "–"}×{ps.reps || "–"}</span>
            ))}
          </div>
        </div>
      )}
      <div style={{ padding: "4px 14px" }}>
        {exData.sets.map((set, i) => (
          <SetRow key={i} setNum={i + 1} set={set} prev={prevSets?.[i]} canRemove={exData.sets.length > 1}
            onUpdate={(field, val) => onUpdateSet(i, field, val)}
            onRemove={() => onRemoveSet(i)} />
        ))}
      </div>
      <button onClick={onAddSet} style={{ margin: "4px 14px 8px", padding: 8, borderRadius: 8, border: "1px dashed #444", background: "transparent", color: "#888", fontSize: 13, cursor: "pointer", width: "calc(100% - 28px)" }}>+ add set</button>
      <textarea rows={1} placeholder="notes (optional)" value={exData.notes}
        onChange={e => onUpdateNotes(e.target.value)}
        style={{ margin: "0 14px 12px", padding: "8px 10px", ...s.input, width: "calc(100% - 28px)", resize: "none", fontFamily: "inherit" }} />
    </div>
  );
}
