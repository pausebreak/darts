import React from "react";
import { DartLabel } from "./DartLabel";
import { useStore } from "../machine";
import { dartValue } from "../games";

import "./Players.css";

export const Players = () => {
  const players = useStore((state) => state.players);
  const currentPlayerIndex = useStore((state) => state.currentPlayerIndex);

  return (
    <div className="players">
      {players.map((player, playerIndex) => {
        const total = player.darts.reduce((acc, thrw) => acc + dartValue(thrw), 0);
        const dartsThrown = player.darts.length;
        let last3Throws = [];

        const remainder = dartsThrown % 3;
        const lastRoundThrow = dartsThrown - remainder;

        last3Throws = player.darts.slice(lastRoundThrow - 3, lastRoundThrow);

        const playerClass = currentPlayerIndex === playerIndex ? "player current" : "player";

        return (
          <div key={player.name} className={playerClass}>
            <span className="name">{player.name}</span>
            <span className="total">{total}</span>
            {last3Throws.length > 0 && (
              <div>
                {last3Throws.map((dart, idx) => (
                  <DartLabel key={`${idx}${dart}`} dart={dart} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
