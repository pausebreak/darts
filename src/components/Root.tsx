import React from "react";
import { useStore } from "../machine";
import { GameName } from "../types";
import { App } from "./App";
import { GameInfo } from "./GameInfo";

import "./Root.css";

export const Root = () => {
  const players = useStore((state) => state.players);
  const game = useStore((state) => state.game);
  const CurrentPlayerIndex = useStore((state) => state.currentPlayerIndex);
  const winner = useStore((state) => state.playerWon);

  const player = players[CurrentPlayerIndex];

  return (
    <>
      {game && game.name !== GameName.Cricket && !winner && <div className="playerName">{player?.name}</div>}
      {game && game.name === GameName.Cricket && !winner && <div className="playerName">{game.name}</div>}
      <div className="root">
        <GameInfo />
        <App />
      </div>
    </>
  );
};
