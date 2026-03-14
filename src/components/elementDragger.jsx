import { useEffect, useRef } from "react";

export default function ElementDragger({
  updateBox,
  selected,
  hoverBoxRef,
  selectBoxRef,
}) {
  const draggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  function ensureParentContains(el) {
    const parent = el.parentElement;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const childRect = el.getBoundingClientRect();

    let newWidth = parentRect.width;
    let newHeight = parentRect.height;

    const overflowRight = childRect.right - parentRect.right;
    const overflowBottom = childRect.bottom - parentRect.bottom;

    if (overflowRight > 0) newWidth += overflowRight;
    if (overflowBottom > 0) newHeight += overflowBottom;

    if (overflowRight > 0 || overflowBottom > 0) {
      parent.style.width = newWidth + "px";
      parent.style.height = newHeight + "px";
    }
  }

  useEffect(() => {
    function onMouseDown(e) {
      if (!selected) return;
      if (e.target !== selected) return;
      if (e.target.tagName === "BODY") return;

      draggingRef.current = true;

      const rect = selected.getBoundingClientRect();

      offsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      selected.style.position = "absolute";
    }

    function onMouseMove(e) {
      const panel = document.getElementById("quickstyle-editor");
      if (panel && panel.contains(e.target)) return;

      if (draggingRef.current && selected) {
        const x = e.clientX - offsetRef.current.x + window.scrollX;
        const y = e.clientY - offsetRef.current.y + window.scrollY;

        selected.style.left = x + "px";
        selected.style.top = y + "px";

        ensureParentContains(selected);

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
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [selected]);

  return <div></div>;
}