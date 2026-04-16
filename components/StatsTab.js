"use client";

import { useState } from "react";
import { C } from "./ui";
import ProgressTab from "./ProgressTab";
import VolumeTab from "./VolumeTab";
import BodyTab from "./BodyTab";

export default function StatsTab({ history }) {
  const [mode, setMode] = useState("progress");

  const pill = (id, label) => (
    <button key={id} onClick={() => setMode(id)} style={{
      flex: 1, padding: "9px 0", borderRadius: 8, fontSize: 13,
      fontWeight: mode === id ? 600 : 400, cursor: "pointer",
      border: `1px solid ${mode === id ? C.green : "#383838"}`,
      background: mode === id ? C.green : "transparent",
      color: mode === id ? "#fff" : C.textSub,
    }}>{label}</button>
  );

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {pill("progress", "Lift Progress")}
        {pill("volume", "Weekly Volume")}
        {pill("body", "Body Stats")}
      </div>
      {mode === "progress" && <ProgressTab history={history} />}
      {mode === "volume" && <VolumeTab history={history} />}
      {mode === "body" && <BodyTab />}
    </div>
  );
}
