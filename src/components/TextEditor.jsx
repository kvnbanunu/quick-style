import { useEffect, useState } from "react";
import { getReactSourceInfo } from "../utils/reactSourceInfo";
import ButtonEditor from "./ButtonEditor";

export default function TextEditor({ selected, innerText, setInnerText }) {
  const [href, setHref] = useState("");
  const [textNodes, setTextNodes] = useState([]);

  function getNodePath(node, ancestor) {
    const path = [];
    let current = node;

    while (current && current !== ancestor) {
      const parent = current.parentNode;
      if (!parent) return null;

      path.unshift(Array.prototype.indexOf.call(parent.childNodes, current));
      current = parent;
    }

    return current === ancestor ? path : null;
  }

  function getNodeByPath(root, path) {
    let current = root;
    for (const index of path) {
      if (!current || !current.childNodes || !current.childNodes[index]) return null;
      current = current.childNodes[index];
    }

    return current;
  }

  function collectEditableTextNodes(root) {
    if (!root) return [];

    const collected = [];

    const walk = (node, path = []) => {
      const children = Array.from(node.childNodes || []);

      children.forEach((child, index) => {
        const nextPath = [...path, index];

        if (child.nodeType === Node.TEXT_NODE) {
          const value = child.textContent || "";
          if (value.trim().length > 0) {
            const parentTag = child.parentElement?.tagName?.toLowerCase() || "node";
            collected.push({
              id: nextPath.join("."),
              path: nextPath,
              value,
              label: `<${parentTag}>`,
            });
          }
          return;
        }

        if (child.nodeType === Node.ELEMENT_NODE) {
          walk(child, nextPath);
        }
      });
    };

    walk(root);
    return collected;
  }

  function handleTextNodeChange(path, value) {
    if (!selected) return;

    setTextNodes((prev) =>
      prev.map((node) =>
        node.path.join(".") === path.join(".") ? { ...node, value } : node,
      ),
    );

    const liveNode = getNodeByPath(selected, path);
    if (liveNode && liveNode.nodeType === Node.TEXT_NODE) {
      liveNode.textContent = value;
      setInnerText(selected.innerHTML);
    }
  }

  function removeQSSrcAttribute(el) {
    if (!el) return;
    el.removeAttribute("data-qs-src");
    el.removeAttribute("style");
    Array.from(el.children).forEach((child) => removeQSSrcAttribute(child));
  }

  async function saveText() {
    if (!selected) return;

    const formattedHtml = (selected.innerHTML || "").replace(/>/g, ">\n");
    const hrefOwner = selected.hasAttribute("href")
      ? selected
      : selected.closest("[href]");

    const shouldSaveHrefOwner = hrefOwner && hrefOwner !== selected;

    let elementToSave;
    let sourceElement = selected;

    if (shouldSaveHrefOwner) {
      const hrefOwnerCopy = hrefOwner.cloneNode(true);
      const selectedPath = getNodePath(selected, hrefOwner);
      const selectedCopy = selectedPath ? getNodeByPath(hrefOwnerCopy, selectedPath) : null;

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

  useEffect(() => {
    if (!selected) {
      setTextNodes([]);
      return;
    }

    setTextNodes(collectEditableTextNodes(selected));
  }, [selected]);


  if(!selected) {
    return (<div></div>);
  } else {
    return (
      <div className="bg-blue-700 flex-1">
        Text Editor
        <div>
          {textNodes.length === 0 ? (
            <p className="text-sm">No editable text nodes found in this element.</p>
          ) : (
            textNodes.map((node, index) => (
              <div key={node.id} className="mb-2">
                <div className="text-xs opacity-80">Text node {index + 1} in {node.label}</div>
                <textarea
                  placeholder="Edit text..."
                  value={node.value}
                  onChange={(e) => handleTextNodeChange(node.path, e.target.value)}
                  rows={2}
                  className="w-full min-h-12 max-h-36 resize-y overflow-y-auto align-top bg-blue-500 rounded-2xl pl-2 leading-6"
                />
              </div>
            ))
          )}
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
