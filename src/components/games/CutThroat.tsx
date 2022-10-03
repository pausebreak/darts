import * as React from "react";
import { useStore } from "../../machine";
import { TouchInput } from "../TouchInput";
import { ScoreBoard } from "./ScoreBoard";

export const CutThroat = () => {
  const currentGame = useStore((state) => state.game);

  return (
    <>
      {currentGame && (
        <>
          <ScoreBoard />
          <TouchInput />
        </>
      )}
    </>
  );
};
