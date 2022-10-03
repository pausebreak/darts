import * as React from "react";
import "./App.css";
import { GameChooser } from "./GameChooser";
import { useStore } from "../machine";
import { PlayerChooser } from "./PlayerChooser";
import { GameName } from "../types";
import { Cricket } from "./games/Cricket";

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

  switch (currentGame?.name) {
    case GameName.Cricket:
    case GameName.CutThroat:
      return <Cricket />;
    case GameName.Bulls:
    case GameName.Oh1:
    default:
      return (
        <>
          <PlayerChooser />
          {players.length > 0 && <GameChooser singlePlayer={players.length === 1} />}
        </>
      );
  }
};
