import React from "react";
import { useStore } from "../machine";
import { App } from "./App";
import { GameInfo } from "./GameInfo";

import "./Root.css";

export const Root = () => {
  const game = useStore((state) => state.game);
  const winner = useStore((state) => state.playerWon);

  return (
    <>
      {game && !winner && <div className="playerName">{game.name}</div>}
      <div className="root">
        <GameInfo />
        <App />
      </div>
    </>
  );
};
