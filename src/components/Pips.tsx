import React from "react";
import "./Pips.css";

export const Pips: React.FC<{ numThrown: number }> = ({ numThrown }) => (
  <div className="pips">
    <div className={numThrown > 0 ? 'filled' : 'empty'}/>
    &nbsp;
    <div className={numThrown > 1 ? 'filled' : 'empty'}/>
    &nbsp;
    <div className={numThrown > 2 ? 'filled' : 'empty'}/>
    </div>
);
