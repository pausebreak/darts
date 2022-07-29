import React from "react";
import { DartLabel } from "./DartLabel";
import { useStore } from "../machine";
import { dartValue } from "../games";

import "./Players.css";

export const Players = () => {
  const players = useStore((state) => state.players);

  return (
    <div className="players">
      {players.map((player) => {
        const total = player.darts.reduce((acc, thrw) => acc + dartValue(thrw), 0);
        const dartsThrown = player.darts.length;
        let last3Throws = [];

        const remainder = dartsThrown % 3;
        const lastRoundThrow = dartsThrown - remainder;

        last3Throws = player.darts.slice(lastRoundThrow - 3, lastRoundThrow);

        return (
          <div key={player.name} className="player">
            {player.name} {total}{" "}
            {last3Throws.length > 0 && (
              <>
                -
                {last3Throws.map((dart, idx) => (
                  <DartLabel key={`${idx}${dart}`} condensed={true} dart={dart} />
                ))}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
