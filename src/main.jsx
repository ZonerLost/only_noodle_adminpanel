import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes/router";
import { ThemeProvider } from "./theme/ThemeContext";
import { UIProvider } from "./shared/context/UIContext";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <UIProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </UIProvider>
    </ThemeProvider>
  </React.StrictMode>
);
