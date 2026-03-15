import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import QuickStyle from "./components/QuickStyle";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QuickStyle />
    
    <div className="text-ellipsis">
      Poo Element
      <p className="bg-slate-950 text-red-500">Paragraph</p>
      
    </div>
    <div className="min-h-screen bg-slate-100 p-8">
      
    </div>
  </StrictMode>,
);
