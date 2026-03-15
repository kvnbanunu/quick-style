import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import QuickStyle from "./components/QuickStyle";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QuickStyle />
    <button className="rounded-md px-4 py-2 text-zinc-400 text-5xl">Tesdacdasccsas</button>
    <div className="text-ellipsis bg-red-400">
      Poo Element
      <p className="">Paragraph</p>
      
    </div>
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-xl rounded-xl border border-slate-300 p-6 shadow-lg gap-8">
        

        {/* <button
       onClick={() => {
         const element  = `<button class="rounded-md px-4 py-2">Test sasasaas</button>`;
         const line = 10;
         const col = 5;
         const filePath = "/Users/reecemelnick/Desktop/hack/quick-style/src/main.jsx";

         fetch("/api/update-full-element", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({
             elementString: element,
             filePath: filePath,
             line_number: line,
             column_number: col,
           })
         })
           .then(res => res.json())
           .then(data => console.log("Backend response:", data))
           .catch(console.error);
       }}
     >
       Update Header
     </button> */}

        <div className="space-y-3 rounded-lg bg-slate-50 p-4 bg-red-600">
          

          

          <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
            <button className="rounded-md px-4 py-2">
              Test Button
            </button>
          </a>
        </div>
      </div>
    </div>
  </StrictMode>,
);
