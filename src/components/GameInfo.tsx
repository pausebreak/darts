import * as React from "react";
import "./GameInfo.css";
import { useStore } from "../machine";
import { GameName, Multiple } from "../types";

export const GameInfo = () => {
  const game = useStore((state) => state.game);
  const winner = useStore((state) => state.winner);
  const setGame = useStore((state) => state.setGame);
  const setWinner = useStore((state) => state.setWinner);

  const stopGame = () => {
    setGame(null);
    setWinner(null);
  };

  return (
    <>
      {game && !winner && (
        <>
          <div className="gameInfo">
            {game.name !== GameName.Oh1 && <div>{game.name}</div>}
            {game.limit > 0 && <div>{game.limit} Limit</div>}
            {game.checkIn && <div>{Multiple[game.checkIn]} In</div>}
            {game.checkOut && <div>{Multiple[game.checkOut]} Out</div>}
            <button style={{ flex: 0.5 }} onClick={stopGame}>
              Stop Game
            </button>
          </div>
        </>
      )}
    </>
  );
};
