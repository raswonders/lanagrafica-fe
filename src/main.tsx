import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/app.tsx";
import "normalize.css";
import "./index.css";
import { ThemeProvider } from "./components/theme-provider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider storageKey="vite-ui-theme">
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
