import {
  areMarksCleared,
  bulls,
  cutThroat,
  dartValue,
  findLastPlayerToThrow,
  gameOperations,
  ohGames,
  tactical,
} from "./games";
import { Dart, Game, GameName, Mark, Multiple, Player } from "./types";

describe("findLastPlayerToThrow", () => {
  it("handles the start of a game ( no darts thrown yet ) one player", () => {
    const player = { name: "me", darts: [] };
    const result = findLastPlayerToThrow([player], 0);
    expect(result).toBe(player);
  });

  it("handles the start of a game ( no darts thrown yet ) more than one player", () => {
    const player = { name: "me", darts: [] };
    const result = findLastPlayerToThrow([player, { name: "them", darts: [] }], 0);
    expect(result).toBe(player);
  });

  it("handles the start of a game ( no darts thrown yet ) more than one player", () => {
    const player: Player = {
      name: "me",
      darts: [
        [Mark.Miss, Multiple.Single],
        [Mark.Miss, Multiple.Single],
        [Mark.Miss, Multiple.Single],
      ],
    };
    const result = findLastPlayerToThrow([player, { name: "them", darts: [] }], 1);
    expect(result).toBe(player);
  });
});

describe("dartValue", () => {
  it("adds", () => {
    const result = dartValue([Mark.Bull, Multiple.Double]);
    expect(result).toBe(50);
  });

  it("handles a pointing double", () => {
    const dart: Dart = [Mark.Double, Multiple.Single, Mark.Eight];
    const result = dartValue(dart);
    expect(result).toBe(16);
  });

  it("handles a pointing triple", () => {
    const dart: Dart = [Mark.Triple, Multiple.Single, Mark.Eight];
    const result = dartValue(dart);
    expect(result).toBe(24);
  });
});

describe("areMarksCleared", () => {
  const game = ohGames(101);
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

describe("gameOperations", () => {
  it("returns a bulls ops", () => {
    const game = bulls();
    const result = gameOperations(game);

    expect(result).toBeDefined();
    expect(result.stats).not.toBeDefined();
  });

  it("returns a cutThroat ops", () => {
    const game = cutThroat();
    const result = gameOperations(game);

    expect(result).toBeDefined();
    expect(result.stats).toBeDefined();
  });

  it("returns a Tactical ops", () => {
    const game = tactical(false);
    const result = gameOperations(game);

    expect(result).toBeDefined();
    expect(result.stats).toBeDefined();
  });

  it("returns defaults ops before a game is chosen", () => {
    const result = gameOperations(null);

    expect(result).toBeDefined();
    expect(result.didWin([], 0)).toBeFalsy();
    expect(result.validThrow(0, [{ name: "me", darts: [] }], [Mark.Bull, Multiple.Single])).toBeFalsy();
  });
});
