"use client";

// ── Design tokens ──────────────────────────────────────────────────────────

export const MONO = "'Courier New', 'JetBrains Mono', monospace";

export const C = {
  bg: "#141416",
  surface: "#1e1e22",
  surfaceAlt: "#18181c",
  border: "#2a2a30",
  borderAlt: "#242428",
  divider: "#242428",
  gold: "#c8a857",
  goldLight: "#e8d592",
  goldDim: "#3a2e10",
  text: "#f0f0f0",
  textSub: "#aaa",
  textMuted: "#666",
  textDim: "#555",
  red: "#e24b4a",
  redDim: "#7f1f1f",
  // Legacy aliases — keeps un-updated code working
  green: "#c8a857",
  greenDim: "#3a2e10",
  surfaceHigh: "#2a2a30",
  borderMid: "#2a2a30",
};

export const s = {
  bg: { backgroundColor: C.bg },
  card: {
    background: "linear-gradient(135deg, #1c1c20 0%, #24242a 100%)",
    border: `1px solid ${C.border}`,
    borderRadius: 14,
  },
  cardSm: {
    background: "linear-gradient(135deg, #1c1c20 0%, #24242a 100%)",
    border: `1px solid ${C.border}`,
    borderRadius: 10,
  },
  cardAlt: {
    backgroundColor: C.surfaceAlt,
    border: `1px solid ${C.borderAlt}`,
    borderRadius: 14,
  },
  input: {
    backgroundColor: "#0e0e10",
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    color: C.text,
    fontSize: 15,
    padding: "10px 12px",
    width: "100%",
    outline: "none",
    WebkitAppearance: "none",
    MozAppearance: "textfield",
  },
  label: {
    fontSize: 10,
    fontWeight: 600,
    color: C.textMuted,
    marginBottom: 5,
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    fontFamily: MONO,
  },
  textPrimary: { color: C.text },
  textSecondary: { color: C.textSub },
  textMuted: { color: C.textMuted },
  greenBtn: {
    background: "linear-gradient(135deg, #c8a857 0%, #a88430 100%)",
    border: "none",
    borderRadius: 12,
    color: "#141416",
    fontSize: 13,
    fontWeight: 700,
    padding: "15px 16px",
    width: "100%",
    cursor: "pointer",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    fontFamily: MONO,
  },
  outlineBtn: {
    backgroundColor: "transparent",
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    color: C.textSub,
    fontSize: 13,
    padding: "8px 14px",
    cursor: "pointer",
  },
  dangerBtn: {
    backgroundColor: "transparent",
    border: `1px solid ${C.redDim}`,
    borderRadius: 8,
    color: C.red,
    fontSize: 13,
    padding: "8px 12px",
    cursor: "pointer",
  },
  primaryBtn: {
    backgroundColor: "transparent",
    border: `1px solid ${C.gold}`,
    borderRadius: 8,
    color: C.gold,
    fontSize: 13,
    padding: "8px 14px",
    cursor: "pointer",
  },
};

// ── Shared components ──────────────────────────────────────────────────────

export function Toast({ msg }) {
  return msg ? (
    <div style={{
      background: "linear-gradient(135deg, #c8a857 0%, #a88430 100%)",
      color: "#141416",
      borderRadius: 10,
      padding: "11px 20px",
      fontSize: 13,
      fontWeight: 700,
      textAlign: "center",
      margin: "8px 0",
      letterSpacing: "0.1em",
      fontFamily: MONO,
    }}>{msg}</div>
  ) : null;
}

export function TabBar({ active, setTab }) {
  const tabs = [["home","HOME"],["log","LOG"],["history","HIST"],["stats","STATS"],["settings","SPLIT"]];
  return (
    <div style={{ display: "flex", gap: 4, marginBottom: 20, overflowX: "auto", paddingBottom: 2 }}>
      {tabs.map(([id, label]) => (
        <button key={id} onClick={() => setTab(id)} style={{
          flexShrink: 0,
          padding: "8px 12px",
          borderRadius: 8,
          border: `1px solid ${active === id ? C.gold : C.border}`,
          background: active === id
            ? "linear-gradient(135deg, #c8a857 0%, #a88430 100%)"
            : "transparent",
          color: active === id ? "#141416" : C.textMuted,
          fontSize: 10,
          fontWeight: active === id ? 700 : 500,
          cursor: "pointer",
          whiteSpace: "nowrap",
          letterSpacing: "0.15em",
          fontFamily: MONO,
        }}>{label}</button>
      ))}
    </div>
  );
}

export function SectionTitle({ children }) {
  return (
    <div style={{
      fontSize: 10,
      fontWeight: 600,
      color: C.textMuted,
      textTransform: "uppercase",
      letterSpacing: "0.2em",
      margin: "20px 0 10px",
      fontFamily: MONO,
    }}>{children}</div>
  );
}

export function BackBtn({ onClick, label = "← Back" }) {
  return (
    <button onClick={onClick} style={{
      background: "none",
      border: "none",
      color: C.textSub,
      fontSize: 13,
      cursor: "pointer",
      padding: "6px 0",
      marginBottom: 14,
      display: "flex",
      alignItems: "center",
      gap: 6,
      fontFamily: MONO,
      letterSpacing: "0.08em",
    }}>{label}</button>
  );
}

export function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{ ...s.card, padding: "14px 16px" }}>
      <div style={{
        fontSize: 10,
        fontWeight: 600,
        color: C.textMuted,
        textTransform: "uppercase",
        letterSpacing: "0.15em",
        marginBottom: 8,
        fontFamily: MONO,
      }}>{label}</div>
      <div style={{
        fontSize: 28,
        fontWeight: 700,
        color: accent || C.goldLight,
        lineHeight: 1,
        fontFamily: MONO,
      }}>{value}</div>
      {sub && (
        <div style={{
          fontSize: 11,
          color: C.textSub,
          marginTop: 5,
          fontFamily: MONO,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}>{sub}</div>
      )}
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
  const beatStyle = beat ? { border: "1px solid #c8a857" } : {};
  const rowBg = beat
    ? { background: "rgba(200,168,87,0.09)", borderRadius: 8, padding: "2px 0" }
    : { padding: "2px 0" };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr 28px", gap: 6, alignItems: "center", marginBottom: 6, ...rowBg }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: beat ? C.gold : "#666", fontFamily: MONO }}>S{setNum}</div>
      <input type="number" inputMode="decimal" placeholder={prev?.weight || "0"} value={set.weight}
        onChange={e => onUpdate("weight", e.target.value)}
        style={{ ...s.input, textAlign: "center", fontSize: 15, fontFamily: MONO, ...beatStyle }} />
      <input type="number" inputMode="numeric" placeholder={prev?.reps || "0"} value={set.reps}
        onChange={e => onUpdate("reps", e.target.value)}
        style={{ ...s.input, textAlign: "center", fontSize: 15, fontFamily: MONO, ...beatStyle }} />
      <button onClick={onRemove} disabled={!canRemove} style={{
        background: "none",
        border: "none",
        color: canRemove ? "#555" : "#2a2a30",
        fontSize: 18,
        cursor: canRemove ? "pointer" : "default",
        width: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>×</button>
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
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 3, fontFamily: MONO, letterSpacing: "0.04em" }}>{ex.muscles}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            {ex.repRange && (
              <div style={{
                fontSize: 11,
                fontWeight: 700,
                color: C.gold,
                background: C.goldDim,
                padding: "2px 7px",
                borderRadius: 6,
                fontFamily: MONO,
                letterSpacing: "0.06em",
              }}>{ex.repRange}</div>
            )}
            {onRemoveExercise && (
              <button onClick={onRemoveExercise} style={{
                background: "none",
                border: `1px solid ${C.border}`,
                borderRadius: 6,
                color: C.textMuted,
                fontSize: 14,
                cursor: "pointer",
                width: 26,
                height: 26,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1,
              }} title="Skip this exercise">×</button>
            )}
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr 28px", gap: 6, padding: "6px 14px 2px" }}>
        <div />
        <div style={{ fontSize: 10, color: C.textDim, textAlign: "center", fontFamily: MONO, letterSpacing: "0.1em" }}>LBS</div>
        <div style={{ fontSize: 10, color: C.textDim, textAlign: "center", fontFamily: MONO, letterSpacing: "0.1em" }}>REPS</div>
        <div />
      </div>
      {prevSets && prevSets.length > 0 && (
        <div style={{ padding: "0 14px 4px", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 10, color: C.textDim, fontWeight: 600, width: 40, flexShrink: 0, fontFamily: MONO, letterSpacing: "0.08em" }}>PREV</span>
          <div style={{ flex: 1, display: "flex", gap: 4, flexWrap: "wrap" }}>
            {prevSets.slice(0, 6).map((ps, i) => (
              <span key={i} style={{
                fontSize: 11,
                color: C.textDim,
                background: "#0e0e10",
                border: `1px solid ${C.borderAlt}`,
                borderRadius: 4,
                padding: "3px 6px",
                whiteSpace: "nowrap",
                fontFamily: MONO,
              }}>{ps.weight || "–"}×{ps.reps || "–"}</span>
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
      <button onClick={onAddSet} style={{
        margin: "4px 14px 8px",
        padding: 8,
        borderRadius: 8,
        border: `1px dashed ${C.border}`,
        background: "transparent",
        color: C.textMuted,
        fontSize: 12,
        cursor: "pointer",
        width: "calc(100% - 28px)",
        fontFamily: MONO,
        letterSpacing: "0.1em",
      }}>+ ADD SET</button>
      <textarea rows={1} placeholder="notes (optional)" value={exData.notes}
        onChange={e => onUpdateNotes(e.target.value)}
        style={{
          margin: "0 14px 12px",
          padding: "8px 10px",
          ...s.input,
          width: "calc(100% - 28px)",
          resize: "none",
          fontFamily: "inherit",
          fontSize: 13,
          color: C.textSub,
        }} />
    </div>
  );
}
