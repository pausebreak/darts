import React from "react";
import { DartLabel } from "./DartLabel";
import { useStore } from "../machine";
import { dartValue } from "../games";

import "./Players.css";

export const Players = () => {
  const players = useStore((state) => state.players);
  const game = useStore((state) => state.game);
  const currentPlayerIndex = useStore((state) => state.currentPlayerIndex);

  return (
    <div className="players">
      {players.map((player, playerIndex) => {
        const total = game.limit - player.darts.reduce((acc, dart) => acc + dartValue(dart), 0);
        const dartsThrown = player.darts.length;
        const remainder = dartsThrown % 3;
        const lastRoundThrow = dartsThrown - remainder;
        const last3Throws = player.darts.slice(lastRoundThrow - 3, lastRoundThrow);
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
