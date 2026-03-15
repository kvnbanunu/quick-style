import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QuickStyle } from "quick-style-hackathon";
import "quick-style-hackathon/style.css";

import App from "./App.jsx"; 

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QuickStyle />
    <App/>
  </StrictMode>,
);