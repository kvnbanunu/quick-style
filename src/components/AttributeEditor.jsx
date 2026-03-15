import { useState } from "react";
import { getReactSourceInfo } from "../utils/reactSourceInfo";

export default function AttributeEditor({ selected }) {
  const [attributeName, setAttributeName] = useState("");
  const [attributeValue, setAttributeValue] = useState("");

  const filteredAttributes = selected
    ? Array.from(selected.attributes).filter(
      (attribute) =>
        !["class", "className", "href", "data-qs-src", "data-qc-src"].includes(
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

  if (!selected) {
    return <div></div>;
  }
  return (
    <div className="bg-blue-700 flex-1 p-2">
      <p>Attribute Editor</p>
      <div className="mt-2 flex flex-row items-center justify-center gap-10">
        <input
          type="text"
          placeholder="Attribute name"
          value={attributeName}
          onChange={(e) => setAttributeName(e.target.value)}
          className="w-40 py-1 bg-blue-500 rounded-2xl text-center"
        />
        <input
          type="text"
          placeholder="Attribute value"
          value={attributeValue}
          onChange={(e) => setAttributeValue(e.target.value)}
          className="w-40 py-1 bg-blue-500 rounded-2xl text-center"
        />
      </div>
      <div className="mt-3 flex justify-center">
        <button
          onClick={saveAttribute}
          className="px-4 py-1 bg-blue-500 rounded-2xl"
        >
          Save
        </button>
      </div>
      <div className="mt-4 space-y-2">
        <p>Current Attributes</p>
        {filteredAttributes.length === 0 ? (
          <p className="text-sm">No extra attributes on this element.</p>
        ) : (
          filteredAttributes.map((attribute) => (
            <div
              key={attribute.name}
              className="bg-blue-500 rounded-2xl px-3 py-2 text-sm flex items-center justify-between gap-2"
            >
              <span>{attribute.name}: {attribute.value}</span>
              <button
                onClick={() => removeAttribute(attribute.name)}
                className="px-2 py-1 bg-blue-700 rounded-xl"
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