import { useState } from "react";
import ElementEditor from "./elementEditor";

export default function QuickStyle() {
  const [isOpen, setIsOpen] = useState(false);

  if (isOpen) {
    return (
      <div
        id="quickstyle-editor"
        className="border border-1 bg-black w-md h-md min-h-48 z-10 rounded absolute bottom-10 right-10 flex flex-col justify-between"
      >
        <p className="text-lg">
          Quick Style Editor
          <ElementEditor/>
          </p>
        <button
          onClick={() => {
            setIsOpen(false);
          }}
        >
          Close
        </button>
      </div>
    );
  } else {
    return (
      <button
        onClick={() => {
          setIsOpen(true);
        }}
        className="absolute bottom-10 right-10 z-10"
      >
        Click Me!
      </button>
    );
  }
}

