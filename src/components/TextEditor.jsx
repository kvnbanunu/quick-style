import { useEffect, useRef } from "react";
import { getReactSourceInfo } from "../utils/reactSourceInfo";
import ButtonEditor from "./ButtonEditor";
import { useState } from "react";

export default function TextEditor({ selected, innerText, setInnerText }) {
  const textAreaRef = useRef(null);
  const [href, setHref] = useState("");


  function removeQSSrcAttribute(el) {
    if (!el) return;
    el.removeAttribute("data-qs-src");
    el.removeAttribute("style");
    Array.from(el.children).forEach((child) => removeQSSrcAttribute(child));
  }

  async function saveText() {
    if (!selected) return;

    const formattedHtml = (innerText || "").replace(/>/g, ">\n");
    const hrefOwner = selected.hasAttribute("href")
      ? selected
      : selected.closest("[href]");

    const shouldSaveHrefOwner = hrefOwner && hrefOwner !== selected;

    let elementToSave;
    let sourceElement = selected;

    if (shouldSaveHrefOwner) {
      const hrefOwnerCopy = hrefOwner.cloneNode(true);
      const selectedKey = selected.getAttribute("data-qs-src");

      const selectedCopy = selectedKey
        ? hrefOwnerCopy.querySelector(`[data-qs-src="${selectedKey}"]`)
        : null;

      if (selectedCopy) {
        selectedCopy.innerHTML = formattedHtml;
      }

      hrefOwnerCopy.setAttribute("href", href || "");
      elementToSave = hrefOwnerCopy;
      sourceElement = hrefOwner;
    } else {
      const copy = selected.cloneNode(true);
      copy.innerHTML = formattedHtml;

      if (hrefOwner === selected) {
        copy.setAttribute("href", href || "");
      }

      elementToSave = copy;
    }

    removeQSSrcAttribute(elementToSave);
    console.log("Updated element HTML:", elementToSave.outerHTML);
    console.log(selected);

    const { fileName, lineNumber, columnNumber } = getReactSourceInfo(sourceElement);

    console.log("Source info:", { fileName, lineNumber, columnNumber });

    await fetch("/api/update-full-element", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        elementString: elementToSave.outerHTML,
        filePath: fileName,
        line_number: lineNumber,
        column_number: columnNumber + 1,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log("Backend response:", data))
      .catch(console.error);
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
          <ButtonEditor 
            selected={selected} 
            href={href}
            setHref={setHref}
          />
          <button onClick={saveText}>Save</button>
        </div>
      </div>
    )
  }
}
