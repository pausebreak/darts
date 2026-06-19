import * as React from "react";
import "./App.css";
import { useStore } from "../machine";
import { GameName } from "../types";
import { Players } from "./Players";
import { TouchInput } from "./TouchInput";
import { ShanghaiInput } from "./ShanghaiInput";
import { GameInfo } from "./GameInfo";
import { PostGame } from "./PostGame";
import { TouchScoreBoard } from "./games/TouchScoreBoard";
import { GameSetup } from "./GameSetup";

const GameLayout = () => {
  const currentGame = useStore((state) => state.game);

  switch (currentGame?.name) {
    case GameName.Cricket:
    case GameName.CutThroat:
      return <TouchScoreBoard />;
    case GameName.Bulls:
    case GameName.Oh1:
      return (
        <>
          <Players />
          <TouchInput />
        </>
      );
    case GameName.Shanghai:
      return (
        <>
          <Players />
          <ShanghaiInput />
        </>
      );
    case GameName.Tactical:
      return <TouchScoreBoard />;
  }
};

const GamePrep = () => {
  return <GameSetup />;
};

export const App = () => {
  const winner = useStore((state) => state.winner);
  const game = useStore((state) => state.game);

  return (
    <>
      <GameInfo />
      <div className="App">
        {winner && <PostGame />}
        {!winner && game && <GameLayout />}
        {!winner && !game && <GamePrep />}
      </div>
    </>
  );
};
