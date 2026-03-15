import {
  getMapFromStorage,
  popUndoSnapshot,
  restoreElementState,
  setStorage,
} from "./utils/sessionStorage";

function findElementByQSSrc(qsSrc) {
  if (!qsSrc) return null;

  const allTagged = document.querySelectorAll("[data-qs-src]");
  for (const el of allTagged) {
    if (el.getAttribute("data-qs-src") === qsSrc) return el;
  }

  return null;
}

export default function UndoButton({
  edits,
  setEdits,
  selected,
  setClasses,
  setInnerText,
}) {
  function handleUndo() {
    if (edits.size === 0) return;

    const snapshot = popUndoSnapshot();
    if (!snapshot || !snapshot.key) return;

    const editStore = getMapFromStorage("quick-style-edits");
    const changeStore = getMapFromStorage("quick-style-changes");

    if (snapshot.prevEdit === null) {
      editStore.delete(snapshot.key);
    } else {
      editStore.set(snapshot.key, snapshot.prevEdit);
    }

    if (snapshot.prevChange === null) {
      changeStore.delete(snapshot.key);
    } else {
      changeStore.set(snapshot.key, snapshot.prevChange);
    }

    const el = findElementByQSSrc(snapshot.key);
    if (el && snapshot.state) {
      restoreElementState(el, snapshot.state);

      const selectedKey = selected?.dataset?.qsSrc;
      if (selectedKey && selectedKey === snapshot.key) {
        const nextClasses = (el.getAttribute("class") || "")
          .split(/\s+/)
          .filter(Boolean);
        setClasses(nextClasses);
        setInnerText(el.innerHTML);
      }
    }

    setStorage("quick-style-edits", JSON.stringify([...editStore]));
    setStorage("quick-style-changes", JSON.stringify([...changeStore]));

    setEdits(editStore);
  }

  return (
    <button
      type="button"
      onClick={handleUndo}
      className="w-full py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
    >
      Undo
    </button>
  );
}
