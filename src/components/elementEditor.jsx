import { useState, useRef, useEffect } from "react";
import tailwindClasses from "./tailwindClasses";
import { sendClass } from "../tw-runtime/tw-runtime";

export default function ClassEditor({ classes, selected, setClasses }) {
  function applyClasses(list) {
    if (!selected) return;

    const value = list.join(" ");

    selected.setAttribute("class", value);
    setClasses(list);
  }

  function addClass(cls) {
    if (!cls) return;
    applyClasses([...classes, cls]);
    //sendClass(cls);
  }

  function removeClass(cls) {
    applyClasses(classes.filter((c) => c !== cls));
  }

  if (!selected) {
    return <div className="bg-blue-700">Select an Element</div>;
  } else {
    return (
      <div className="bg-blue-700">
        Class Editor
        <ClassList classes={classes} removeClass={removeClass} />
        <ClassInput addClass={addClass} />
      </div>
    );
  }
}
function ColorSwatch({ cls }) {
  const probeRef = useRef(null);
  const [color, setColor] = useState(null);

  useEffect(() => {
    const probe = probeRef.current;
    if (!probe) return;

    const styles = window.getComputedStyle(probe);
    //apply only to styles that will have colour values
    if (cls.startsWith("bg-") || cls.startsWith("from-") || cls.startsWith("via-") || cls.startsWith("to-")) {
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
  //consider a class transparent if it has no color or is explicitly transparent
  const isTransparent =
    !color ||
    color === "rgba(0, 0, 0, 0)" ||
    color === "transparent";

  return (<>
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
  </>);
}
function ClassList({ classes, removeClass }) {
  return (
    <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 4 }}>
      {classes.map((c) => (
        <span
          key={c}
          onClick={() => removeClass(c)}
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
          {c} ×
        </span>
      ))}
    </div>
  );
}

function ClassInput({ addClass }) {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);

  function getSuggestions(input) {
    if (!input.trim()) return [];

    const colonIdx = input.lastIndexOf(":");
    const prefix = colonIdx >= 0 ? input.slice(0, colonIdx + 1) : "";
    const query = colonIdx >= 0 ? input.slice(colonIdx + 1) : input;

    if (!query) return [];

    const lower = query.toLowerCase();

    const starts = tailwindClasses.filter((c) => c.startsWith(lower));
    const contains = tailwindClasses.filter(
      (c) => !c.startsWith(lower) && c.includes(lower),
    );

    return [...starts, ...contains].slice(0, 10).map((c) => prefix + c);
  }



  function commit(cls) {
    const trimmed = cls.trim();
    if (!trimmed) return;
    addClass(trimmed);
    setValue("");
    setSuggestions([]);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  }

  function handleChange(e) {
    const next = e.target.value;
    setValue(next);
    setSuggestions(getSuggestions(next));
    setHighlightedIndex(-1);
  }

  function handleKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      commit(
        highlightedIndex >= 0 && suggestions[highlightedIndex]
          ? suggestions[highlightedIndex]
          : value,
      );
    } else if (e.key === "Tab" && suggestions.length > 0) {
      e.preventDefault();
      commit(suggestions[Math.max(highlightedIndex, 0)]);
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setHighlightedIndex(-1);
    }
  }

  return (
    <div style={{ position: "relative", marginTop: 8 }}>
      <input
        ref={inputRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="search a class…"
        autoComplete="off"
        spellCheck={false}
        style={{ width: "100%", boxSizing: "border-box" }}
      />
      {suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            bottom: "100%",
            left: 0,
            right: 0,
            background: "#1a1a1a",
            border: "1px solid #555",
            borderRadius: 4,
            listStyle: "none",
            margin: 0,
            padding: 0,
            maxHeight: 200,
            overflowY: "auto",
            zIndex: 1000001,
          }}
        >
          {suggestions.map((cls, i) => (
            <li
              key={cls}
              onMouseDown={(e) => {
                e.preventDefault();
                commit(cls);
              }}
              onMouseEnter={() => setHighlightedIndex(i)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "4px 8px",
                cursor: "pointer",
                fontSize: 12,
                fontFamily: "monospace",
                background: i === highlightedIndex ? "#2563eb" : "transparent",
                color: "#fff",
              }}
            >
              <span>{cls}</span>

              {/* Tailwind preview square */}
              <div
                className={`${cls} w-4 h-4 rounded border border-gray-300 ml-2`}
                style={{ minWidth: 16, minHeight: 16 }}
              ></div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

