import tailwindClasses from "./tailwindClasses";
import ClassPillList from "./ClassPillList";
import TailwindClassInput from "./TailWindClassInput";
import TailwindClassMenus from "./TailWindClassMenus";
import { sendClass } from "../tw-runtime/tw-runtime";
import { getReactSourceInfo } from "../utils/reactSourceInfo";
import { storeChange, storeEdit } from "./utils/sessionStorage";

export default function ClassEditor({ classes, selected, setClasses }) {
  function applyClasses(list) {
    if (!selected) return;

    selected.setAttribute("class", list.join(" "));
    setClasses(list);
  }

  function addClass(cls) {
    if (!cls) return;
    if (classes.includes(cls)) return;

    const newClasses = [...classes, cls];

    applyClasses(newClasses);

    const { fileName, lineNumber, columnNumber } = getReactSourceInfo(selected);

    const key = selected.dataset.qsSrc;
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

    const { fileName, lineNumber, columnNumber } = getReactSourceInfo(selected);

    const key = selected.dataset.qsSrc;
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
    return <div className="bg-blue-700">Select an Element</div>;
  }

  return (
    <div className="bg-blue-700 flex-1 min-h-0 p-2">
      Class Editor
      <TailwindClassMenus
        selectedClasses={classes}
        onToggleClass={toggleClass}
      />
      <TailwindClassInput allClasses={tailwindClasses} onAddClass={addClass} />
      <ClassPillList classes={classes} onRemoveClass={removeClass} />
    </div>
  );
}
