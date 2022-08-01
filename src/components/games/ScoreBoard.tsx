import isBlank from "@sedan-utils/is-blank";
import * as React from "react";
import { isMarkCleared, playerMarks } from "../../games";
import { useStore } from "../../machine";
import { Mark } from "../../types";

import "./ScoreBoard.css";

const boardMark = (numOfMarks: number) => {
  if (isBlank(numOfMarks)) {
    return <div>&nbsp;</div>;
  }

  if (numOfMarks === 1) {
    return <div>\</div>;
  }

  if (numOfMarks === 2) {
    return <div>X</div>;
  }

  return <div>O</div>;
};

export const ScoreBoard = () => {
  const game = useStore((state) => state.game);
  const players = useStore((state) => state.players);

  const numOfPlayers = players.length;
  const half = Math.floor(numOfPlayers / 2);
  const gameMarks = game.marks;

  const isMarkClearedForEveryone = (mark: Mark) =>
    players.reduce((acc, player) => {
      if (!isMarkCleared(player, mark)) {
        return false;
      }

      return acc;
    }, true);

  return (
    <div className="scoreBoard">
      {players
        .filter((p, i) => i < half)
        .map((player) => {
          const marks = playerMarks(player);
          const score = 0;

          return (
            <>
              <div className="row">
                <div className="playerForRow">{player.name}</div>
                {game.pointing && <div className="score">{score}</div>}
                {gameMarks.map((mark) => boardMark(marks[mark]))}
              </div>
            </>
          );
        })}

      <div className="row">
        <div className="playerForRow">&nbsp;</div>
        {game.pointing && <div>&nbsp;</div>}
        {gameMarks.map((mark) => {
          const cls = isMarkClearedForEveryone(mark) ? "cleared" : "";
          return <div className={cls}>{mark}</div>;
        })}
      </div>

      {players
        .filter((p, i) => i >= half)
        .map((player) => {
          const marks = playerMarks(player);

          return (
            <div className="row">
              <div className="playerForRow">{player.name}</div>
              {gameMarks.map((mark) => boardMark(marks[mark]))}
            </div>
          );
        })}
    </div>
  );
};
