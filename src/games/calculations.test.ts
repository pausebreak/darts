import { Mark, Multiple, Player } from "../types";
import { countAllDarts } from "./calculations";

describe("countAllDarts", () => {
  const player: Player = {
    name: "me",
    darts: [
      [Mark.Fifteen, Multiple.Triple],
      [Mark.Sixteen, Multiple.Triple],
      [Mark.Seventeen, Multiple.Triple],
      [Mark.Eighteen, Multiple.Triple],
      [Mark.Nineteen, Multiple.Triple],
      [Mark.Twenty, Multiple.Triple],
      [Mark.Bull, Multiple.Double],
      [Mark.Bull, Multiple.Single],
    ],
  };

  it("counts 1 player", () => {
    const result = countAllDarts([player]);

    expect(result).toBe(8);
  });

  it("counts 3 player3", () => {
    const result = countAllDarts([player, player, player]);

    expect(result).toBe(24);
  });
});
