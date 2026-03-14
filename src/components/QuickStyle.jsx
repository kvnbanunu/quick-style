import { useEffect, useState, useRef } from "react";
import ClassEditor from "./elementEditor";
import ElementDragger from "./elementDragger";
import ElementTraverser from "./elementTraverser";
import { getReactSourceInfo } from "../utils/reactSourceInfo";
import { getStorage, setStorage } from "./utils/localStorage";
import { stringToHTMLElements } from "./utils/util";

export default function QuickStyle() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [classes, setClasses] = useState([]);

  const [temp, setTemp] = useState(null);

  const hoverBoxRef = useRef(null);
  const selectBoxRef = useRef(null);



  function turnOffHoverBox() {
    if (hoverBoxRef.current) {
      hoverBoxRef.current.style.display = "none";
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("contextmenu", onRightClick);
    }
  }

  function turnOnHoverBox() {
    if (hoverBoxRef.current) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("click", onClick, true);
      document.addEventListener("contextmenu", onRightClick);
      hoverBoxRef.current.style.display = "block";
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
    if (!temp) return;
    if (typeof (temp) !== "string") return;
    if (temp.includes("<")) {
      setSelected(stringToHTMLElements(temp).root);
    }
    return;
  }, [temp]);

  useEffect(() => {
    if (!selected || !(selected instanceof Element)) return;

    setClasses((selected.getAttribute("class") || "").split(/\s+/).filter(Boolean));
    updateSelectBox(selected);
    selected.scrollIntoView({ block: "nearest", inline: "nearest" });
    return;
  }, [selected]);

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
    if (isOpen) {
      turnOnHoverBox();

    }
    setSelected(stringToHTMLElements(getStorage("selected")));

    turnOnHoverBox();


    return () => {
      hoverBox.remove();
      selectBox.remove();
    };
  }, []);




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
            turnOffHoverBox();
            setIsOpen(false);
            setStorage("isOpen", isOpen);
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
          turnOnHoverBox();
          setIsOpen(true);
          setStorage("isOpen", isOpen);
        }}
        className="absolute bottom-10 right-10 z-10"
      >
        Quick Style!
      </button>
    );
  }
}
