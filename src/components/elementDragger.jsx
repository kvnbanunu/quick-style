import { useEffect, useRef } from "react";

export default function ElementDragger({ updateBox, selected, hoverBoxRef, selectBoxRef }) {

  const draggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {

    function onMouseDown(e) {
      if (!selected) return;
      if (e.target !== selected) return;
      if (e.target.tagName === "BODY") return;


      draggingRef.current = true;

      const rect = selected.getBoundingClientRect();

      offsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      const parent = selected.parentElement;
      const isLayoutRoot =
        parent === document.body ||
        parent === document.documentElement ||
        parent?.id === "root";
      if (parent instanceof HTMLElement && !isLayoutRoot) {
        const parentStyle = window.getComputedStyle(parent);
        const parentRect = parent.getBoundingClientRect();

        //make parent containing block for child so the child stays inside it
        if (parentStyle.position === "static") {
          parent.style.position = "relative";
        }

        const selectedStyle = window.getComputedStyle(selected);
        if (selectedStyle.position === "static") {
          selected.style.width = rect.width + "px";
          selected.style.height = rect.height + "px";
          selected.style.margin = "0";
        }

        selected.style.position = "absolute";
        selected.style.left = rect.left - parentRect.left + parent.scrollLeft + "px";
        selected.style.top = rect.top - parentRect.top + parent.scrollTop + "px";
      } else {
        //fallback for normal parent elements
        const selectedStyle = window.getComputedStyle(selected);
        if (selectedStyle.position === "static") {
          selected.style.width = rect.width + "px";
          selected.style.height = rect.height + "px";
          selected.style.margin = "0";
        }

        selected.style.position = "absolute";
        selected.style.left = rect.left + window.scrollX + "px";
        selected.style.top = rect.top + window.scrollY + "px";
      }
    }
    function onMouseMove(e) {
      const panel = document.getElementById("quickstyle-editor");
      if (!draggingRef.current && panel && panel.contains(e.target)) return;

      if (draggingRef.current && selected) {
        const parent = selected.parentElement;
        const isLayoutRoot =
          parent === document.body ||
          parent === document.documentElement ||
          parent?.id === "root";

        if (parent instanceof HTMLElement && !isLayoutRoot) {
          const parentRect = parent.getBoundingClientRect();

          let x = e.clientX - parentRect.left - offsetRef.current.x + parent.scrollLeft;
          let y = e.clientY - parentRect.top - offsetRef.current.y + parent.scrollTop;

          x = Math.max(0, x);
          y = Math.max(0, y);

          selected.style.left = x + "px";
          selected.style.top = y + "px";

          const neededWidth = x + selected.offsetWidth;
          const neededHeight = y + selected.offsetHeight;

          if (neededWidth > parent.clientWidth) {
            parent.style.width = Math.ceil(neededWidth) + "px";
          }
          if (neededHeight > parent.clientHeight) {
            parent.style.height = Math.ceil(neededHeight) + "px";
          }
        } else {
          const x = e.clientX - offsetRef.current.x + window.scrollX;
          const y = e.clientY - offsetRef.current.y + window.scrollY;

          selected.style.left = x + "px";
          selected.style.top = y + "px";
        }

        updateBox(selected, selectBoxRef.current);
        return;
      }

      updateBox(e.target, hoverBoxRef.current);
    }

    function onMouseUp() {
      draggingRef.current = false;
    }

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
    }
  }, [selected, updateBox, hoverBoxRef, selectBoxRef]);

  return (
    <div>

    </div>
  )
}