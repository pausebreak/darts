import React from "react";
import { useStore } from "../machine";
import { Mark, Multiple, Dart } from "../types";
import "./TouchInput.css";

export const TouchInput = () => {
  const addThrowToCurrentPlayer = useStore((state) => state.addThrowToCurrentPlayer);
  const goBack = useStore((state) => state.goBack);
  const marks = useStore((state) => state.game)?.marks;

  const onClick = (_throw: Dart) => (event) => {
    event.preventDefault();
    addThrowToCurrentPlayer(_throw);
  };

  return (
    <div className="marks">
      {marks.includes(Mark.One) && (
        <div className="markGroup">
          <button onClick={onClick([Mark.One, Multiple.Single])}>1</button>
          <button onClick={onClick([Mark.One, Multiple.Double])}>D 1</button>
          <button onClick={onClick([Mark.One, Multiple.Triple])}>T 1</button>
        </div>
      )}
      {marks.includes(Mark.Two) && (
        <div className="markGroup">
          <button onClick={onClick([Mark.Two, Multiple.Single])}>2</button>
          <button onClick={onClick([Mark.Two, Multiple.Double])}>D 2</button>
          <button onClick={onClick([Mark.Two, Multiple.Triple])}>T 2</button>
        </div>
      )}
      {marks.includes(Mark.Three) && (
        <div className="markGroup">
          <button onClick={onClick([Mark.Three, Multiple.Single])}>3</button>
          <button onClick={onClick([Mark.Three, Multiple.Double])}>D 3</button>
          <button onClick={onClick([Mark.Three, Multiple.Triple])}>T 3</button>
        </div>
      )}
      {marks.includes(Mark.Four) && (
        <div className="markGroup">
          <button onClick={onClick([Mark.Four, Multiple.Single])}>4</button>
          <button onClick={onClick([Mark.Four, Multiple.Double])}>D 4</button>
          <button onClick={onClick([Mark.Four, Multiple.Triple])}>T 4</button>
        </div>
      )}
      {marks.includes(Mark.Five) && (
        <div className="markGroup">
          <button onClick={onClick([Mark.Five, Multiple.Single])}>5</button>
          <button onClick={onClick([Mark.Five, Multiple.Double])}>D 5</button>
          <button onClick={onClick([Mark.Five, Multiple.Triple])}>T 5</button>
        </div>
      )}
      {marks.includes(Mark.Six) && (
        <div className="markGroup">
          <button onClick={onClick([Mark.Six, Multiple.Single])}>6</button>
          <button onClick={onClick([Mark.Six, Multiple.Double])}>D 6</button>
          <button onClick={onClick([Mark.Six, Multiple.Triple])}>T 6</button>
        </div>
      )}
      {marks.includes(Mark.Seven) && (
        <div className="markGroup">
          <button onClick={onClick([Mark.Seven, Multiple.Single])}>7</button>
          <button onClick={onClick([Mark.Seven, Multiple.Double])}>D 7</button>
          <button onClick={onClick([Mark.Seven, Multiple.Triple])}>T 7</button>
        </div>
      )}
      {marks.includes(Mark.Eight) && (
        <div className="markGroup">
          <button onClick={onClick([Mark.Eight, Multiple.Single])}>8</button>
          <button onClick={onClick([Mark.Eight, Multiple.Double])}>D 8</button>
          <button onClick={onClick([Mark.Eight, Multiple.Triple])}>T 8</button>
        </div>
      )}
      {marks.includes(Mark.Nine) && (
        <div className="markGroup">
          <button onClick={onClick([Mark.Nine, Multiple.Single])}>9</button>
          <button onClick={onClick([Mark.Nine, Multiple.Double])}>D 9</button>
          <button onClick={onClick([Mark.Nine, Multiple.Triple])}>T 9</button>
        </div>
      )}
      {marks.includes(Mark.Ten) && (
        <div className="markGroup">
          <button onClick={onClick([Mark.Ten, Multiple.Single])}>10</button>
          <button onClick={onClick([Mark.Ten, Multiple.Double])}>D 10</button>
          <button onClick={onClick([Mark.Ten, Multiple.Triple])}>T 10</button>
        </div>
      )}
      {marks.includes(Mark.Eleven) && (
        <div className="markGroup">
          <button onClick={onClick([Mark.Eleven, Multiple.Single])}>11</button>
          <button onClick={onClick([Mark.Eleven, Multiple.Double])}>D 11</button>
          <button onClick={onClick([Mark.Eleven, Multiple.Triple])}>T 11</button>
        </div>
      )}
      {marks.includes(Mark.Twelve) && (
        <div className="markGroup">
          <button onClick={onClick([Mark.Twelve, Multiple.Single])}>12</button>
          <button onClick={onClick([Mark.Twelve, Multiple.Double])}>D 12</button>
          <button onClick={onClick([Mark.Twelve, Multiple.Triple])}>T 12</button>
        </div>
      )}
      {marks.includes(Mark.Thirteen) && (
        <div className="markGroup">
          <button onClick={onClick([Mark.Thirteen, Multiple.Single])}>13</button>
          <button onClick={onClick([Mark.Thirteen, Multiple.Double])}>D 13</button>
          <button onClick={onClick([Mark.Thirteen, Multiple.Triple])}>T 13</button>
        </div>
      )}
      {marks.includes(Mark.Fourteen) && (
        <div className="markGroup">
          <button onClick={onClick([Mark.Fourteen, Multiple.Single])}>14</button>
          <button onClick={onClick([Mark.Fourteen, Multiple.Double])}>D 14</button>
          <button onClick={onClick([Mark.Fourteen, Multiple.Triple])}>T 14</button>
        </div>
      )}
      {marks.includes(Mark.Fifteen) && (
        <div className="markGroup">
          <button onClick={onClick([Mark.Fifteen, Multiple.Single])}>15</button>
          <button onClick={onClick([Mark.Fifteen, Multiple.Double])}>D 15</button>
          <button onClick={onClick([Mark.Fifteen, Multiple.Triple])}>T 15</button>
        </div>
      )}
      {marks.includes(Mark.Sixteen) && (
        <div className="markGroup">
          <button onClick={onClick([Mark.Sixteen, Multiple.Single])}>16</button>
          <button onClick={onClick([Mark.Sixteen, Multiple.Double])}>D 16</button>
          <button onClick={onClick([Mark.Sixteen, Multiple.Triple])}>T 16</button>
        </div>
      )}
      {marks.includes(Mark.Seventeen) && (
        <div className="markGroup">
          <button onClick={onClick([Mark.Seventeen, Multiple.Single])}>17</button>
          <button onClick={onClick([Mark.Seventeen, Multiple.Double])}>D 17</button>
          <button onClick={onClick([Mark.Seventeen, Multiple.Triple])}>T 17</button>
        </div>
      )}
      {marks.includes(Mark.Eighteen) && (
        <div className="markGroup">
          <button onClick={onClick([Mark.Eighteen, Multiple.Single])}>18</button>
          <button onClick={onClick([Mark.Eighteen, Multiple.Double])}>D 18</button>
          <button onClick={onClick([Mark.Eighteen, Multiple.Triple])}>T 18</button>
        </div>
      )}
      {marks.includes(Mark.Nineteen) && (
        <div className="markGroup">
          <button onClick={onClick([Mark.Nineteen, Multiple.Single])}>19</button>
          <button onClick={onClick([Mark.Nineteen, Multiple.Double])}>D 19</button>
          <button onClick={onClick([Mark.Nineteen, Multiple.Triple])}>T 19</button>
        </div>
      )}
      {marks.includes(Mark.Twenty) && (
        <div className="markGroup">
          <button onClick={onClick([Mark.Twenty, Multiple.Single])}>20</button>
          <button onClick={onClick([Mark.Twenty, Multiple.Double])}>D 20</button>
          <button onClick={onClick([Mark.Twenty, Multiple.Triple])}>T 20</button>
        </div>
      )}
      {marks.includes(Mark.Bull) && (
        <div className="markGroup longer">
          <button onClick={onClick([Mark.Bull, Multiple.Single])}>Bull</button>
          <button onClick={onClick([Mark.Bull, Multiple.Double])}>D Bull</button>
        </div>
      )}

      <div className="markGroup longer">
        <button onClick={onClick([Mark.Miss, Multiple.Single])}>Miss</button>
        <button onClick={goBack}>Back</button>
      </div>
    </div>
  );
};
