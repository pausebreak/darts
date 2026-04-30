import React from "react";
import "./DartLabel.css";
import { Mark, Multiple, Dart } from "../types";

export const DartLabel: React.FC<{ dart: Dart; condensed?: boolean }> = ({ dart, condensed = false }) => {
  if (condensed) {
    let value: Mark | string = dart[0];

    switch (dart[0]) {
      case Mark.Bull:
        value = "B";
        break;
      case Mark.Miss:
        value = "-";
        break;
    }

    return (
      <div className="dart condensed">
        {dart[1] !== Multiple.Single && `${Multiple[dart[1]][0]}`}
        {value}
      </div>
    );
  }

  return (
    <div className="dart">
      {dart[1] !== Multiple.Single && `${Multiple[dart[1]]} `}
      {Mark[dart[0]]}
    </div>
  );
};
