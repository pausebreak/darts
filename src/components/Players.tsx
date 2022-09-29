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
        const isCurrentPlayer = currentPlayerIndex === playerIndex;
        const playerClass = isCurrentPlayer ? "player current" : "player";
        const total = game.limit - player.darts.reduce((acc, dart) => acc + dartValue(dart), 0);
        const dartsThrown = player.darts.length;
        const remainder = dartsThrown % 3;
        const lastRoundThrows = player.darts.slice(-3);
        const thisRoundThrows = remainder === 0 ? [] : player.darts.slice(-remainder);

        return (
          <div key={player.name} className={playerClass}>
            <div className="name">{player.name}</div>
            <div className="total">{total}</div>
            {!isCurrentPlayer && lastRoundThrows.length > 0 && (
              <div>
                {lastRoundThrows.map((dart, idx) => (
                  <DartLabel key={`${idx}${dart}`} condensed={true} dart={dart} />
                ))}
              </div>
            )}
            {isCurrentPlayer && thisRoundThrows.length > 0 && (
              <div>
                {thisRoundThrows.map((dart, idx) => (
                  <DartLabel key={`${idx}${dart}`} dart={dart} />
                ))}
              </div>
            )}
            {isCurrentPlayer && thisRoundThrows.length === 0 && (
              <div>
                <div className="dart placeholder">&nbsp;</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
