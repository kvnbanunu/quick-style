import tailwindClasses from "./tailwindClasses";
import ClassPillList from "./ClassPillList";
import TailwindClassInput from "./TailWindClassInput";
import TailwindClassMenus from "./TailWindClassMenus";
export default function ClassEditor({ classes, selected, setClasses }) {
  function applyClasses(list) {
    if (!selected) return;

    selected.setAttribute("class", list.join(" "));
    setClasses(list);
  }

  function addClass(cls) {
    if (!cls) return;
    if (classes.includes(cls)) return;
    applyClasses([...classes, cls]);
  }

  function removeClass(cls) {
    applyClasses(classes.filter((c) => c !== cls));
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
      <TailwindClassMenus selectedClasses={classes} onToggleClass={toggleClass} />
      <TailwindClassInput allClasses={tailwindClasses} onAddClass={addClass} />
      <ClassPillList classes={classes} onRemoveClass={removeClass} />
    </div>
  );
}