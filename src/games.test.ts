import {
  areMarksCleared,
  bulls,
  cutThroat,
  dartValue,
  findLastPlayerToThrow,
  gameOperations,
  ohGames,
  tactical,
  mprForPlayerAsOfRound,
} from "./games";
import { Game, GameName, Mark, Multiple, Player } from "./types";

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

describe("mprForPlayerAsOfRound", () => {
  const { Miss, One, Bull } = Mark;
  const { Single, Double, Triple } = Multiple;

  it("returns 0.00 for a player with no darts", () => {
    const player: Player = { name: "Alice", darts: [] };
    expect(mprForPlayerAsOfRound(player, 1)).toBe("0.00");
  });

  it("calculates MPR for a single round with various marks", () => {
    const player: Player = {
      name: "Bob",
      darts: [
        [One, Single], // 1 mark
        [Bull, Double], // 2 marks (Bull = 25, but only value is multiple)
        [Miss, Single], // 0 marks
      ],
    };
    // total marks = 1 + 2 = 3, round = 1
    expect(mprForPlayerAsOfRound(player, 1)).toBe("3.00");
  });

  it("ignores darts after the specified round", () => {
    const player: Player = {
      name: "Carol",
      darts: [
        [One, Single], // 1
        [One, Double], // 2
        [One, Triple], // 3
        [Bull, Single], // 1 (should be ignored)
      ],
    };
    // Only first 3 darts count, total marks = 1+2+3 = 6, round = 1
    expect(mprForPlayerAsOfRound(player, 1)).toBe("6.00");
  });

  it("calculates MPR for multiple rounds", () => {
    const player: Player = {
      name: "Dave",
      darts: [
        [One, Single], // 1
        [One, Double], // 2
        [One, Triple], // 3
        [Bull, Single], // 1
        [Bull, Double], // 2
        [Miss, Single], // 0
      ],
    };
    // total marks = 1+2+3+1+2+0 = 9, rounds = 2
    expect(mprForPlayerAsOfRound(player, 2)).toBe("4.50");
  });

  it("returns 0.00 if all darts are misses", () => {
    const player: Player = {
      name: "Eve",
      darts: [
        [Miss, Single],
        [Miss, Double],
        [Miss, Triple],
      ],
    };
    expect(mprForPlayerAsOfRound(player, 1)).toBe("0.00");
  });

  it("handles more rounds than darts thrown (should not error)", () => {
    const player: Player = {
      name: "Frank",
      darts: [
        [One, Single],
        [One, Single],
      ],
    };
    // Only 2 darts, but 2 rounds requested (6 darts)
    expect(mprForPlayerAsOfRound(player, 2)).toBe("1.00");
  });
});
