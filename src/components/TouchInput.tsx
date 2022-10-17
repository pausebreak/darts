import React, { useEffect, useState } from "react";
import { useStore } from "../machine";
import { Mark, Multiple, Dart } from "../types";
import "./TouchInput.css";

export const TouchInput = () => {
  const addThrowToCurrentPlayer = useStore((state) => state.addThrowToCurrentPlayer);
  const currentPlayerIndex = useStore((state) => state.currentPlayerIndex);
  const players = useStore((state) => state.players);
  const goBack = useStore((state) => state.goBack);
  const marks = useStore((state) => state.game)?.marks;
  const multiples = useStore((state) => state.game)?.multiples;
  const invalidThrow = useStore((state) => state.invalidThrow);
  const setInvalidThrow = useStore((state) => state.setInvalidThrow);

  const [double, setDouble] = useState(false);
  const [triple, setTriple] = useState(false);

  const onClick = (_throw: Dart) => (event) => {
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
    const numberThrown = players[currentPlayerIndex].darts.length;
    for (let i = numberThrown % 3; i < 3; i++) {
      addThrowToCurrentPlayer([Mark.Miss, Multiple.Single]);
    }
  };

  let className = invalidThrow ? "marks invalid" : "marks";
  if (marks.length > 6) {
    className = `${className} long`;
  }

  useEffect(() => {
    new Promise((resolve) => setTimeout(resolve, 250)).then(() => {
      setInvalidThrow(false);
    });
  }, [invalidThrow]);

  const doubleClass = double ? "engaged" : "";
  const tripleClass = triple ? "engaged" : "";

  return (
    <>
      <div className={className}>
        {marks.includes(Mark.One) && <button onClick={onClick([Mark.One, Multiple.Single])}>1</button>}
        {marks.includes(Mark.Two) && <button onClick={onClick([Mark.Two, Multiple.Single])}>2</button>}
        {marks.includes(Mark.Three) && <button onClick={onClick([Mark.Three, Multiple.Single])}>3</button>}
        {marks.includes(Mark.Four) && <button onClick={onClick([Mark.Four, Multiple.Single])}>4</button>}
        {marks.includes(Mark.Five) && <button onClick={onClick([Mark.Five, Multiple.Single])}>5</button>}
        {marks.includes(Mark.Six) && <button onClick={onClick([Mark.Six, Multiple.Single])}>6</button>}
        {marks.includes(Mark.Seven) && <button onClick={onClick([Mark.Seven, Multiple.Single])}>7</button>}
        {marks.includes(Mark.Eight) && <button onClick={onClick([Mark.Eight, Multiple.Single])}>8</button>}
        {marks.includes(Mark.Nine) && <button onClick={onClick([Mark.Nine, Multiple.Single])}>9</button>}
        {marks.includes(Mark.Ten) && <button onClick={onClick([Mark.Ten, Multiple.Single])}>10</button>}
        {marks.includes(Mark.Eleven) && <button onClick={onClick([Mark.Eleven, Multiple.Single])}>11</button>}
        {marks.includes(Mark.Twelve) && <button onClick={onClick([Mark.Twelve, Multiple.Single])}>12</button>}
        {marks.includes(Mark.Thirteen) && <button onClick={onClick([Mark.Thirteen, Multiple.Single])}>13</button>}
        {marks.includes(Mark.Fourteen) && <button onClick={onClick([Mark.Fourteen, Multiple.Single])}>14</button>}
        {marks.includes(Mark.Fifteen) && <button onClick={onClick([Mark.Fifteen, Multiple.Single])}>15</button>}
        {marks.includes(Mark.Sixteen) && <button onClick={onClick([Mark.Sixteen, Multiple.Single])}>16</button>}
        {marks.includes(Mark.Seventeen) && <button onClick={onClick([Mark.Seventeen, Multiple.Single])}>17</button>}
        {marks.includes(Mark.Eighteen) && <button onClick={onClick([Mark.Eighteen, Multiple.Single])}>18</button>}
        {marks.includes(Mark.Nineteen) && <button onClick={onClick([Mark.Nineteen, Multiple.Single])}>19</button>}
        {marks.includes(Mark.Twenty) && <button onClick={onClick([Mark.Twenty, Multiple.Single])}>20</button>}
        {marks.includes(Mark.Bull) && (
          <button onClick={onClick([Mark.Bull, Multiple.Single])} disabled={triple}>
            Bull
          </button>
        )}

        <button onClick={onClick([Mark.Miss, Multiple.Single])}>Miss</button>
      </div>
      <div className="controls">
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
