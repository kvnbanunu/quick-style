import { useEffect, useState } from "react";
import { getReactSourceInfo } from "../utils/reactSourceInfo";
import ButtonEditor from "./ButtonEditor";

const CHILD_ELEMENT_OPTIONS = [
  "div",
  "p",
  "span",
  "button",
  "section",
  "article",
  "ul",
  "li",
  "a",
];

const VOID_TAGS = new Set(["img", "input", "br", "hr", "meta", "link"]);

export default function TextEditor({
  selected,
  innerText,
  setInnerText,
  setSelected,
}) {
  const [href, setHref] = useState("");
  const [textNodes, setTextNodes] = useState([]);
  const [newChildTag, setNewChildTag] = useState("div");
  const [childInsertPosition, setChildInsertPosition] = useState("end");

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
      if (!current || !current.childNodes || !current.childNodes[index])
        return null;
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
            const parentTag =
              child.parentElement?.tagName?.toLowerCase() || "node";
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

  async function persistElement(sourceElement, elementToSave) {
    const copy = elementToSave.cloneNode(true);
    removeQSSrcAttribute(copy);

    const sourceInfo = getReactSourceInfo(sourceElement);
    if (!sourceInfo) return;

    const { fileName, lineNumber, columnNumber } = sourceInfo;

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

  async function saveText() {
    if (!selected) return;

    const formattedHtml = (selected.innerHTML || "").replace(/>/g, ">\n");
    const hrefOwner = selected.hasAttribute("href")
      ? selected
      : selected.closest("[href]");

    const shouldSaveHrefOwner = hrefOwner && hrefOwner !== selected;

    let elementToSave = selected;
    let sourceElement = selected;

    if (shouldSaveHrefOwner) {
      const hrefOwnerCopy = hrefOwner.cloneNode(true);
      const selectedPath = getNodePath(selected, hrefOwner);
      const selectedCopy = selectedPath
        ? getNodeByPath(hrefOwnerCopy, selectedPath)
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

    await persistElement(sourceElement, elementToSave);
  }

  async function createChildElement() {
    if (!selected) return;

    const parent = selected;
    const child = document.createElement(newChildTag);

    child.className = "bg-white border border-black text-black p-2";

    if (newChildTag === "a") {
      child.setAttribute("href", "#");
    }

    if (newChildTag === "img") {
      child.setAttribute("alt", "New image");
      child.setAttribute(
        "src",
        "https://via.placeholder.com/120x80?text=Image",
      );
      child.className = "bg-white border border-black";
    } else if (!VOID_TAGS.has(newChildTag)) {
      child.textContent = `New ${newChildTag}`;
    }

    if (childInsertPosition === "start") {
      parent.insertBefore(child, parent.firstChild);
    } else {
      parent.appendChild(child);
    }

    setInnerText(parent.innerHTML);
    await persistElement(selected, selected);

    setSelected(child);
  }

  // 6 lines × 20px line-height + 12px vertical padding (py-1.5 = 6px × 2)
  const MAX_TEXTAREA_HEIGHT = 6 * 20 + 12;

  function autoResize(el) {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT) + "px";
  }

  useEffect(() => {
    if (!selected) {
      setTextNodes([]);
      return;
    }

    setTextNodes(collectEditableTextNodes(selected));
  }, [selected]);

  if (!selected) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">

      {/* Text nodes */}
      {textNodes.length === 0 ? (
        <p className="text-xs text-zinc-500 italic">No editable text nodes found.</p>
      ) : (
        textNodes.map((node, index) => (
          <div key={node.id}>
            <div className="text-xs text-zinc-500 mb-1">
              Text {index + 1} in <span className="text-zinc-400">{node.label}</span>
            </div>
            <textarea
              placeholder="Edit text..."
              value={node.value}
              ref={(el) => autoResize(el)}
              onChange={(e) => {
                handleTextNodeChange(node.path, e.target.value);
                autoResize(e.target);
              }}
              rows={1}
              className="w-full resize-none overflow-y-auto bg-zinc-800 text-zinc-100 placeholder-zinc-600 border border-zinc-700 rounded-lg px-2 py-1.5 text-sm leading-5 focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>
        ))
      )}

      {/* Href editor */}
      <ButtonEditor selected={selected} href={href} setHref={setHref} />

      {/* Add child element */}
      <div className="flex items-center gap-2">
        <select
          value={newChildTag}
          onChange={(e) => setNewChildTag(e.target.value)}
          className="flex-1 bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-zinc-500 cursor-pointer transition-colors"
        >
          {CHILD_ELEMENT_OPTIONS.map((tag) => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
        <select
          value={childInsertPosition}
          onChange={(e) => setChildInsertPosition(e.target.value)}
          className="bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-zinc-500 cursor-pointer transition-colors"
        >
          <option value="start">Beginning</option>
          <option value="end">End</option>
        </select>
        <button
          type="button"
          onClick={createChildElement}
          className="px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
        >
          + Child
        </button>
      </div>

      {/* Save */}
      <button
        type="button"
        onClick={saveText}
        className="w-full py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer"
      >
        Save Text
      </button>

    </div>
  );
}

