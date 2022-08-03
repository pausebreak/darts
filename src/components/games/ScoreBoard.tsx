import isBlank from "@sedan-utils/is-blank";
import * as React from "react";
import { isMarkCleared, playerMarks } from "../../games";
import { useStore } from "../../machine";
import { Mark, Player } from "../../types";

import "./ScoreBoard.css";

const boardMark = (numOfMarks: number, aKey: string) => {
  if (isBlank(numOfMarks)) {
    return <div key={aKey}>&nbsp;</div>;
  }

  if (numOfMarks === 1) {
    return <div key={aKey}>\</div>;
  }

  if (numOfMarks === 2) {
    return <div key={aKey}>X</div>;
  }

  return (
    <div key={aKey} className="above">
      <div className="behind">X</div>O
    </div>
  );
};

const isMarkClearedForEveryone = (mark: Mark, players: Player[]) =>
  players.reduce((acc, player) => {
    if (!isMarkCleared(player, mark)) {
      return false;
    }

    return acc;
  }, true);

export const ScoreBoard = () => {
  const game = useStore((state) => state.game);
  const players = useStore((state) => state.players);

  const numOfPlayers = players.length;
  const half = Math.floor(numOfPlayers / 2);
  const gameMarks = game.marks;

  return (
    <div className="scoreBoard">
      {players
        .filter((p, i) => i < half)
        .map((player) => {
          const marks = playerMarks(player);
          const score = 0;

          return (
            <div className="column" key={`${player.name}`}>
              <div className="playerForRow">{player.name}</div>
              {game.pointing && <div className="score">{score}</div>}
              {gameMarks.map((mark) => boardMark(marks[mark], mark.toString()))}
            </div>
          );
        })}

      <div className="column">
        <div className="playerForRow">&nbsp;</div>
        {game.pointing && <div>&nbsp;</div>}
        {gameMarks.map((mark) => {
          const cls = isMarkClearedForEveryone(mark, players) ? "cleared" : "";
          const markLabel = mark === Mark.Bull ? "Bull" : mark;

          return (
            <div className={cls} key={mark}>
              {markLabel}
            </div>
          );
        })}
      </div>

      {players
        .filter((p, i) => i >= half)
        .map((player) => {
          const marks = playerMarks(player);

          return (
            <div className="column" key={`${player.name}`}>
              <div className="playerForRow">{player.name}</div>
              {gameMarks.map((mark) => boardMark(marks[mark], mark.toString()))}
            </div>
          );
        })}
    </div>
  );
};
