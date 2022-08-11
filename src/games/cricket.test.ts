import { gameOperations } from "../games";
import { Mark, Multiple, Player } from "../types";
import { cricket } from "./cricket";

describe("validThrow", () => {
  const game = cricket(false);

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
    const thisGame = cricket(true);
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
  const ops = gameOperations(cricket(false));

  it("does not allow no throws", () => {
    const result = ops.didWin([{ name: "me", darts: [] }], 0);

    expect(result).toBeFalsy();
  });

  it("can tell when the game is not over", () => {
    const b = cricket(false);
    const player: Player = { name: "me", darts: [[Mark.Bull, Multiple.Double]] };
    const result = gameOperations(b).didWin([player], 0);

    expect(result).toBe(undefined);
  });

  it("can tell when the last player wins", () => {
    const b = cricket(false);
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

  it("can tell when a pointing game is not over", () => {
    const b = cricket(true);
    const player: Player = { name: "me", darts: [[Mark.Bull, Multiple.Double]] };
    const result = gameOperations(b).didWin([player], 0);

    expect(result).toBe(undefined);
  });

  it("can tell when a pointing game is over", () => {
    const b = cricket(true);
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
