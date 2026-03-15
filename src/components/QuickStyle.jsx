import React, { useEffect, useState, useRef } from "react";
import ClassEditor from "./elementEditor";
import ElementDragger from "./elementDragger";
import ElementTraverser from "./elementTraverser";
import { getStorage, setStorage } from "./utils/sessionStorage";
import { stringToHTMLElements } from "./utils/util";
import TextEditor from "./TextEditor";
import AttributeEditor from "./AttributeEditor";
import quickStyleIcon from "../assets/QuickStyle_Icon.png";

export default function QuickStyle() {
  const [init, setInit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [classes, setClasses] = useState([]);
  const [panelSide, setPanelSide] = useState(
    () => getStorage("editorSide") || "right",
  );
  const [innerText, setInnerText] = useState(null);
  const [edits, setEdits] = useState(new Map());
  const [openSections, setOpenSections] = useState({ traverser: true, classes: true, text: false, attributes: false });

  function toggleSection(key) {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const hoverBoxRef = useRef(null);
  const selectBoxRef = useRef(null);

  function turnOffQuickStyle() {
    if (hoverBoxRef.current || selectBoxRef.current) {
      hoverBoxRef.current.style.display = "none";
      selectBoxRef.current.style.display = "none";

      document.removeEventListener("click", onQSClick, true);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("contextmenu", onQSRightClick);
      setStorage("quick-style-isOpen", false);
    }
  }

  function turnOnQuickStyle() {
    if (hoverBoxRef.current || selectBoxRef.current) {
      document.addEventListener("click", onQSClick, true);
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("contextmenu", onQSRightClick);
      hoverBoxRef.current.style.display = "block";
      selectBoxRef.current.style.display = "block";
      setStorage("quick-style-isOpen", true);
    }
  }

  function setEditorSide(side) {
    setPanelSide(side);
    setStorage("editorSide", side);
  }
  const sideClass =
    panelSide === "left" ? "left-10 right-auto" : "right-10 left-auto";

  const onQSClick = React.useCallback((e) => {
    const panel = document.getElementById("quickstyle-editor");
    if (panel && panel.contains(e.target)) return;

    e.stopPropagation();
    e.preventDefault();

    // Always store the latest clicked element
    setStorage("quick-style-selected", e.target.dataset.qsSrc);
    selectElement(e.target);
  }, []);

  const onQSRightClick = React.useCallback((e) => {
    if (!isOpen) return;

    const panel = document.getElementById("quickstyle-editor");
    if (panel && panel.contains(e.target)) return;

    e.preventDefault(); // optional: prevents the browser menu

    setStorage("quick-style-selected", null);
    setSelected(null);
    updateSelectBox(null);
  }, []);

  function onMouseMove(e) {
    if (!isOpen) return;

    const panel = document.getElementById("quickstyle-editor");
    if (panel && panel.contains(e.target)) return;

    updateBox(e.target, hoverBoxRef.current);
  }

  function updateSelectBox(el) {
    const box = selectBoxRef.current;
    if (!box) return;

    if (!el) {
      box.style.display = "none";
      return;
    }

    if (!document.body.contains(el)) return;

    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return; // skip if size is zero

    box.style.display = "block";
    box.style.left = rect.left + window.scrollX + "px";
    box.style.top = rect.top + window.scrollY + "px";
    box.style.width = rect.width + "px";
    box.style.height = rect.height + "px";
  }

  function selectElement(el) {
    if (!el) return;

    setSelected(el);
  }

  function getElementClasses(el) {
    if (!el) return [];
    //.log("Getting classes for", el, el.getAttribute("class"));
    return (el.getAttribute("class") || "").split(/\s+/).filter(Boolean);
  }
  function updateBox(el, box) {
    if (!box) return;
    if (!el) {
      box.style.display = "none";
      return;
    }

    const rect = el.getBoundingClientRect();

    box.style.left = rect.left + window.scrollX + "px";
    box.style.top = rect.top + window.scrollY + "px";
    box.style.width = rect.width + "px";
    box.style.height = rect.height + "px";
  }

  //applies selected element classes to the quickstyle box for viewing
  useEffect(() => {
    if (!init) return;
    if (selected === null) return;
    updateSelectBox(selected);
    const syncClasses = () => {
      setClasses(getElementClasses(selected));
      setInnerText(selected.innerHTML);
    };

    syncClasses();
    const observer = new MutationObserver((mutations) => {
      const changedClass = mutations.some(
        (m) => m.type === "attributes" && m.attributeName === "class",
      );
      if (changedClass) syncClasses();
    });

    observer.observe(selected, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [selected]);

  useEffect(() => {
    if (!selected || !(selected instanceof Element)) return;

    updateSelectBox(selected);
  }, [innerText, selected]);

  useEffect(() => {
    if (!selected || !(selected instanceof Element)) return;

    updateSelectBox(selected);
  }, [innerText, selected]);

  useEffect(() => {
    if (!init) return;
    if (isOpen) {
      turnOnQuickStyle();
    } else {
      turnOffQuickStyle();
    }
  }, [isOpen]);

  useEffect(() => {
    const hoverBox = document.createElement("div");
    const selectBox = document.createElement("div");

    hoverBox.style.position = "absolute";
    hoverBox.style.border = "2px dashed red";
    hoverBox.style.pointerEvents = "none";
    hoverBox.style.zIndex = 999998;

    selectBox.style.position = "absolute";
    selectBox.style.border = "2px solid blue";
    selectBox.style.pointerEvents = "none";
    selectBox.style.zIndex = 999999;

    document.body.appendChild(hoverBox);
    document.body.appendChild(selectBox);

    hoverBoxRef.current = hoverBox;
    selectBoxRef.current = selectBox;

    const isOpenStore = getStorage("quick-style-isOpen");
    const isOpenVal = isOpenStore === true || isOpenStore === "true";
    let selectedStore = null;

    if (isOpenVal) {
      selectedStore = getStorage("quick-style-selected");
    }

    setInit(true);

    setIsOpen(isOpenVal);
    if (selectedStore !== null && selectedStore !== undefined) {
      const selectedStr = `[data-qs-src="${selectedStore}"]`;
      let selectedEl = document.querySelector(selectedStr);
      if (selectedEl) {
        setSelected(
          stringToHTMLElements(document.querySelector(selectedStr).outerHTML),
        );
      }
    }

    const editStore = getStorage("quick-style-edits");
    if (editStore !== null) {
      const editMap = new Map(JSON.parse(editStore));
      setEdits(editMap);
      applyTempEdits();
    }

    return () => {
      hoverBox.remove();
      selectBox.remove();
    };
  }, []);

  useEffect(() => {
    if (!init) return;
    applyTempEdits();
  }, [edits]);

  function applyTempEdits() {
    if (edits.size === 0) return;

    for (const [element, classList] of edits) {
      const el = document.querySelector(`[data-qs-src="${element}"]`);
      if (el) {
        const thisEl = stringToHTMLElements(el.outerHTML);
        thisEl.setAttribute("class", classList.join(" "));
      }
    }
  }

  if (isOpen) {
    return (
      <div
        id="quickstyle-editor"
        className={`bg-zinc-900 border border-zinc-700/60 shadow-2xl shadow-black/60 w-80 max-h-[80vh] overflow-hidden z-[99999] rounded-2xl fixed bottom-6 ${sideClass} flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <img
              src={quickStyleIcon}
              alt="Quick Style"
              className="w-7 h-7 rounded-lg"
            />
            <span className="text-sm font-semibold text-white tracking-wide">
              Quick Style
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setEditorSide("left")}
              title="Dock left"
              className="px-2 py-1 text-xs text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors cursor-pointer"
            >
              ← Left
            </button>
            <button
              type="button"
              onClick={() => setEditorSide("right")}
              title="Dock right"
              className="px-2 py-1 text-xs text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors cursor-pointer"
            >
              Right →
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-zinc-700/40">

          

            {/* Element Traverser */ }
            < div >
            <button
              type="button"
              onClick={() => toggleSection("traverser")}
              className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors cursor-pointer"
            >
              <span className="uppercase tracking-widest">Element</span>
              <span className={`transition-transform duration-200 ${openSections.traverser ? "rotate-180" : ""}`}>▾</span>
            </button>
            {openSections.traverser && (
            <div className="px-3 pb-3">
              <ElementTraverser
                selected={selected}
                selectElement={selectElement}
                hoverBoxRef={hoverBoxRef}
                selectBoxRef={selectBoxRef}
              />
            </div>
          )}
        </div>

        {/* Class Editor */}
        <div>
          <button
            type="button"
            onClick={() => toggleSection("classes")}
            className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors cursor-pointer"
          >
            <span className="uppercase tracking-widest">Classes</span>
            <span className={`transition-transform duration-200 ${openSections.classes ? "rotate-180" : ""}`}>▾</span>
          </button>
          {openSections.classes && (
            <div className="px-3 pb-3">
              <ClassEditor
                classes={classes}
                selected={selected}
                setClasses={setClasses}
              />
            </div>
          )}
        </div>

        {/* Text Editor */}
        <div>
          <button
            type="button"
            onClick={() => toggleSection("text")}
            className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors cursor-pointer"
          >
            <span className="uppercase tracking-widest">Text</span>
            <span className={`transition-transform duration-200 ${openSections.text ? "rotate-180" : ""}`}>▾</span>
          </button>
          {openSections.text && (
            <div className="px-3 pb-3">
              <TextEditor
                selected={selected}
                innerText={innerText}
                setInnerText={setInnerText}
                setSelected={setSelected}
              />
            </div>
          )}
        </div>

        {/* Attribute Editor */}
        <div>
          <button
            type="button"
            onClick={() => toggleSection("attributes")}
            className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors cursor-pointer"
          >
            <span className="uppercase tracking-widest">Attributes</span>
            <span className={`transition-transform duration-200 ${openSections.attributes ? "rotate-180" : ""}`}>▾</span>
          </button>
          {openSections.attributes && (
            <div className="px-3 pb-3">
              <AttributeEditor selected={selected} />
            </div>
          )}
        </div>

      </div>

        {/* Footer */ }
    <div className="shrink-0 border-t border-zinc-700/60">
      <button
        type="button"
        onClick={() => setIsOpen(false)}
        className="w-full py-2 text-xs text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
      >
        Close
      </button>
    </div>
      </div >
    );
  } else {
    return (
      <img
        id="quickstyle-editor"
        src={quickStyleIcon}
        alt="Open Quick Style editor"
        className={`w-12 h-12 rounded-2xl fixed bottom-6 ${sideClass} z-[99999] cursor-pointer shadow-lg hover:scale-105 transition-transform`}
        onClick={() => setIsOpen(true)}
      />
    );
  }
}
