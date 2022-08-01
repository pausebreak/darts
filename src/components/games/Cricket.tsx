import * as React from "react";
import { useStore } from "../../machine";
import { TouchInput } from "../TouchInput";
import { ScoreBoard } from "./ScoreBoard";

export const Cricket = () => {
  const currentGame = useStore((state) => state.game);
  const invalidThrow = useStore((state) => state.invalidThrow);

  return (
    <>
      {invalidThrow && <span style={{ color: "red" }}>Invalid Throw</span>}
      {currentGame && (
        <>
          <ScoreBoard />
          <TouchInput />
        </>
      )}
    </>
  );
};
