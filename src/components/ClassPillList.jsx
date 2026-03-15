import { useEffect, useState } from "react";
import ColorSwatch from "./ColorSwatch";

export default function ClassPillList({ classes, onRemoveClass }) {
  return (
    <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 4 }}>
      {classes.map((c) => (
        <span
          key={c}
          onClick={() => onRemoveClass(c)}
          style={{
            background: "#333",
            padding: "3px 6px",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 12,
            display: "inline-flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          <ColorSwatch cls={c} />
          {c} x
        </span>
      ))}
    </div>
  );
}