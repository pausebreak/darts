import * as React from "react";
import "./GameInfo.css";
import { useStore } from "../machine";
import { Multiple } from "../types";

export const GameInfo = () => {
  const currentGame = useStore((state) => state.game);
  const setGame = useStore((state) => state.setGame);
  const setPlayerWon = useStore((state) => state.setPlayerWon);

  const stopGame = () => {
    setGame(null);
    setPlayerWon(null);
  };

  return (
    <>
      {currentGame && (
        <>
          <div className="gameInfo">
            <div>{Multiple[currentGame.checkIn]} In</div>
            <div>{Multiple[currentGame.checkOut]} Out</div>
            <div>{currentGame.limit} Limit</div>
            <div>
              <button onClick={stopGame}>Stop Game</button>
            </div>
          </div>
        </>
      )}
    </>
  );
};
