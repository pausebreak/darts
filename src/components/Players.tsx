import React from "react";
import { DartLabel } from "./DartLabel";
import { useStore } from "../machine";
import { dartValue } from "../games";
import { GameName } from "../types";

import "./Players.css";
import { sayPhrase } from "../sound";

const onNameClick = (name: string, voiceIndex: number) => () => {
  sayPhrase(name, voiceIndex);
};

export const Players = () => {
  const players = useStore((state) => state.players);
  const game = useStore((state) => state.game);
  const voiceIndex = useStore((state) => state.voiceIndex);
  const currentPlayerIndex = useStore((state) => state.currentPlayerIndex);

  return (
    <div className="players">
      {players.map((player, playerIndex) => {
        const isCurrentPlayer = currentPlayerIndex === playerIndex;
        const playerClass = isCurrentPlayer ? "player current" : "player";
        const scored = player.darts.reduce((acc, dart) => acc + dartValue(dart), 0);
        // Shanghai counts up from zero; the other pointing games count down to the limit
        const total = game.name === GameName.Shanghai ? scored : game.limit - scored;
        const dartsThrown = player.darts.length;
        const remainder = dartsThrown % 3;
        const lastRoundThrows = player.darts.slice(-3);
        const thisRoundThrows = remainder === 0 ? [] : player.darts.slice(-remainder);
        const onClick = isCurrentPlayer ? onNameClick(player.name, voiceIndex) : undefined;

        return (
          <div key={player.name} className={playerClass} onClick={onClick}>
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
