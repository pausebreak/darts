import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { GameInfo } from "./GameInfo";

const root = document.getElementById("root");

if (root) {
  const reactRoot = createRoot(root);
  reactRoot.render(
    <React.StrictMode>
      <GameInfo />
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Id 'root' not found");
}
