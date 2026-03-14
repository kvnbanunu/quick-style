import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import QuickStyle from "./components/QuickStyle";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QuickStyle />
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-xl rounded-xl border border-slate-300 bg-white p-6 shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-slate-800">Test Element</h1>

        <div className="space-y-3 rounded-lg bg-slate-50 p-4">
          <div className="rounded-md px-3 py-2">
            Child Element
          </div>

          <p className="rounded border bg-emerald-50 px-3 py-2 text-sm">
            Paragraph
          </p>

          <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
            <button className="rounded-md bg-purple-600 px-4 py-2 font-medium text-white">
              Test Button
            </button>
          </a>
        </div>
      </div>
    </div>
  </StrictMode>,
);
