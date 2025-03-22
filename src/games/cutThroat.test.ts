import { gameOperations } from "../games";
import { Mark, Multiple, Player } from "../types";
import { cutThroat } from "./cutThroat";

describe("validThrow", () => {
  const game = cutThroat();

  it("allows Miss", () => {
    const thisGame = { ...game };
    const ops = gameOperations(thisGame);
    const result = ops.validThrow(
      0,
      [{ name: "me", darts: [[Mark.Nineteen, Multiple.Triple]] }],
      [Mark.Miss, Multiple.Single]
    );

    expect(result).toBe(true);
  });

  it("does not allow Bull Triple", () => {
    const thisGame = { ...game };
    const ops = gameOperations(thisGame);

    expect(ops.validThrow(0, [{ name: "me", darts: [] }], [Mark.Bull, Multiple.Triple])).toBe(false);
  });

  it("does not allow Marks outside the game", () => {
    const thisGame = { ...game };
    const ops = gameOperations(thisGame);
    const result = ops.validThrow(
      0,
      [{ name: "me", darts: [[Mark.Nineteen, Multiple.Triple]] }],
      [Mark.One, Multiple.Single]
    );

    expect(result).toBe(false);
  });

  it("knows if the mark is cleared", () => {
    const thisGame = { ...game };
    const ops = gameOperations(thisGame);
    const result = ops.validThrow(
      0,
      [{ name: "me", darts: [[Mark.Nineteen, Multiple.Triple]] }],
      [Mark.Nineteen, Multiple.Single]
    );

    expect(result).toBe(false);
  });

  it("handles clearing on a pointing game", () => {
    const thisGame = cutThroat();
    const ops = gameOperations(thisGame);
    const result = ops.validThrow(
      0,
      [
        { name: "me", darts: [[Mark.Nineteen, Multiple.Triple]] },
        { name: "them", darts: [[Mark.Nineteen, Multiple.Double]] },
      ],
      [Mark.Nineteen, Multiple.Single]
    );

    expect(result).toBe(true);
  });
});

describe("didWin", () => {
  const ops = gameOperations(cutThroat());

  it("does not allow no throws", () => {
    const result = ops.didWin([{ name: "me", darts: [] }], 0);

    expect(result).toBeFalsy();
  });

  it("can tell when the game is not over", () => {
    const b = cutThroat();
    const player: Player = { name: "me", darts: [[Mark.Bull, Multiple.Double]] };
    const result = gameOperations(b).didWin([player], 0);

    expect(result).toBe(undefined);
  });

  it("can find the winner when there are no scores", () => {
    const b = cutThroat();
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
    const result = gameOperations(b).didWin([player], 0);

    expect(result).toBe(player);
  });

  it("can tell when a game is over", () => {
    const b = cutThroat();
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
        [Mark.Bull, Multiple.Double],
      ],
    };
    const otherPlayer: Player = {
      name: "them",
      darts: [
        [Mark.Fifteen, Multiple.Triple],
        [Mark.Sixteen, Multiple.Triple],
        [Mark.Seventeen, Multiple.Triple],
        [Mark.Eighteen, Multiple.Triple],
        [Mark.Nineteen, Multiple.Triple],
        [Mark.Twenty, Multiple.Triple],
      ],
    };

    const result = gameOperations(b).didWin([player, otherPlayer], 0);

    expect(result).toBe(player);
  });
});

describe("stats", () => {
  const ops = gameOperations(cutThroat());

  it("shows 0 for no throws", () => {
    const result = ops.stats([{ name: "me", darts: [] }]);

    expect(result).toStrictEqual({ marks: [0], scores: [0] });
  });

  it("handles a win with no score", () => {
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
        [Mark.Miss, Multiple.Single],
        [Mark.Bull, Multiple.Single],
      ],
    };
    const result = ops.stats([player]);

    expect(result).toStrictEqual({ marks: [21], scores: [0] });
  });

  it("can score a pointing game", () => {
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
        [Mark.Miss, Multiple.Single],
        [Mark.Fifteen, Multiple.Triple],
      ],
    };
    const otherPlayer: Player = {
      name: "they",
      darts: [
        [Mark.Fifteen, Multiple.Double],
        [Mark.Sixteen, Multiple.Triple],
        [Mark.Seventeen, Multiple.Triple],
        [Mark.Eighteen, Multiple.Triple],
        [Mark.Nineteen, Multiple.Triple],
        [Mark.Twenty, Multiple.Triple],
        [Mark.Miss, Multiple.Single],
      ],
    };

    const result = ops.stats([player, otherPlayer]);

    expect(result).toStrictEqual({ marks: [23, 17], scores: [0, 45] });
  });
});
