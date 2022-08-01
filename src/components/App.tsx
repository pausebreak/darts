import * as React from "react";
import "./App.css";
import { GameChooser } from "./GameChooser";
import { useStore } from "../machine";
import { PlayerChooser } from "./PlayerChooser";
import { TouchInput } from "./TouchInput";
import { CurrentPlayer } from "./CurrentPlayer";
import { Players } from "./Players";
import { GameName } from "../types";
import { Cricket } from "./games/Cricket";

export const App = () => {
  const currentGame = useStore((state) => state.game);
  const invalidThrow = useStore((state) => state.invalidThrow);
  const players = useStore((state) => state.players);
  const winner = useStore((state) => state.playerWon);

  if (winner) {
    return (
      <div>
        <div>{winner.name} Won!</div>
        <PlayerChooser />
        {players.length > 0 && <GameChooser singlePlayer={players.length === 1} />}
      </div>
    );
  }

  return (
    <>
      <div className="App">
        {currentGame && currentGame.name !== GameName.Cricket && (
          <div className="layout">
            <div className="content">
              <CurrentPlayer />
              <TouchInput />
            </div>
            <div className="sideBar">
              <Players />
            </div>
          </div>
        )}
        {currentGame && currentGame.name === GameName.Cricket && (
          <Cricket />
        )}
        {invalidThrow && <span style={{ color: "red" }}>Invalid Throw</span>}
        {!currentGame && (
          <>
            <PlayerChooser />
            {players.length > 0 && <GameChooser singlePlayer={players.length === 1} />}
          </>
        )}
      </div>
    </>
  );
};
