import tailwindClasses from "./tailwindClasses";
import ClassPillList from "./ClassPillList";
import TailwindClassInput from "./TailWindClassInput";
import TailwindClassMenus from "./TailWindClassMenus";
import { sendClass } from "../tw-runtime/tw-runtime";
import { getReactSourceInfo } from "../utils/reactSourceInfo";
import { getStorage, storeChange, storeEdit } from "./utils/sessionStorage";

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

  async function saveAll() {
    const changeStore = getStorage("quick-style-changes");
    if (changeStore === null || changeStore === undefined) return;

    const changeMap = new Map(JSON.parse(changeStore));
    for (const [key, val] of changeMap) {
      await saveChanges(
        val.changeClass.classes,
        val.changeClass.filePath,
        val.changeClass.line_number,
        val.changeClass.column_number,
      );
    }
  }

  async function saveChanges(classesToSave, filePath, lineNum, column) {
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
      <button onClick={saveAll}>Save Class Changes</button>
    </div>
  );
}
