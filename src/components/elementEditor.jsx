import tailwindClasses from "./tailwindClasses";
import ClassPillList from "./ClassPillList";
import TailwindClassInput from "./TailWindClassInput";
import TailwindClassMenus from "./TailWindClassMenus";
import { sendClass } from "../tw-runtime/tw-runtime";
import { getReactSourceInfo } from "../utils/reactSourceInfo";
import { storeChange, storeEdit } from "./utils/sessionStorage";

export default function ClassEditor({ classes, selected, setClasses }) {
  function getElementByQSSrc(qsSrc) {
    if (!qsSrc) return null;

    const allTagged = document.querySelectorAll("[data-qs-src]");
    for (const el of allTagged) {
      if (el.getAttribute("data-qs-src") === qsSrc) return el;
    }

    return null;
  }

  function getLiveSelectedElement() {
    if (!selected) return null;

    const key = selected.dataset?.qsSrc;
    const liveEl = key ? getElementByQSSrc(key) : null;

    if (liveEl) return liveEl;
    if (selected.isConnected) return selected;
    return null;
  }

  function applyClasses(list) {
    const target = getLiveSelectedElement();
    if (!target) return;

    target.setAttribute("class", list.join(" "));
    setClasses(list);
  }

  function addClass(cls) {
    if (!cls) return;
    if (classes.includes(cls)) return;

    const newClasses = [...classes, cls];

    applyClasses(newClasses);

    const target = getLiveSelectedElement();
    if (!target) return;

    const sourceInfo = getReactSourceInfo(target);
    if (!sourceInfo) return;
    const { fileName, lineNumber, columnNumber } = sourceInfo;

    const key = target.dataset.qsSrc;
    storeChange("quick-style-changes", key, "changeClass", {
      classes: newClasses,
      filePath: fileName,
      line_number: lineNumber,
      column_number: columnNumber + 1,
    });
    storeEdit("quick-style-edits", key, "editClass", newClasses);
    sendClass(cls);
  }

  function removeClass(cls) {
    const newClasses = classes.filter((c) => c !== cls);
    applyClasses(newClasses);

    const target = getLiveSelectedElement();
    if (!target) return;

    const sourceInfo = getReactSourceInfo(target);
    if (!sourceInfo) return;
    const { fileName, lineNumber, columnNumber } = sourceInfo;

    const key = target.dataset.qsSrc;
    storeChange("quick-style-changes", key, "changeClass", {
      classes: newClasses,
      filePath: fileName,
      line_number: lineNumber,
      column_number: columnNumber + 1,
    });
    storeEdit("quick-style-edits", key, "editClass", newClasses);
    sendClass(cls);
  }

  function toggleClass(cls) {
    if (classes.includes(cls)) {
      removeClass(cls);
    } else {
      addClass(cls);
    }
  }

  if (!selected) {
    return <p className="text-xs text-zinc-500 italic">Select an element.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-500 uppercase tracking-widest">
          Applied Classes
        </p>
        <span className="text-xs text-zinc-500">{classes.length}</span>
      </div>
      <TailwindClassMenus
        selectedClasses={classes}
        onToggleClass={toggleClass}
      />
      <TailwindClassInput allClasses={tailwindClasses} onAddClass={addClass} />
      <ClassPillList classes={classes} onRemoveClass={removeClass} />
    </div>
  );
}
