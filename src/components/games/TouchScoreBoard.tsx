import isBlank from "@sedan-utils/is-blank";
import * as React from "react";
import { gameOperations, isMarkCleared, isMarkClearedForEveryone, playerMarks } from "../../games";
import { useStore } from "../../machine";
import { Dart, Mark, Multiple } from "../../types";

import "./ScoreBoard.css";
import { useEffect, useState } from "react";
import { Pips } from "../Pips";
import { PointingTouchInput } from "./PointingTouchInput";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const doubleNoOp = () => () => {};

const boardMark = (numOfMarks: number, aKey: string, onClick: React.MouseEventHandler) => {
  if (isBlank(numOfMarks)) {
    return (
      <div
        key={aKey}
        onClick={(event) => {
          onClick(event);
        }}
      >
        &nbsp;
      </div>
    );
  }

  if (numOfMarks === 1) {
    return (
      <div key={aKey} className="slash" onClick={onClick}>
        \
      </div>
    );
  }

  if (numOfMarks === 2) {
    return (
      <div key={aKey} className="x" onClick={onClick}>
        X
      </div>
    );
  }

  return (
    <div key={aKey} className="x above" onClick={onClick}>
      <div className="behind">X</div>O
    </div>
  );
};

const markLabel = (mark: Mark) => {
  switch (mark) {
    case Mark.Triple:
      return "T";
    case Mark.Double:
      return "D";
    case Mark.Bull:
      return "Bull";
    default:
      return mark;
  }
};

export const TouchScoreBoard = () => {
  const game = useStore((state) => state.game);
  const players = useStore((state) => state.players);
  const currentPlayerIndex = useStore((state) => state.currentPlayerIndex);
  const addThrowToCurrentPlayer = useStore((state) => state.addThrowToCurrentPlayer);
  const goBack = useStore((state) => state.goBack);
  const multiples = useStore((state) => state.game)?.multiples;
  const invalidThrow = useStore((state) => state.invalidThrow);
  const setInvalidThrow = useStore((state) => state.setInvalidThrow);
  const finishRound = useStore((state) => state.finishRound);
  const [double, setDouble] = useState(false);
  const [triple, setTriple] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [doubleOrTriple, setDoubleOrTriple] = useState<Mark>(undefined);

  const numOfPlayers = players.length;
  const half = Math.floor(numOfPlayers / 2);
  const even = numOfPlayers % 2 === 0;
  const playerScores = gameOperations(game).stats?.(players);

  const onClick = (event: React.MouseEvent<HTMLElement, MouseEvent>, _throw: Dart) => {
    event.preventDefault();

    if (double) {
      addThrowToCurrentPlayer([_throw[0], Multiple.Double]);
      setDouble(false);
    } else if (triple) {
      addThrowToCurrentPlayer([_throw[0], Multiple.Triple]);
      setTriple(false);
    } else {
      addThrowToCurrentPlayer(_throw);
    }
  };

  const onDouble = () => {
    if (double) {
      setDouble(false);
    } else {
      setDouble(true);
      setTriple(false);
    }
  };

  const onTriple = () => {
    if (triple) {
      setTriple(false);
    } else {
      setDouble(false);
      setTriple(true);
    }
  };

  const onFinishTurn = () => {
    setDouble(false);
    setTriple(false);

    finishRound();
  };

  const clicker = (mark: Mark) => {
    addThrowToCurrentPlayer([doubleOrTriple, Multiple.Single, mark]);
    setShowGrid(false);
    setDoubleOrTriple(undefined);
  };

  const className = invalidThrow ? "invalid" : "";

  useEffect(() => {
    new Promise((resolve) => setTimeout(resolve, 250)).then(() => {
      setInvalidThrow(false);
    });
  }, [invalidThrow]);

  const doubleClass = double ? "engaged" : "";
  const tripleClass = triple ? "engaged" : "";

  if (showGrid) {
    return <PointingTouchInput onClicks={clicker} />;
  }

  const handleMarkClick = (mark: Mark) => (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (game.pointing && [Mark.Double, Mark.Triple].includes(mark)) {
      const marks = playerMarks(players[currentPlayerIndex]);
      const cleared = marks[mark] >= 3;
      if (cleared) {
        setShowGrid(true);
        setDoubleOrTriple(mark);
        return;
      }
    }
    onClick(event, [mark, Multiple.Single]);
  };

  return (
    <>
      <div className="scoreBoard">
        {!even && (
          <div className="column" key="blank">
            <div className="playerForRow">
              <div>&nbsp;</div>
              {game.pointing && playerScores && <div className="score">&nbsp;</div>}
            </div>
            {game.marks.map((mark, index) => (
              <div key={index}>&nbsp;</div>
            ))}
          </div>
        )}

        {players.map((player, playerIndex) => {
          if (playerIndex >= half) {
            return;
          }

          const isCurrentPlayer = playerIndex === currentPlayerIndex;
          const marks = playerMarks(player);
          const score = playerScores?.scores[playerIndex];
          const currentPlayer = isCurrentPlayer ? "playerForRow current" : "playerForRow";
          const onMarkClick = isCurrentPlayer ? handleMarkClick : doubleNoOp;

          return (
            <div className="column" key={`${player.name}`}>
              <div className={currentPlayer}>
                <div className="name">{player.name}</div>
                {game.pointing && playerScores && <div className="score">{score}</div>}
              </div>
              {game.marks.map((mark) => boardMark(marks[mark], mark.toString(), onMarkClick(mark)))}
            </div>
          );
        })}

        <div className="column">
          <div className="playerForRow">
            <Pips numThrown={players[currentPlayerIndex].darts.length % 3} />
            {game.pointing && playerScores && <div className="score">&nbsp;</div>}
          </div>
          {game.marks.map((mark) => {
            let cls = "markLabel";
            const clearedForThisPlayer = isMarkCleared(players[currentPlayerIndex], mark);
            const clearedForAll = isMarkClearedForEveryone(players, mark);
            if (clearedForAll || (clearedForThisPlayer && !game.pointing)) {
              cls = `${cls} cleared`;
            }

            return (
              <div className={cls} key={mark} onClick={handleMarkClick(mark)}>
                {clearedForAll && game.pointing && <div className="strikeThrough" />}
                {markLabel(mark)}
              </div>
            );
          })}
        </div>

        {players.map((player, playerIndex) => {
          if (playerIndex < half) {
            return;
          }

          const marks = playerMarks(player);
          const score = playerScores?.scores[playerIndex];
          const isCurrentPlayer = playerIndex === currentPlayerIndex;
          const currentPlayer = isCurrentPlayer ? "playerForRow current" : "playerForRow";
          const onMarkClick = isCurrentPlayer ? handleMarkClick : doubleNoOp;

          return (
            <div className="column" key={`${player.name}`}>
              <div className={currentPlayer}>
                <div className="name">{player.name}</div>
                {game.pointing && playerScores && <div className="score">{score}</div>}
              </div>
              {game.marks.map((mark) => boardMark(marks[mark], mark.toString(), onMarkClick(mark)))}
            </div>
          );
        })}
      </div>
      <div className={`controls ${className}`}>
        <button onClick={goBack}>Back</button>
        <button onClick={onDouble} className={doubleClass}>
          Double
        </button>
        {multiples?.includes(Multiple.Triple) && (
          <button onClick={onTriple} className={tripleClass}>
            Triple
          </button>
        )}
        <button onClick={onFinishTurn}>Next</button>
      </div>
    </>
  );
};
