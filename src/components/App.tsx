import * as React from "react";
import "./App.css";
import { GameChooser } from "./GameChooser";
import { useStore } from "../machine";
import { PlayerChooser } from "./PlayerChooser";
import { GameName } from "../types";
import { Cricket } from "./games/Cricket";
import { Players } from "./Players";
import { TouchInput } from "./TouchInput";

export const App = () => {
  const currentGame = useStore((state) => state.game);
  const players = useStore((state) => state.players);
  const winner = useStore((state) => state.playerWon);

  if (winner) {
    return (
      <div className="App">
        <div className="winner">{winner.name} is the winner</div>
        <PlayerChooser />
        {players.length > 0 && <GameChooser singlePlayer={players.length === 1} />}
      </div>
    );
  }

  switch (currentGame?.name) {
    case GameName.Cricket:
    case GameName.CutThroat:
      return (
        <div className="App">
          <Cricket />
        </div>
      );
    case GameName.Bulls:
    case GameName.Oh1:
      return (
        <div className="App">
          <Players />
          <TouchInput />
        </div>
      );
    default:
      return (
        <div className="App">
          <PlayerChooser />
          {players.length > 0 && <GameChooser singlePlayer={players.length === 1} />}
        </div>
      );
  }
};
