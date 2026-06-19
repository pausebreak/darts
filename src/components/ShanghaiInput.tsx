import React, { useEffect } from "react";
import { useStore } from "../machine";
import { Mark, Multiple } from "../types";
import "./TouchInput.css";
import "./ShanghaiInput.css";

export const ShanghaiInput = () => {
  const addThrowToCurrentPlayer = useStore((state) => state.addThrowToCurrentPlayer);
  const currentPlayerIndex = useStore((state) => state.currentPlayerIndex);
  const players = useStore((state) => state.players);
  const goBack = useStore((state) => state.goBack);
  const finishRound = useStore((state) => state.finishRound);
  const marks = useStore((state) => state.game)?.marks;
  const invalidThrow = useStore((state) => state.invalidThrow);
  const setInvalidThrow = useStore((state) => state.setInvalidThrow);

  const dartsThrown = players[currentPlayerIndex]?.darts.length ?? 0;
  const roundIndex = Math.min(Math.floor(dartsThrown / 3), marks.length - 1);
  const mark = marks[roundIndex];

  const onClick = (multiple: Multiple) => (event) => {
    event.preventDefault();
    addThrowToCurrentPlayer([mark, multiple]);
  };

  const onMiss = (event) => {
    event.preventDefault();
    addThrowToCurrentPlayer([Mark.Miss, Multiple.Single]);
  };

  useEffect(() => {
    new Promise((resolve) => setTimeout(resolve, 250)).then(() => {
      setInvalidThrow(false);
    });
  }, [invalidThrow]);

  return (
    <>
      <div className="shanghai-round">
        Round {roundIndex + 1} of {marks.length}
      </div>
      <div className={invalidThrow ? "marks shanghai invalid" : "marks shanghai"}>
        <button onClick={onClick(Multiple.Single)}>{mark}</button>
        <button onClick={onClick(Multiple.Double)}>Double {mark}</button>
        <button onClick={onClick(Multiple.Triple)}>Triple {mark}</button>
        <button onClick={onMiss}>Miss</button>
      </div>
      <div className="controls">
        <button onClick={goBack}>Back</button>
        <button onClick={finishRound}>Next</button>
      </div>
    </>
  );
};
