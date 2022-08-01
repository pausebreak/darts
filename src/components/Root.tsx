import React from "react";
import { useStore } from "../machine";
import { App } from "./App";
import { GameInfo } from "./GameInfo";

import "./Root.css";

export const Root = () => {
  const players = useStore((state) => state.players);
  const game = useStore((state) => state.game);
  const CurrentPlayerIndex = useStore((state) => state.currentPlayerIndex);

  const player = players[CurrentPlayerIndex];

  return (
    <>
      {game && <div className="playerName">{player?.name}</div>}
      <div className="root">
        <GameInfo />
        <App />
      </div>
    </>
  );
};
