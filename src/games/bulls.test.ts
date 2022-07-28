import { gameOperations } from "../games";
import { Mark, Multiple, Player } from "../types";
import { bulls } from "./bulls";

describe("validThrow", () => {
  const ops = gameOperations(bulls());
  it("allows you to throw bulls", () => {
    const result = ops.validThrow(0, [{ name: "me", darts: [] }], [Mark.Bull, Multiple.Single]);

    expect(result).toBe(true);
  });

  it("does not allows you to throw non-bulls", () => {
    const result = ops.validThrow(0, [{ name: "me", darts: [] }], [Mark.Eight, Multiple.Single]);

    expect(result).toBe(false);
  });
});

describe("didWin", () => {
  const ops = gameOperations(bulls());

  it("does not allow no throws", () => {
    const result = ops.didWin([{ name: "me", darts: [] }], 0);

    expect(result).toBeFalsy();
  });

  it("can tell when current player wins", () => {
    const b = bulls();
    b.limit = 50;
    const player: Player = { name: "me", darts: [[Mark.Bull, Multiple.Double]] };
    const result = gameOperations(b).didWin([player], 0);

    expect(result).toBe(player);
  });

  it("can tell when the last player wins", () => {
    const b = bulls();
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
    const result = gameOperations(b).didWin([player, otherPlayer], 0);

    expect(result).toBe(otherPlayer);
  });
});
