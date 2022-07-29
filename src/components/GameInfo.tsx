import * as React from "react";
import "./GameInfo.css";
import { useStore } from "../machine";
import { GameName, Multiple } from "../types";

export const GameInfo = () => {
  const currentGame = useStore((state) => state.game);
  const setGame = useStore((state) => state.setGame);

  const stopGame = () => {
    setGame(null);
  };
  const gameName = currentGame?.name === GameName.Oh1 ? currentGame.limit : currentGame?.name;

  return (
    <>
      {currentGame && (
        <>
          <div className="gameName">{gameName}</div>
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
