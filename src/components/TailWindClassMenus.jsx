import { useMemo, useState } from "react";
import tailwindClasses from "./tailwindClasses";
import { isTextColorClass } from "./utils/helpers";

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
    <div className="mt-1 grid gap-2">
      {groups.map((group) => (
        <div
          key={group.name}
          className="overflow-hidden rounded-lg border border-zinc-700"
        >
          <button
            type="button"
            onClick={() => setOpen((s) => ({ ...s, [group.name]: !s[group.name] }))}
            className="flex w-full items-center justify-between bg-zinc-900 px-3 py-2 text-left text-xs font-medium uppercase tracking-widest text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            <span>{group.name}</span>
            <span
              className={`text-sm transition-transform ${open[group.name] ? "rotate-180" : ""}`}
            >
              ▾
            </span>
          </button>

          {open[group.name] && (
            <div className="flex max-h-44 flex-wrap gap-2 overflow-y-auto bg-zinc-950/50 p-2">
              {group.options.slice(0, 120).map((cls) => {
                const active = selectedClasses.includes(cls);
                return (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => onToggleClass(cls)}
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs transition-colors cursor-pointer ${active ? "border-blue-500 bg-blue-600 text-white" : "border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white"}`}
                  >
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