import tailwindClasses from "./tailwindClasses";
import ClassPillList from "./ClassPillList";
import TailwindClassInput from "./TailWindClassInput";
import TailwindClassMenus from "./TailWindClassMenus";
import { sendClass } from "../tw-runtime/tw-runtime";
import { getReactSourceInfo } from "../utils/reactSourceInfo";
import { getStorage, setStorage } from "./utils/sessionStorage";

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

    // saveChanges(newClasses, fileName, lineNumber, columnNumber + 1);
    const key = selected.dataset.qsSrc;
    storeChanges(key, newClasses, fileName, lineNumber, columnNumber + 1);
    storeEdits(key, newClasses);
    sendClass(cls);
  }

  function storeEdits(key, classes) {
    const editStore = getStorage("quick-style-edits");
    let storeVal;

    if (editStore === null || editStore === undefined) {
      const editMap = new Map();
      editMap.set(key, classes);
      storeVal = JSON.stringify([...editMap]);
    } else {
      const editMap = new Map(JSON.parse(editStore));
      if (editMap.has(key)) {
        editMap.delete(key);
      }

      editMap.set(key, classes);
      storeVal = JSON.stringify([...editMap]);
    }

    setStorage("quick-style-edits", storeVal);
  }

  function storeChanges(key, classesToSave, filePath, lineNum, column) {
    const changeStore = getStorage("quick-style-changes");
    let storeVal;

    if (changeStore === null || changeStore === undefined) {
      const changeMap = new Map();
      changeMap.set(key, {
        classes: classesToSave,
        filePath: filePath,
        line_number: lineNum,
        column_number: column,
      });
      storeVal = JSON.stringify([...changeMap]);
    } else {
      const changeMap = new Map(JSON.parse(changeStore));
      if (changeMap.has(key)) {
        changeMap.delete(key);
      }
      changeMap.set(key, {
        classes: classesToSave,
        filePath: filePath,
        line_number: lineNum,
        column_number: column,
      });
      storeVal = JSON.stringify([...changeMap]);
    }
    setStorage("quick-style-changes", storeVal);
  }

  async function saveAll() {
    const changeStore = getStorage("quick-style-changes");
    if (changeStore === null || changeStore === undefined) return;

    const changeMap = new Map(JSON.parse(changeStore));
    for (const [key, val] of changeMap) {
      await saveChanges(
        val.classes,
        val.filePath,
        val.line_number,
        val.column_number,
      );
    }
  }

  async function saveChanges(classesToSave, filePath, lineNum, column) {
    // setStorage("quick-style-selected", selected.dataset.qsSrc);
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
    <div className="bg-blue-700 flex-1 min-h-0 overflow-y-auto p-2">
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
