import React from "react";
import "./Pips.css";
import { Dart } from "../types";
import { DartLabel } from "./DartLabel";

export const Pips: React.FC<{ dartsThisRound: Dart[] }> = ({ dartsThisRound }) => (
  <div className="pips name">
    &nbsp;
    <div>
      {dartsThisRound.length === 0 && <div className="empty" />}
      {dartsThisRound[0] && <DartLabel condensed={true} dart={dartsThisRound[0]} />}
    </div>
    <div>
      {dartsThisRound.length <= 1 && <div className="empty" />}
      {dartsThisRound[1] && <DartLabel condensed={true} dart={dartsThisRound[1]} />}
    </div>
    <div>
      <div className="empty" />
    </div>
    &nbsp;
  </div>
);
