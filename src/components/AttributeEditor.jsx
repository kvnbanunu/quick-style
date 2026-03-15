import { useState } from "react";
import { getReactSourceInfo } from "../utils/reactSourceInfo";

export default function AttributeEditor({ selected }) {
  const [attributeName, setAttributeName] = useState("");
  const [attributeValue, setAttributeValue] = useState("");

  async function saveAttribute() {
    const trimmedName = attributeName.trim();
    if (!selected || !trimmedName) return;

    let copy = selected.cloneNode(true);
    copy.setAttribute(trimmedName, attributeValue);

    const { fileName, lineNumber, columnNumber } = getReactSourceInfo(selected) || {};

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
    </div>
  );
}