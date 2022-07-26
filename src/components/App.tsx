import * as React from "react";
import "./App.css";
import { GameChooser } from "./GameChooser";
import { useStore } from "../machine";
import { PlayerChooser } from "./PlayerChooser";
import { TouchInput } from "./TouchInput";
import { Multiple } from "../types";
import { CurrentPlayer } from "./CurrentPlayer";
import { Players } from "./Players";

export const App = () => {
  const currentGame = useStore((state) => state.game);
  const invalidThrow = useStore((state) => state.invalidThrow);
  const players = useStore((state) => state.players);
  const winner = useStore((state) => state.playerWon);
  const setGame = useStore((state) => state.setGame);

  const stopGame = () => {
    setGame(null);
  };

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
    <div className="App">
      <h1>Darts</h1>
      {invalidThrow && <span style={{ color: "red" }}>Invalid Throw</span>}
      {currentGame && (
        <>
          <button onClick={stopGame}>Stop Game</button>
          <span>{currentGame.name}</span>
          <span>{Multiple[currentGame.checkIn]} In</span>
          <span>{Multiple[currentGame.checkOut]} Out</span>
          <span>{currentGame.limit} Limit</span>
          <Players />
          <CurrentPlayer />
          <TouchInput />
        </>
      )}
      {!currentGame && (
        <>
          <PlayerChooser />
          {players.length > 0 && <GameChooser singlePlayer={players.length === 1} />}
        </>
      )}
    </div>
  );
};

