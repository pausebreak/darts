import { areMarksCleared, dartValue, ohGames } from "./games";
import { Game, GameName, Mark, Multiple, Player } from "./types";

describe("dartValue", () => {
  it("adds", () => {
    const result = dartValue([Mark.Bull, Multiple.Double]);
    expect(result).toBe(50);
  });
});

describe("areMarksCleared", () => {
  const game = ohGames();
  const player: Player = { name: "me", darts: [] };

  it("handles no darts", () => {
    const result = areMarksCleared(game, player);

    expect(result).toBe(false);
  });

  it("will see all cleared marks and ignore misses", () => {
    const smallGame: Game = {
      name: GameName.Bulls,
      checkIn: Multiple.Single,
      checkOut: Multiple.Single,
      limit: 50,
      marks: [Mark.Bull],
      multiples: [Multiple.Single, Multiple.Double, Multiple.Triple],
      clear: false,
      pointing: false,
    };
    const aPlayer: Player = {
      name: "me",
      darts: [
        [Mark.Miss, Multiple.Single],
        [Mark.Miss, Multiple.Single],
        [Mark.Bull, Multiple.Single],
        [Mark.Bull, Multiple.Double],
      ],
    };
    const result = areMarksCleared(smallGame, aPlayer);

    expect(result).toBe(true);
  });
});
