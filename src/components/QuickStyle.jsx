import { useState } from "react";

export default function QuickStyle() {
  const [isOpen, setIsOpen] = useState(false);

  if (isOpen) {
    return (
      <div
        id="quickstyle-editor"
        className="border border-1 bg-black w-md h-md min-h-48 z-10 rounded absolute bottom-10 right-10 flex flex-col justify-between"
      >
        <p className="text-lg">Quick Style Editor</p>

      <button
        onClick={() => {
          const tailwindClasses = ["text-red-500", "font-bold", "text-3xl"];
          const h1 = '<h1>Hello World</h1>';

          fetch("/api/update-element", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              original: h1, 
              classes: tailwindClasses
            })
          })
            .then(res => res.json())
            .then(data => console.log("Backend response:", data))
            .catch(console.error);
        }}
      >
        Update Header
      </button>

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

