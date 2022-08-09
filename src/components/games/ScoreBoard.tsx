import isBlank from "@sedan-utils/is-blank";
import * as React from "react";
import { isMarkClearedForEveryone, playerMarks, playersScoresCricket } from "../../games";
import { useStore } from "../../machine";
import { Mark } from "../../types";

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

export const ScoreBoard = () => {
  const game = useStore((state) => state.game);
  const players = useStore((state) => state.players);

  const numOfPlayers = players.length;
  const half = Math.floor(numOfPlayers / 2);
  const playerScores = playersScoresCricket(game, players);

  return (
    <div className="scoreBoard">
      {players.map((player, playerIndex) => {
        if (playerIndex >= half) {
          return;
        }

        const marks = playerMarks(player);
        const score = playerScores[playerIndex];

        return (
          <div className="column" key={`${player.name}`}>
            <div className="playerForRow">
              {player.name}
              {game.pointing && <div className="score">{score}</div>}
            </div>
            {game.marks.map((mark) => boardMark(marks[mark], mark.toString()))}
          </div>
        );
      })}

      <div className="column">
        <div className="playerForRow">
          &nbsp;
          {game.pointing && <div>&nbsp;</div>}
        </div>
        {game.marks.map((mark) => {
          const cls = isMarkClearedForEveryone(players, mark) ? "cleared" : "";
          const markLabel = mark === Mark.Bull ? "Bull" : mark;

          return (
            <div className={cls} key={mark}>
              {markLabel}
            </div>
          );
        })}
      </div>

      {players.map((player, playerIndex) => {
        if (playerIndex < half) {
          return;
        }

        const marks = playerMarks(player);
        const score = playerScores[playerIndex];

        return (
          <div className="column" key={`${player.name}`}>
            <div className="playerForRow">
              {player.name}
              {game.pointing && <div className="score">{score}</div>}
            </div>
            {game.marks.map((mark) => boardMark(marks[mark], mark.toString()))}
          </div>
        );
      })}
    </div>
  );
};
