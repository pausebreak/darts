import * as React from "react";
import "./App.css";
import { GameChooser } from "./GameChooser";
import { useStore } from "../machine";
import { PlayerChooser } from "./PlayerChooser";
import { TouchInput } from "./TouchInput";
import { GameName } from "../types";
import { Cricket } from "./games/Cricket";
import { Players } from "./Players";

export const App = () => {
  const currentGame = useStore((state) => state.game);
  const players = useStore((state) => state.players);
  const winner = useStore((state) => state.playerWon);

  if (winner) {
    return (
      <>
        <div className="winner">{winner.name} is the winner</div>
        <PlayerChooser />
        {players.length > 0 && <GameChooser singlePlayer={players.length === 1} />}
      </>
    );
  }

  return (
    <div className="App">
      {currentGame && currentGame.name !== GameName.Cricket && (
        <div className="layout">
          <div className="content">
            <Players />
            <TouchInput />
          </div>
        </div>
      )}
      {currentGame && currentGame.name === GameName.Cricket && <Cricket />}
      {!currentGame && (
        <>
          <PlayerChooser />
          {players.length > 0 && <GameChooser singlePlayer={players.length === 1} />}
        </>
      )}
    </div>
  );
};
