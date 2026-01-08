import React from "react";
import { Mark } from "../../types";
import "../TouchInput.css";

const marks = [
  Mark.One,
  Mark.Two,
  Mark.Three,
  Mark.Four,
  Mark.Five,
  Mark.Six,
  Mark.Seven,
  Mark.Eight,
  Mark.Nine,
  Mark.Ten,
  Mark.Eleven,
  Mark.Twelve,
  Mark.Thirteen,
  Mark.Fourteen,
  Mark.Fifteen,
  Mark.Sixteen,
  Mark.Seventeen,
  Mark.Eighteen,
  Mark.Nineteen,
  Mark.Twenty,
];

export const PointingTouchInput: React.FC<{ onClicks: (mark: Mark) => void }> = ({ onClicks }) => {
  const onClick = (mark: Mark) => (event) => {
    event.preventDefault();
    onClicks(mark);
  };

  let className = "marks";
  if (marks.length > 6) {
    className = `${className} long`;
  }

  return (
    <>
      <div className={className}>
        {marks.includes(Mark.One) && <button onClick={onClick(Mark.One)}>1</button>}
        {marks.includes(Mark.Two) && <button onClick={onClick(Mark.Two)}>2</button>}
        {marks.includes(Mark.Three) && <button onClick={onClick(Mark.Three)}>3</button>}
        {marks.includes(Mark.Four) && <button onClick={onClick(Mark.Four)}>4</button>}
        {marks.includes(Mark.Five) && <button onClick={onClick(Mark.Five)}>5</button>}
        {marks.includes(Mark.Six) && <button onClick={onClick(Mark.Six)}>6</button>}
        {marks.includes(Mark.Seven) && <button onClick={onClick(Mark.Seven)}>7</button>}
        {marks.includes(Mark.Eight) && <button onClick={onClick(Mark.Eight)}>8</button>}
        {marks.includes(Mark.Nine) && <button onClick={onClick(Mark.Nine)}>9</button>}
        {marks.includes(Mark.Ten) && <button onClick={onClick(Mark.Ten)}>10</button>}
        {marks.includes(Mark.Eleven) && <button onClick={onClick(Mark.Eleven)}>11</button>}
        {marks.includes(Mark.Twelve) && <button onClick={onClick(Mark.Twelve)}>12</button>}
        {marks.includes(Mark.Thirteen) && <button onClick={onClick(Mark.Thirteen)}>13</button>}
        {marks.includes(Mark.Fourteen) && <button onClick={onClick(Mark.Fourteen)}>14</button>}
        {marks.includes(Mark.Fifteen) && <button onClick={onClick(Mark.Fifteen)}>15</button>}
        {marks.includes(Mark.Sixteen) && <button onClick={onClick(Mark.Sixteen)}>16</button>}
        {marks.includes(Mark.Seventeen) && <button onClick={onClick(Mark.Seventeen)}>17</button>}
        {marks.includes(Mark.Eighteen) && <button onClick={onClick(Mark.Eighteen)}>18</button>}
        {marks.includes(Mark.Nineteen) && <button onClick={onClick(Mark.Nineteen)}>19</button>}
        {marks.includes(Mark.Twenty) && <button onClick={onClick(Mark.Twenty)}>20</button>}
      </div>
    </>
  );
};
