import ColorSwatch from "./ColorSwatch";

export default function ClassPillList({ classes, onRemoveClass }) {
  return (
    <div className="mt-1 flex flex-wrap gap-2">
      {classes.map((c) => (
        <span
          key={c}
          onClick={() => onRemoveClass(c)}
          className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs text-zinc-200 cursor-pointer hover:bg-zinc-700 hover:text-white transition-colors"
        >
          <ColorSwatch cls={c} />
          {c} ×
        </span>
      ))}
    </div>
  );
}