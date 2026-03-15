import { useRef, useState } from "react";

export default function TailwindClassInput({ allClasses, onAddClass }) {
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

    const starts = allClasses.filter((c) => c.startsWith(lower));
    const contains = allClasses.filter(
      (c) => !c.startsWith(lower) && c.includes(lower)
    );
    return [...starts, ...contains].slice(0, 10).map((c) => prefix + c);
  }

  function commit(cls) {
    const trimmed = cls.trim();
    if (!trimmed) return;

    onAddClass(trimmed);
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
        setValue(null)
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
    <div className="relative mt-1">
      <input
        ref={inputRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="search a class..."
        autoComplete="off"
        spellCheck={false}
        className="h-9 w-full box-border rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
      />
      {suggestions.length > 0 && (
        <ul
          className="absolute bottom-full left-0 right-0 z-[1000001] mb-1 max-h-52 overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-900 p-1 shadow-xl shadow-black/40"
        >
          {suggestions.map((cls, i) => (
            <li
              key={cls}
              onMouseDown={(e) => {
                e.preventDefault();
                commit(cls);
              }}
              onMouseEnter={() => setHighlightedIndex(i)}
              className={`flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-xs text-white ${i === highlightedIndex ? "bg-blue-600" : "bg-transparent hover:bg-zinc-800"}`}
            >
              <span>{cls}</span>
              <div
                className={`${cls} w-4 h-4 rounded border border-gray-300 ml-2`}
                style={{ minWidth: 16, minHeight: 16 }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}