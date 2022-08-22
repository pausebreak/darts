import React from "react";
import { App } from "./App";
import { GameInfo } from "./GameInfo";

import "./Root.css";

export const Root = () => {
  return (
    <div className="root">
      <GameInfo />
      <App />
    </div>
  );
};
