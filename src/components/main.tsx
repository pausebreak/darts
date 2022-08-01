import React from "react";
import { createRoot } from "react-dom/client";
import { Root } from "./Root";

const root = document.getElementById("root");

if (root) {
  const reactRoot = createRoot(root);
  reactRoot.render(
    <React.StrictMode>
      <Root />
    </React.StrictMode>
  );
} else {
  console.error("Id 'root' not found");
}
