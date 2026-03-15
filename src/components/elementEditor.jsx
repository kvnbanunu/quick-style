import tailwindClasses from "./tailwindClasses";
import ClassPillList from "./ClassPillList";
import TailwindClassInput from "./TailWindClassInput";
import TailwindClassMenus from "./TailWindClassMenus";
import { sendClass } from "../tw-runtime/tw-runtime";
import { getReactSourceInfo } from "../utils/reactSourceInfo";
import { setStorage } from "./utils/localStorage";

export default function ClassEditor({
  classes,
  selected,
  oldSelected,
  setClasses,
  setSelected,
}) {
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

    saveChanges(newClasses, fileName, lineNumber, columnNumber + 1);
    sendClass(cls);
  }

  async function saveChanges(classesToSave, filePath, lineNum, column) {
    setStorage("quick-style-selected", selected.dataset.qsSrc);
    await fetch("/api/update-element", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        classes: classesToSave,
        filePath: filePath,
        line_number: lineNum,
        column_number: column,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log("Backend response:", data))
      .catch(console.error);
  }

  function removeClass(cls) {
    const newClasses = classes.filter((c) => c !== cls);
    applyClasses(newClasses);

    const { fileName, lineNumber, columnNumber } = getReactSourceInfo(selected);

    saveChanges(newClasses, fileName, lineNumber, columnNumber + 1);
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

