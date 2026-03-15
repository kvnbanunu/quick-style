import { useEffect, useState } from "react";
import { getReactSourceInfo } from "../utils/reactSourceInfo";
import ButtonEditor from "./ButtonEditor";
import { storeEdit, storeChange } from "./utils/sessionStorage";

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

export default function TextEditor({ selected, setInnerText, setSelected }) {
  const [href, setHref] = useState("");
  const [textNodes, setTextNodes] = useState([]);
  const [newChildTag, setNewChildTag] = useState("div");

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

      const key = selected.dataset.qsSrc;
      storeEdit("quick-style-edits", key, "editText", {
        path: path,
        innerHTML: selected.innerHTML,
        value: value,
      });

      const copy = selected.cloneNode(true);
      removeQSSrcAttribute(copy);
      const src = getReactSourceInfo(selected);
      storeChange("quick-style-changes", key, "changeFull", {
        elementString: copy.outerHTML,
        filePath: src.fileName,
        line_number: src.lineNumber,
        column_number: src.columnNumber + 1,
      });
    }
  }

  function removeQSSrcAttribute(el) {
    if (!el) return;
    el.removeAttribute("data-qs-src");
    el.removeAttribute("style");
    Array.from(el.children).forEach((child) => removeQSSrcAttribute(child));
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

    // selected.appendChild(child);
    // setInnerText(selected.innerHTML);
    // setTextNodes(collectEditableTextNodes(selected));
    parent.appendChild(child);
    setInnerText(parent.innerHTML);
    await persistElement(selected, selected);

    setSelected(child);
  }

  useEffect(() => {
    if (!selected) {
      setTextNodes([]);
      return;
    }

    setTextNodes(collectEditableTextNodes(selected));
  }, [selected]);

  if (!selected) {
    return <div></div>;
  }

  return (
    <div className="bg-blue-700 flex-1">
      Text Editor
      <div>
        {textNodes.length === 0 ? (
          <p className="text-sm">
            No editable text nodes found in this element.
          </p>
        ) : (
          textNodes.map((node, index) => (
            <div key={node.id} className="mb-2">
              <div className="text-xs opacity-80">
                Text node {index + 1} in {node.label}
              </div>
              <textarea
                placeholder="Edit text..."
                value={node.value}
                onChange={(e) =>
                  handleTextNodeChange(node.path, e.target.value)
                }
                rows={2}
                className="w-full min-h-12 max-h-36 resize-y overflow-y-auto align-top bg-blue-500 rounded-2xl pl-2 leading-6"
              />
            </div>
          ))
        )}

        <div className="mt-2 flex items-center gap-2">
          <select
            value={newChildTag}
            onChange={(e) => setNewChildTag(e.target.value)}
            className="rounded border border-slate-400 bg-black px-2 py-1 text-white"
          >
            {CHILD_ELEMENT_OPTIONS.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={createChildElement}
            className="rounded border border-slate-400 bg-black px-3 py-1 text-white"
          >
            Create Child
          </button>
        </div>

        <ButtonEditor selected={selected} href={href} setHref={setHref} />
      </div>
    </div>
  );
}

export function getNodeByPath(root, path) {
  let current = root;
  for (const index of path) {
    if (!current || !current.childNodes || !current.childNodes[index])
      return null;
    current = current.childNodes[index];
  }

  return current;
}
