import { useEffect, useState, useRef } from "react";
import ClassEditor from "./elementEditor";
import ElementDragger from "./elementDragger";
import ElementTraverser from "./elementTraverser";
import { getReactSourceInfo } from "../utils/reactSourceInfo";
import { clearStorage, getStorage, setStorage } from "./utils/localStorage";
import { stringToHTMLElements } from "./utils/util";

export default function QuickStyle() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [classes, setClasses] = useState([]);

  const hoverBoxRef = useRef(null);
  const selectBoxRef = useRef(null);

  function turnOffQuickStyle() {
    if (hoverBoxRef.current && selectBoxRef.current) {
      hoverBoxRef.current.style.display = "none";
      selectBoxRef.current.style.display = "none";
      console.log(selectBoxRef.current.style.display);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("contextmenu", onRightClick);
      setIsOpen(false);
      setStorage("isOpen", false);
    }
  }

  function turnOnQuickStyle() {
    if (hoverBoxRef.current && selectBoxRef.current) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("click", onClick, true);
      document.addEventListener("contextmenu", onRightClick);
      hoverBoxRef.current.style.display = "block";
      selectBoxRef.current.style.display = "block";
      setIsOpen(true);
      setStorage("isOpen", true);
    }
  }

  function onClick(e) {
    const panel = document.getElementById("quickstyle-editor");
    if (panel && panel.contains(e.target)) return;

    e.preventDefault();
    e.stopPropagation();

    // Always store the latest clicked element
    setStorage("selected", e.target.outerHTML);
    selectElement(e.target);
  }

  function onRightClick(e) {
    const panel = document.getElementById("quickstyle-editor");
    if (panel && panel.contains(e.target)) return;

    e.preventDefault(); // optional: prevents the browser menu

    setStorage("selected", null);
    setSelected(null);
    updateSelectBox(null);
  }

  function onMouseMove(e) {
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

    // example for REESE
    const { fileName, lineNumber, columnNumber } = getReactSourceInfo(el);
    console.log(fileName);
    console.log(lineNumber);
    console.log(columnNumber);

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
    if (!selected) return;

    const syncClasses = () => {
      setClasses(getElementClasses(selected));
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

    setClasses(
      (selected.getAttribute("class") || "").split(/\s+/).filter(Boolean),
    );
    updateSelectBox(selected);
    selected.scrollIntoView({ block: "nearest", inline: "nearest" });
    return;
  }, [selected]);

  useEffect(() => {
    if (isOpen) {
      setSelected(stringToHTMLElements(getStorage("selected")));
      turnOnQuickStyle();
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

    setIsOpen(getStorage("isOpen"));

    return () => {
      hoverBox.remove();
      selectBox.remove();
    };
  }, []);

  // clear localStorage on app shutdown
  if (import.meta.hot) {
    import.meta.hot.on("vite:ws:disconnect", clearStorage());
  }

  if (isOpen) {
    return (
      <div
        id="quickstyle-editor"
        className="border bg-black w-md h-md min-h-48 z-10 rounded absolute bottom-10 right-10 flex flex-col justify-between"
      >
        <p className="text-lg">Quick Style Editor</p>
        <ElementTraverser
          selected={selected}
          selectElement={selectElement}
          hoverBoxRef={hoverBoxRef}
          selectBoxRef={selectBoxRef}
        />
        <ClassEditor
          classes={classes}
          selected={selected}
          setClasses={setClasses}
        />
        <ElementDragger
          updateBox={updateBox}
          selected={selected}
          hoverBoxRef={hoverBoxRef}
          selectBoxRef={selectBoxRef}
        />
        <button
          onClick={() => {
            turnOffQuickStyle();
          }}
        >
          Close
        </button>
      </div>
    );
  } else {
    return (
      <button
        id="quickstyle-editor"
        onClick={() => {
          turnOnQuickStyle();
          setIsOpen(true);
          setStorage("isOpen", true);
        }}
        className="absolute bottom-10 right-10 z-10"
      >
        Quick Style!
      </button>
    );
  }
}
