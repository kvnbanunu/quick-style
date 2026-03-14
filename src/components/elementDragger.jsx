import { useEffect, useRef } from "react";

export default function ElementDragger({updateBox, selected, hoverBoxRef, selectBoxRef}) {

  const draggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {

    function onMouseDown(e) {
      if (!selected) return;
      if (e.target !== selected) return;

      draggingRef.current = true;

      const rect = selected.getBoundingClientRect();

      offsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
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
    }
  }, [selected]);

  return (
    <div>

    </div>
  )
}