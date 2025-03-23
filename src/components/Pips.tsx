import React from "react";
import "./Pips.css";

export const Pips: React.FC<{ numThrown: number }> = ({ numThrown }) => (
  <div className="pips">
    {numThrown > 0 ? <div className="filled" /> : <div className="empty" />}
    &nbsp;
    {numThrown > 1 ? <div className="filled" /> : <div className="empty" />}
    &nbsp;
    {numThrown > 2 ? <div className="filled" /> : <div className="empty" />}
    </div>
);
