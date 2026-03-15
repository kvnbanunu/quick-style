import { useEffect, useRef } from "react";
import { getReactSourceInfo } from "../utils/reactSourceInfo";
import { setStorage } from "./utils/localStorage";

export default function TextEditor({ selected, innerText, setInnerText }) {
  const textAreaRef = useRef(null);

  function removeQSSrcAttribute(el) {
    if (!el) return;
    el.removeAttribute("data-qs-src");
    Array.from(el.children).forEach((child) => removeQSSrcAttribute(child));
  }

  async function saveText() {
    if (!selected) return;

    const formattedHtml = (innerText || "").replace(/>/g, ">\n");
    const copy = selected.cloneNode(true);
    copy.innerHTML = formattedHtml;
    removeQSSrcAttribute(copy);
    console.log("Updated element HTML:", copy.outerHTML);
    console.log(selected);

    const { fileName, lineNumber, columnNumber } = getReactSourceInfo(selected);

    console.log("Source info:", { fileName, lineNumber, columnNumber });

    // await fetch("/api/update-full-element", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     elementString: copy.outerHTML,
    //     filePath: fileName,
    //     line_number: lineNumber,
    //     column_number: columnNumber + 1,
    //   }),
    // })
    //   .then((res) => res.json())
    //   .then((data) => console.log("Backend response:", data))
    //   .catch(console.error);
  }

  function resizeTextarea(el) {
    if (!el) return;

    el.style.height = "auto";
    const lineHeight = parseFloat(window.getComputedStyle(el).lineHeight) || 24;
    const minHeight = lineHeight * 2;
    const maxHeight = lineHeight * 6;
    const nextHeight = Math.max(minHeight, Math.min(el.scrollHeight, maxHeight));

    el.style.height = `${nextHeight}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }

  useEffect(() => {
    if (!textAreaRef.current) return;

    resizeTextarea(textAreaRef.current);
  }, [innerText]);


  if(!selected) {
    return (<div></div>);
  } else {
    return (
      <div className="bg-blue-700 flex-1">
        Text Editor
        <div>
          <textarea
            ref={textAreaRef}
            placeholder="Edit Text..."     
            value={innerText || ""}
            onChange={(e) => {
              const value = e.target.value;
              setInnerText(value);
              if (selected) {
                selected.innerHTML = value;
                // setStorage("quick-style-selected", selected.outerHTML);
              }
            }}
            onInput={(e) => resizeTextarea(e.target)}
            rows={2}
            className="w-full resize-none overflow-y-hidden align-top bg-blue-500 rounded-2xl pl-2 leading-6"
          />
          <button onClick={saveText}>Save</button>
        </div>
      </div>
    )
  }
}
