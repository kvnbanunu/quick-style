import { useState } from "react";
import { getReactSourceInfo } from "../utils/reactSourceInfo";

export default function AttributeEditor({ selected }) {
  const [attributeName, setAttributeName] = useState("");
  const [attributeValue, setAttributeValue] = useState("");

  const filteredAttributes = selected
    ? Array.from(selected.attributes).filter(
      (attribute) =>
        !["class", "className", "href", "data-qs-src"].includes(
          attribute.name,
        ),
    )
    : [];

  function removeQSSrcAttribute(el) {
    if (!el) return;
    el.removeAttribute("data-qs-src");
    el.removeAttribute("style");
    Array.from(el.children).forEach((child) => removeQSSrcAttribute(child));
  }

  async function persistElement(element) {
    const copy = element.cloneNode(true);
    removeQSSrcAttribute(copy);

    const { fileName, lineNumber, columnNumber } = getReactSourceInfo(element) || {};

    await fetch("/api/update-full-element", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        elementString: copy.outerHTML,
        filePath: fileName,
        line_number: lineNumber,
        column_number: columnNumber + 1,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log("Backend response:", data))
      .catch(console.error);
  }

  async function saveAttribute() {
    const trimmedName = attributeName.trim();
    if (!selected || !trimmedName) return;

    selected.setAttribute(trimmedName, attributeValue);
    await persistElement(selected);
  }

  async function removeAttribute(attributeNameToRemove) {
    if (!selected) return;

    selected.removeAttribute(attributeNameToRemove);
    await persistElement(selected);
  }

  function resizeTextarea(el) {
    if (!el) return;

    el.style.height = "auto";
    const lineHeight = parseFloat(window.getComputedStyle(el).lineHeight) || 24;
    const minHeight = lineHeight;
    const maxHeight = lineHeight * 4;
    const nextHeight = Math.max(minHeight, Math.min(el.scrollHeight, maxHeight));

    el.style.height = `${nextHeight}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }

  if (!selected) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <textarea
          type="text"
          placeholder="Attribute name"
          value={attributeName}
          onChange={(e) => setAttributeName(e.target.value)}
          onInput={(e) => resizeTextarea(e.target)}
          rows={1}
          className="w-full resize-none overflow-y-hidden bg-zinc-800 text-zinc-100 placeholder-zinc-600 border border-zinc-700 rounded-lg px-2 py-1.5 text-sm leading-5 focus:outline-none focus:border-zinc-500 transition-colors"
        />
        <textarea
          type="text"
          placeholder="Attribute value"
          value={attributeValue}
          onChange={(e) => setAttributeValue(e.target.value)}
          onInput={(e) => resizeTextarea(e.target)}
          rows={1}
          className="w-full resize-none overflow-y-hidden bg-zinc-800 text-zinc-100 placeholder-zinc-600 border border-zinc-700 rounded-lg px-2 py-1.5 text-sm leading-5 focus:outline-none focus:border-zinc-500 transition-colors"
        />
      </div>

      <div>
        <button
          type="button"
          onClick={saveAttribute}
          className="w-full py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer"
        >
          Save Attribute
        </button>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-zinc-500 uppercase tracking-widest">
          Current Attributes
        </p>
        {filteredAttributes.length === 0 ? (
          <p className="text-xs text-zinc-500 italic">
            No extra attributes on this element.
          </p>
        ) : (
          filteredAttributes.map((attribute) => (
            <div
              key={attribute.name}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 flex items-start justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <div className="text-xs text-zinc-500">{attribute.name}</div>
                <div className="break-words text-sm text-zinc-200">
                  {attribute.value || "(empty)"}
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeAttribute(attribute.name)}
                className="shrink-0 px-2.5 py-1 text-xs font-medium text-zinc-300 bg-zinc-900 border border-zinc-700 rounded-lg hover:bg-zinc-700 hover:text-white transition-colors cursor-pointer"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}