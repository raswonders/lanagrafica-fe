import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Box, Theme } from "@radix-ui/themes";
import "normalize.css";
import "@radix-ui/themes/styles.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme>
      <Box style={{ height: "100vh" }}>
        <App />
      </Box>
    </Theme>
  </React.StrictMode>,
);
