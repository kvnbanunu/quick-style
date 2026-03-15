import { sendClass } from "../tw-runtime/tw-runtime";
import { getMapFromStorage } from "./utils/sessionStorage";

export default function UndoButton({ edits, setEdits }) {
  function handleUndo() {
    if (edits.size === 0) return;
    const lastIndex = edits.size - 1;

    const editStore = getMapFromStorage("quick-style-edits");
    const changeStore = getMapFromStorage("quick-style-changes");

    setEdits();

    sendClass("reset");
  }

  return <button onClick={handleUndo}>Undo</button>;
}
