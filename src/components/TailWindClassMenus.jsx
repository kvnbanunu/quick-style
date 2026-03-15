import { useMemo, useState, useRef } from "react";
import tailwindClasses from "./tailwindClasses";
import { isTextColorClass } from "./utils/helpers";
import ColorSwatch from "./ColorSwatch";

const GROUPS = [
  {
    name: "Spacing",
    match: (c) =>
      c.startsWith("m-") ||
      c.startsWith("mx-") ||
      c.startsWith("my-") ||
      c.startsWith("mt-") ||
      c.startsWith("mr-") ||
      c.startsWith("mb-") ||
      c.startsWith("ml-") ||
      c.startsWith("p-") ||
      c.startsWith("px-") ||
      c.startsWith("py-") ||
      c.startsWith("pt-") ||
      c.startsWith("pr-") ||
      c.startsWith("pb-") ||
      c.startsWith("pl-") ||
      c.startsWith("gap-") ||
      c.startsWith("space-"),
  },
  {
    name: "Typography",
    match: (c) =>
      (c.startsWith("text-") && !isTextColorClass(c)) ||
      c.startsWith("font-") ||
      c.startsWith("leading-") ||
      c.startsWith("tracking-") ||
      c === "italic" ||
      c === "uppercase" ||
      c === "lowercase" ||
      c === "capitalize",
  },
  {
    name: "Layout",
    match: (c) =>
      c === "block" ||
      c === "inline-block" ||
      c === "inline" ||
      c === "flex" ||
      c === "grid" ||
      c.startsWith("items-") ||
      c.startsWith("justify-") ||
      c.startsWith("content-") ||
      c.startsWith("place-"),
  },
  {
    name: "Background",
    match: (c) =>
      c.startsWith("bg-") ||
      c.startsWith("from-") ||
      c.startsWith("via-") ||
      c.startsWith("to-") ||
      c.startsWith("bg-blend-") ||
      c.startsWith("bg-opacity-"),
  },
  {
    name: "Color",
    match: (c) =>
      c.startsWith("bg-") ||
      isTextColorClass(c) ||
      c.startsWith("border-") ||
      c.startsWith("from-") ||
      c.startsWith("via-") ||
      c.startsWith("to-"),
  },
  {
    name: "Borders",
    match: (c) =>
      c.startsWith("border") ||
      c.startsWith("rounded") ||
      c.startsWith("ring") ||
      c.startsWith("outline"),
  },
];

function buildGroups() {
  const used = new Set();
  const out = GROUPS.map((g) => {
    const options = tailwindClasses.filter((c) => {
      const hit = g.match(c);
      if (hit) used.add(c);
      return hit;
    });
    return { name: g.name, options };
  }).filter((g) => g.options.length > 0);

  const other = tailwindClasses.filter((c) => !used.has(c));
  if (other.length > 0) out.push({ name: "Other", options: other });

  return out;
}

export default function TailwindClassMenus({ selectedClasses, onToggleClass }) {
  const groups = useMemo(buildGroups, []);
  const [open, setOpen] = useState(() =>
    Object.fromEntries(groups.map((g) => [g.name, false]))
  );
  return (
    <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
      {groups.map((group) => (
        <div key={group.name} style={{ border: "1px solid #334155", borderRadius: 6 }}>
          <button
            type="button"
            onClick={() => setOpen((s) => ({ ...s, [group.name]: !s[group.name] }))}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "6px 8px",
              border: "none",
              cursor: "pointer",
              background: "#111827",
              color: "#e5e7eb",
              borderRadius: 6,
            }}
          >
            {group.name}
          </button>

          {open[group.name] && (
            <div
              style={{
                padding: 8,
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                maxHeight: 180,
                overflowY: "auto",
              }}
            >
              {group.options.slice(0, 120).map((cls) => {
                const active = selectedClasses.includes(cls);
                return (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => onToggleClass(cls)}
                    style={{
                      fontSize: 12,
                      borderRadius: 999,
                      padding: "4px 8px",
                      border: "1px solid #475569",
                      background: active ? "#1d4ed8" : "#1f2937",
                      color: "#fff",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    {/* <ColorSwatch cls={cls} /> */}
                    {cls}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}