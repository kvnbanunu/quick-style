import React, { useEffect, useState, useRef } from "react";
import ClassEditor from "./elementEditor";
import ElementDragger from "./elementDragger";
import ElementTraverser from "./elementTraverser";
import { getStorage, setStorage } from "./utils/sessionStorage";
import { stringToHTMLElements } from "./utils/util";
import TextEditor from "./TextEditor";

export default function QuickStyle() {
  const [init, setInit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [classes, setClasses] = useState([]);
  const [innerText, setInnerText] = useState(null);

  const hoverBoxRef = useRef(null);
  const selectBoxRef = useRef(null);

  function turnOffQuickStyle() {
    if (hoverBoxRef.current || selectBoxRef.current) {
      hoverBoxRef.current.style.display = "none";
      selectBoxRef.current.style.display = "none";

      document.removeEventListener("click", onQSClick, true);
      document.removeEventListener("mousemove", onMouseMove);
      // document.removeEventListener("contextmenu", onRightClick);
      setStorage("quick-style-isOpen", false);
    }
  }

  function turnOnQuickStyle() {
    if (hoverBoxRef.current || selectBoxRef.current) {
      document.addEventListener("click", onQSClick, true);
      document.addEventListener("mousemove", onMouseMove);
      // document.addEventListener("contextmenu", onRightClick);
      hoverBoxRef.current.style.display = "block";
      selectBoxRef.current.style.display = "block";
      setStorage("quick-style-isOpen", true);
    }
  }

  const onQSClick = React.useCallback((e) => {
    const panel = document.getElementById("quickstyle-editor");
    if (panel && panel.contains(e.target)) return;

    e.stopPropagation();
    e.preventDefault();

    // Always store the latest clicked element
    setStorage("quick-style-selected", e.target.dataset.qsSrc);
    selectElement(e.target);
  }, []);

  function onRightClick(e) {
    if (!isOpen) return;

    const panel = document.getElementById("quickstyle-editor");
    if (panel && panel.contains(e.target)) return;

    e.preventDefault(); // optional: prevents the browser menu

    setStorage("quick-style-selected", null);
    setSelected(null);
    updateSelectBox(null);
  }

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
      console.log(selectedStr);
      let selectedEl = document.querySelector(selectedStr);
      if (selectedEl) {
        setSelected(
          stringToHTMLElements(document.querySelector(selectedStr).outerHTML),
        );
      }
    }

    return () => {
      hoverBox.remove();
      selectBox.remove();
    };
  }, []);

  if (isOpen) {
    return (
      <div
        id="quickstyle-editor"
        className="border bg-black w-[28rem] max-h-[80vh] overflow-hidden z-10 rounded fixed bottom-10 right-10 flex flex-col"
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
          setSelected={setSelected}
        />
        <br />
        <TextEditor
          selected={selected}
          innerText={innerText}
          setInnerText={setInnerText}
        />
        <ElementDragger
          isOpen={isOpen}
          updateBox={updateBox}
          selected={selected}
          hoverBoxRef={hoverBoxRef}
          selectBoxRef={selectBoxRef}
        />
        <button
          onClick={() => {
            setIsOpen(false);
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
          setIsOpen(true);
        }}
        className="fixed bottom-10 right-10 z-10"
      >
        Quick Style!
      </button>
    );
  }
}
