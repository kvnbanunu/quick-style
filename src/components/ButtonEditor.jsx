import { useEffect } from "react";

export default function ButtonEditor({ selected, href, setHref }) {
  function getHrefTarget(el) {
    if (!el || !(el instanceof Element)) return null;
    if (el.hasAttribute("href")) return el;

    return el.closest("[href]");
  }

  useEffect(() => {
    const hrefTarget = getHrefTarget(selected);
    if (!hrefTarget) {
      setHref("");
      return;
    }

    setHref(hrefTarget.getAttribute("href") || "");
  }, [selected, setHref]);

  if (!selected) return null;

  const hrefTarget = getHrefTarget(selected);

  if (!hrefTarget) return null;

  return (
    <div>
      <div className="text-xs text-zinc-500 mb-1">href</div>
      <textarea
        placeholder="Edit href..."
        value={href || ""}
        onChange={(e) => {
          const value = e.target.value;
          setHref(value);
          hrefTarget.setAttribute("href", value);
        }}
        rows={1}
        className="w-full resize-none bg-zinc-800 text-zinc-100 placeholder-zinc-600 border border-zinc-700 rounded-lg px-2 py-1.5 text-sm leading-5 focus:outline-none focus:border-zinc-500 transition-colors"
      />
    </div>
  );
}