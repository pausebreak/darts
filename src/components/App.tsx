import * as React from "react";
import "./App.css";
import { GameChooser } from "./GameChooser";
import { useStore } from "../machine";
import { PlayerChooser } from "./PlayerChooser";
import { GameName } from "../types";
import { Cricket } from "./games/Cricket";
import { Players } from "./Players";
import { TouchInput } from "./TouchInput";
import { GameInfo } from "./GameInfo";
import { PostGame } from "./PostGame";

const GameLayout = () => {
  const currentGame = useStore((state) => state.game);
  const players = useStore((state) => state.players);

  switch (currentGame?.name) {
    case GameName.Cricket:
    case GameName.CutThroat:
      return <Cricket />;
    case GameName.Bulls:
    case GameName.Oh1:
      return (
        <>
          <Players />
          <TouchInput />
        </>
      );
    default:
      return (
        <>
          <h1>Darts</h1>
          <PlayerChooser />
          {players.length > 0 && <GameChooser singlePlayer={players.length === 1} />}
        </>
      );
  }
};

export const App = () => {
  const winner = useStore((state) => state.winner);

  return (
    <>
      <GameInfo />
      <div className="App">
        {winner && <PostGame />}
        {!winner && <GameLayout />}
      </div>
    </>
  );
};
