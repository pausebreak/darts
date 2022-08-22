import { gameOperations, ohGames } from "../games";
import { Mark, Multiple, Player } from "../types";

describe("validThrow", () => {
  const game = ohGames(201);

  it("honers missing", () => {
    const ops = gameOperations({ ...game, checkIn: Multiple.Double });
    const result = ops.validThrow(
      0,
      [{ name: "me", darts: [[Mark.Miss, Multiple.Single]] }],
      [Mark.Miss, Multiple.Single]
    );

    expect(result).toBe(true);
  });

  it("honers Single out", () => {
    const ops = gameOperations({ ...game, checkOut: Multiple.Single, limit: 10 });
    const result = ops.validThrow(
      0,
      [{ name: "me", darts: [[Mark.Two, Multiple.Double]] }],
      [Mark.Six, Multiple.Single]
    );

    expect(result).toBe(true);
  });

  it("honers double in", () => {
    const ops = gameOperations({ ...game, checkIn: Multiple.Double });
    const result = ops.validThrow(
      0,
      [{ name: "me", darts: [[Mark.Miss, Multiple.Single]] }],
      [Mark.Bull, Multiple.Single]
    );

    expect(result).toBe(false);

    const otherResult = ops.validThrow(0, [{ name: "me", darts: [] }], [Mark.Bull, Multiple.Double]);
    expect(otherResult).toBe(true);
  });

  it("does not allow going over", () => {
    const ops = gameOperations({ ...game, checkIn: Multiple.Double, limit: 10 });
    const result = ops.validThrow(
      0,
      [{ name: "me", darts: [[Mark.Miss, Multiple.Single]] }],
      [Mark.Bull, Multiple.Single]
    );

    expect(result).toBe(false);

    const otherResult = ops.validThrow(0, [{ name: "me", darts: [] }], [Mark.Six, Multiple.Double]);

    expect(otherResult).toBe(false);
  });

  it("does not allow missing check out", () => {
    const ops = gameOperations({ ...game, checkIn: Multiple.Double, checkOut: Multiple.Double, limit: 10 });
    const result = ops.validThrow(
      0,
      [{ name: "me", darts: [[Mark.Four, Multiple.Double]] }],
      [Mark.Two, Multiple.Single]
    );

    expect(result).toBe(false);

    const otherResult = ops.validThrow(
      0,
      [{ name: "me", darts: [[Mark.Four, Multiple.Double]] }],
      [Mark.One, Multiple.Double]
    );

    expect(otherResult).toBe(true);
  });

  it("does not allow mathematically impossible last throw for double out", () => {
    const ops = gameOperations({ ...game, checkIn: Multiple.Double, checkOut: Multiple.Double, limit: 9 });
    const result = ops.validThrow(0, [{ name: "me", darts: [] }], [Mark.Four, Multiple.Double]);

    expect(result).toBe(false);
  });

  it("does not allow mathematically impossible last throw for triple out", () => {
    const ops = gameOperations({ ...game, checkIn: Multiple.Single, checkOut: Multiple.Triple, limit: 7 });
    const result = ops.validThrow(0, [{ name: "me", darts: [] }], [Mark.Five, Multiple.Single]);

    expect(result).toBe(false);
  });
});

describe("didWin", () => {
  it("does not allow no throws", () => {
    const ops = gameOperations(ohGames(301));
    const result = ops.didWin(
      [
        { name: "me", darts: [] },
        { name: "them", darts: [] },
      ],
      0
    );

    expect(result).toBeFalsy();
  });

  it("can tell when current player wins", () => {
    const ops = gameOperations(ohGames(50));
    const player: Player = { name: "me", darts: [[Mark.Bull, Multiple.Double]] };
    const result = ops.didWin([player], 0);

    expect(result).toBe(player);
  });

  it("can tell when the last player wins", () => {
    const ops = gameOperations(ohGames(50));
    const player: Player = {
      name: "me",
      darts: [
        [Mark.Bull, Multiple.Single],
        [Mark.Miss, Multiple.Single],
        [Mark.Miss, Multiple.Single],
      ],
    };
    const otherPlayer: Player = {
      name: "them",
      darts: [
        [Mark.Bull, Multiple.Single],
        [Mark.Miss, Multiple.Single],
        [Mark.Bull, Multiple.Single],
      ],
    };

    // currentIndex will always be on the next player if you hit 3 throws
    const result = ops.didWin([player, otherPlayer], 0);

    expect(result).toBe(otherPlayer);
  });
});
