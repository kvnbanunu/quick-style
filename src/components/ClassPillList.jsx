import { useEffect, useRef, useState } from "react";

function ColorSwatch({ cls }) {
  const probeRef = useRef(null);
  const [color, setColor] = useState(null);

  useEffect(() => {
    const probe = probeRef.current;
    if (!probe) return;

    const styles = window.getComputedStyle(probe);

    if (
      cls.startsWith("bg-") ||
      cls.startsWith("from-") ||
      cls.startsWith("via-") ||
      cls.startsWith("to-")
    ) {
      setColor(styles.backgroundColor);
      return;
    }

    if (cls.startsWith("text-")) {
      setColor(styles.color);
      return;
    }

    if (cls.startsWith("border-")) {
      setColor(styles.borderColor);
      return;
    }

    setColor(null);
  }, [cls]);

  const isTransparent =
    !color || color === "rgba(0, 0, 0, 0)" || color === "transparent";

  return (
    <>
      {!isTransparent && (
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: 2,
            border: "1px solid #666",
            background: color,
            display: "inline-block",
            marginRight: 6,
            flexShrink: 0,
          }}
        />
      )}
      <span
        ref={probeRef}
        className={cls}
        style={{
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
          width: 0,
          height: 0,
          overflow: "hidden",
        }}
      />
    </>
  );
}

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