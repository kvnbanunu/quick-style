import { useEffect, useState, useRef } from "react";
import ClassEditor from "./elementEditor";
import ElementDragger from "./elementDragger";
import ElementTextEditor from "./elementTextEditor";


export default function QuickStyle() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [classes, setClasses] = useState([]);

  const hoverBoxRef = useRef(null);
  const selectBoxRef = useRef(null);

  function turnOffHoverBox() {
    if (hoverBoxRef.current) {
      hoverBoxRef.current.style.display = "none";
    }
  }

  function turnOnHoverBox() {
    if (hoverBoxRef.current) {
      hoverBoxRef.current.style.display = "block";
    }
  }

  function updateSelectBox(el) {
    const box = selectBoxRef.current;
    if (!box) return;

    if (!el) {
      box.style.display = "none";
      return;
    }

    const rect = el.getBoundingClientRect();

    box.style.display = "block";
    box.style.left = rect.left + window.scrollX + "px";
    box.style.top = rect.top + window.scrollY + "px";
    box.style.width = rect.width + "px";
    box.style.height = rect.height + "px";
  }

  function selectElement(el) {
    if (!el) return;

    setSelected(el);
    setClasses((el.getAttribute("class") || "").split(/\s+/).filter(Boolean));
    updateSelectBox(el);
    el.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  function getSelectableElements() {
    const panel = document.getElementById("quickstyle-editor");

    return Array.from(document.body.querySelectorAll("*")).filter((el) => {
      if (!(el instanceof HTMLElement)) return false;
      if (panel && panel.contains(el)) return false;
      if (el === hoverBoxRef.current || el === selectBoxRef.current) return false;
      if (["HTML", "BODY", "HEAD", "SCRIPT", "STYLE", "LINK", "META"].includes(el.tagName)) return false;

      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
  }

  function buildNearestVisualOrder(elements) {
    if (elements.length <= 1) return elements;

    const centers = new Map(
      elements.map((el) => {
        const rect = el.getBoundingClientRect();
        return [el, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }];
      })
    );

    const remaining = [...elements].sort((a, b) => {
      const aCenter = centers.get(a);
      const bCenter = centers.get(b);
      return aCenter.y - bCenter.y || aCenter.x - bCenter.x;
    });

    const ordered = [remaining.shift()];

    while (remaining.length > 0) {
      const last = ordered[ordered.length - 1];
      const lastCenter = centers.get(last);

      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      for (let i = 0; i < remaining.length; i += 1) {
        const candidateCenter = centers.get(remaining[i]);
        const dx = candidateCenter.x - lastCenter.x;
        const dy = candidateCenter.y - lastCenter.y;
        const distance = dx * dx + dy * dy;

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = i;
        }
      }

      ordered.push(remaining.splice(nearestIndex, 1)[0]);
    }

    return ordered;
  }

  function cycleSelection(direction) {
    const orderedElements = buildNearestVisualOrder(getSelectableElements());
    if (orderedElements.length === 0) return;

    const currentIndex = selected ? orderedElements.indexOf(selected) : -1;
    const nextIndex =
      currentIndex === -1
        ? direction === 1
          ? 0
          : orderedElements.length - 1
        : (currentIndex + direction + orderedElements.length) % orderedElements.length;

    selectElement(orderedElements[nextIndex]);
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

  useEffect(() => {
    if (!isOpen) return;

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


    function onRightClick(e) {
      const panel = document.getElementById("quickstyle-editor");
      if (panel && panel.contains(e.target)) return;

      e.preventDefault(); // optional: prevents the browser menu

      setSelected(null);
      updateSelectBox(null);
    }

    function onMouseMove(e) {
      const panel = document.getElementById("quickstyle-editor");
      if (panel && panel.contains(e.target)) return;

      updateBox(e.target, hoverBoxRef.current);
    }

    function onClick(e) {
      const panel = document.getElementById("quickstyle-editor");
      if (panel && panel.contains(e.target)) return;

      e.preventDefault();
      e.stopPropagation();

      selectElement(e.target);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("click", onClick, true);
    document.addEventListener("contextmenu", onRightClick);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("contextmenu", onRightClick);

      hoverBox.remove();
      selectBox.remove();
    };
  }, [isOpen]);


  if (isOpen) {

    return (
      <div
        id="quickstyle-editor"
        className="border bg-black w-md h-md min-h-48 z-10 rounded absolute bottom-10 right-10 flex flex-col justify-between"
      >
        <p className="text-lg">Quick Style Editor</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => cycleSelection(-1)}>
            Prev element
          </button>
          <button type="button" onClick={() => cycleSelection(1)}>
            Next element
          </button>
        </div>
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
        <ElementTextEditor/>
        <button
          onClick={() => {
            turnOffHoverBox();
            setIsOpen(false);
          }}
        >
          Close
        </button>
      </div>
    );
  } else {
    return (
      <button id="quickstyle-editor"
        onClick={() => {
          turnOnHoverBox();
          setIsOpen(true);
        }}
        className="absolute bottom-10 right-10 z-10"
      >
        Quick Style!
      </button>
    );
  }
}