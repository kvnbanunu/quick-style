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

  if(!selected) {
    return (
      <div></div>
    )
  }

  const hrefTarget = getHrefTarget(selected);

  if (!hrefTarget) {
    return <div></div>;
  }

  return (
    <div>
      href Editor
      <textarea
        placeholder="Edit href..."
        value={href || ""}
        onChange={(e) => {
          const value = e.target.value;
          setHref(value);
          hrefTarget.setAttribute("href", value);
        }}
        rows={1}
        className="w-full resize-none overflow-y-hidden align-top bg-blue-500 rounded-2xl pl-2 leading-6"
      />
    </div>
  );
}