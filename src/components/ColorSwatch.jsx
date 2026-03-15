import { useEffect, useRef, useState } from "react";
import { isTextColorClass } from "./utils/helpers";

export default function ColorSwatch({ cls, size = 10, marginRight = 6 }) {
  const probeRef = useRef(null);
  const [color, setColor] = useState(null);

  useEffect(() => {
    const probe = probeRef.current;
    if (!probe) return; const styles = window.getComputedStyle(probe);

    if (
      cls.startsWith("bg-") ||
      cls.startsWith("from-") ||
      cls.startsWith("via-") ||
      cls.startsWith("to-")
    ) {
      setColor(styles.backgroundColor);
      return;
    }

    if (isTextColorClass(cls)) {
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
            width: size,
            height: size,
            borderRadius: 2,
            border: "1px solid #666",
            background: color,
            display: "inline-block",
            marginRight,
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