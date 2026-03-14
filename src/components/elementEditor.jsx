import { useEffect, useState } from "react";

export default function ClassEditor({ classes, selected, setClasses }) {

  function applyClasses(list) {
    if (!selected) return;

    const value = list.join(" ");

    selected.setAttribute("class", value);
    setClasses(list);
  }

  function addClass(cls) {
    if (!cls) return;
    applyClasses([...classes, cls])
  }

  function removeClass(cls) {
    applyClasses(classes.filter((c) => c !== cls));
  }

  if (!selected) {
    return (
      <div className="bg-blue-700">
        Select an Element
      </div>
    )
  } else {
    return (
      <div className="bg-blue-700">
        Class Editor
        <ClassList
          classes={classes}
          removeClass={removeClass}
        />
        <ClassInput
          addClass={addClass}
        />
      </div>
    )
  }
}

const classes = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-orange-500",

  "text-red-500",
  "text-blue-500",
  "text-green-500",
  "text-purple-500",

  "p-1",
  "p-2",
  "p-3",
  "p-4",
  "p-6",
  "p-8",

  "px-2",
  "px-4",
  "px-6",

  "py-2",
  "py-4",
  "py-6",

  "rounded",
  "rounded-md",
  "rounded-lg",
  "rounded-xl",

  "flex",
  "grid",
  "items-center",
  "justify-center"
];


function ClassList({ classes, removeClass }) {
  return (
    <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 4 }}>
      {classes.map((c) => (
        <span
          key={c}
          onClick={() => removeClass(c)}
          style={{
            background: "#333",
            padding: "3px 6px",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          {c} ×
        </span>
      ))}
    </div>
  )
}


function ClassInput({ addClass }) {

  return (
    <div>
      <input
        placeholder="add a class..."
        list="class-list"
        id="country-choice"
        name="country-choice"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addClass(e.target.value.trim())
            e.target.value = ""
          }
        }}
      />
      <datalist id="class-list">
        {classes.map((classes) => (
          <option key={classes} value={classes} />
        ))}
      </datalist>
    </div>
  );
}