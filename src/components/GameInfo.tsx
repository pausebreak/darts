import * as React from "react";
import "./GameInfo.css";
import { useStore } from "../machine";
import { Multiple } from "../types";

export const GameInfo = () => {
  const currentGame = useStore((state) => state.game);
  const winner = useStore((state) => state.playerWon);
  const setGame = useStore((state) => state.setGame);
  const setPlayerWon = useStore((state) => state.setPlayerWon);

  const stopGame = () => {
    setGame(null);
    setPlayerWon(null);
  };

  return (
    <>
      {currentGame && !winner && (
        <>
          <div className="gameInfo">
            {currentGame.checkIn && <div>{Multiple[currentGame.checkIn]} In</div>}
            {currentGame.checkOut && <div>{Multiple[currentGame.checkOut]} Out</div>}
            {currentGame.limit > 0 && <div>{currentGame.limit} Limit</div>}
            <div>
              <button onClick={stopGame}>Stop Game</button>
            </div>
          </div>
        </>
      )}
    </>
  );
};
