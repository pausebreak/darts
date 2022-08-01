import React from "react";
import { DartLabel } from "./DartLabel";
import { useStore } from "../machine";
import { dartValue } from "../games";

export const CurrentPlayer = () => {
  const currentPlayerIndex = useStore((state) => state.currentPlayerIndex);
  const players = useStore((state) => state.players);
  const game = useStore((state) => state.game);

  const currentPlayer = players[currentPlayerIndex] || null;

  if (!currentPlayer) {
    return <div></div>;
  }

  const numOfThrows = currentPlayer.darts.length;

  let thisRoundThrows = [];

  const remainder = numOfThrows % 3;
  const lastRoundThrow = numOfThrows - remainder;

  if (remainder) {
    thisRoundThrows = currentPlayer.darts.slice(lastRoundThrow);
  }

  const total = currentPlayer?.darts.reduce((acc, thrw) => acc + dartValue(thrw), 0);
  const left = game.limit ? game.limit - total : null;

  return (
    <div className="currentPlayer">
      {left && (
        <div style={{ fontSize: "1.5em" }}>
          total: <span style={{ fontSize: "5em", marginRight: "0.25em" }}>{total}</span>
          left: <span style={{ fontSize: "5em", marginRight: "0.25em" }}>{left}</span>
        </div>
      )}
      {thisRoundThrows.map((dart, idx) => (
        <DartLabel key={`${idx}${dart}`} dart={dart} />
      ))}
    </div>
  );
};
