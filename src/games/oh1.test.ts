import { gameOperations, ohGames } from "../games";
import { Mark, Multiple, Player } from "../types";
import { ohGamesOperations } from "./oh1";

describe("validThrow", () => {
  const game = ohGames(201);

  it("honers double in", () => {
    const thisGame = { ...game };
    thisGame.checkIn = Multiple.Double;
    const ops = ohGamesOperations(thisGame);
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
    const thisGame = { ...game };
    thisGame.checkIn = Multiple.Double;
    thisGame.limit = 10;
    const ops = gameOperations(thisGame);
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
    const thisGame = { ...game };
    thisGame.checkIn = Multiple.Double;
    thisGame.checkOut = Multiple.Double;
    thisGame.limit = 10;
    const ops = gameOperations(thisGame);
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
});

describe("didWin", () => {
  const ops = gameOperations(ohGames(301));

  it("does not allow no throws", () => {
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
    const b = ohGames();
    b.limit = 50;
    const player: Player = { name: "me", darts: [[Mark.Bull, Multiple.Double]] };
    const result = gameOperations(b).didWin([player], 0);

    expect(result).toBe(player);
  });

  it("can tell when the last player wins", () => {
    const b = ohGames();
    b.limit = 50;
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
    const result = gameOperations(b).didWin([otherPlayer, player], 0);

    expect(result).toBe(otherPlayer);
  });
});
