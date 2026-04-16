"use client";

import { useState } from "react";
import { C, MONO } from "./ui";
import ProgressTab from "./ProgressTab";
import VolumeTab from "./VolumeTab";
import BodyTab from "./BodyTab";

export default function StatsTab({ history }) {
  const [mode, setMode] = useState("progress");

  const tabs = [
    ["progress", "LIFTS"],
    ["volume", "VOLUME"],
    ["body", "BODY"],
  ];

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {tabs.map(([id, label]) => (
          <button key={id} onClick={() => setMode(id)} style={{
            flex: 1,
            padding: "9px 0",
            borderRadius: 8,
            fontSize: 10,
            fontWeight: mode === id ? 700 : 500,
            cursor: "pointer",
            border: `1px solid ${mode === id ? C.gold : C.border}`,
            background: mode === id
              ? "linear-gradient(135deg, #c8a857 0%, #a88430 100%)"
              : "transparent",
            color: mode === id ? "#141416" : C.textSub,
            letterSpacing: "0.15em",
            fontFamily: MONO,
          }}>{label}</button>
        ))}
      </div>
      {mode === "progress" && <ProgressTab history={history} />}
      {mode === "volume" && <VolumeTab history={history} />}
      {mode === "body" && <BodyTab />}
    </div>
  );
}
