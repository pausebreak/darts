import { gameOperations, shanghai } from "../games";
import { Mark, Multiple, Player } from "../types";

describe("config", () => {
  it("uses the numbers 1 through 20 by default", () => {
    const game = shanghai();
    expect(game.marks.length).toBe(20);
    expect(game.marks[0]).toBe(Mark.One);
    expect(game.marks[19]).toBe(Mark.Twenty);
    expect(game.limit).toBe(20);
  });

  it("uses the numbers 15 through 20 for the short variant", () => {
    const game = shanghai(true);
    expect(game.marks).toEqual([Mark.Fifteen, Mark.Sixteen, Mark.Seventeen, Mark.Eighteen, Mark.Nineteen, Mark.Twenty]);
    expect(game.limit).toBe(6);
  });
});

describe("validThrow", () => {
  const ops = gameOperations(shanghai());

  it("allows the round's number at any multiple", () => {
    const players: Player[] = [{ name: "me", darts: [] }];
    expect(ops.validThrow(0, players, [Mark.One, Multiple.Single])).toBe(true);
    expect(ops.validThrow(0, players, [Mark.One, Multiple.Double])).toBe(true);
    expect(ops.validThrow(0, players, [Mark.One, Multiple.Triple])).toBe(true);
  });

  it("allows a miss", () => {
    expect(ops.validThrow(0, [{ name: "me", darts: [] }], [Mark.Miss, Multiple.Single])).toBe(true);
  });

  it("does not allow other numbers", () => {
    expect(ops.validThrow(0, [{ name: "me", darts: [] }], [Mark.Two, Multiple.Single])).toBe(false);
  });

  it("uses the throwing player's own round", () => {
    const players: Player[] = [
      {
        name: "me",
        darts: [
          [Mark.One, Multiple.Single],
          [Mark.Miss, Multiple.Single],
          [Mark.Miss, Multiple.Single],
        ],
      },
      { name: "them", darts: [] },
    ];

    // me is on round two, them is still on round one
    expect(ops.validThrow(0, players, [Mark.Two, Multiple.Single])).toBe(true);
    expect(ops.validThrow(0, players, [Mark.One, Multiple.Single])).toBe(false);
    expect(ops.validThrow(1, players, [Mark.One, Multiple.Single])).toBe(true);
  });

  it("does not allow throws after all rounds are done", () => {
    const game = shanghai(true);
    game.marks = [Mark.One];
    const players: Player[] = [
      {
        name: "me",
        darts: [
          [Mark.One, Multiple.Single],
          [Mark.Miss, Multiple.Single],
          [Mark.Miss, Multiple.Single],
        ],
      },
    ];

    expect(gameOperations(game).validThrow(0, players, [Mark.Miss, Multiple.Single])).toBe(false);
  });
});

describe("didWin", () => {
  const ops = gameOperations(shanghai());

  it("is not won with no players", () => {
    expect(ops.didWin([], 0)).toBeFalsy();
  });

  it("is not won with no throws", () => {
    expect(ops.didWin([{ name: "me", darts: [] }], 0)).toBeFalsy();
  });

  it("is not won mid round", () => {
    const player: Player = { name: "me", darts: [[Mark.One, Multiple.Single]] };
    expect(ops.didWin([player], 0)).toBeFalsy();
  });

  it("is won instantly with a single, double and triple of the round's number", () => {
    const player: Player = {
      name: "me",
      darts: [
        [Mark.One, Multiple.Single],
        [Mark.One, Multiple.Double],
        [Mark.One, Multiple.Triple],
      ],
    };
    expect(ops.didWin([player], 0)).toBe(player);
  });

  it("is won instantly regardless of the order thrown", () => {
    const player: Player = {
      name: "me",
      darts: [
        [Mark.One, Multiple.Triple],
        [Mark.One, Multiple.Single],
        [Mark.One, Multiple.Double],
      ],
    };
    expect(ops.didWin([player], 0)).toBe(player);
  });

  it("is not won instantly without all three multiples", () => {
    const player: Player = {
      name: "me",
      darts: [
        [Mark.One, Multiple.Single],
        [Mark.One, Multiple.Single],
        [Mark.One, Multiple.Double],
      ],
    };
    expect(ops.didWin([player], 0)).toBeFalsy();
  });

  it("is not won instantly when one dart missed", () => {
    const player: Player = {
      name: "me",
      darts: [
        [Mark.One, Multiple.Single],
        [Mark.One, Multiple.Double],
        [Mark.Miss, Multiple.Single],
      ],
    };
    expect(ops.didWin([player], 0)).toBeFalsy();
  });

  it("detects an instant win by the last player to throw", () => {
    const me: Player = {
      name: "me",
      darts: [
        [Mark.Miss, Multiple.Single],
        [Mark.Miss, Multiple.Single],
        [Mark.Miss, Multiple.Single],
      ],
    };
    const them: Player = {
      name: "them",
      darts: [
        [Mark.One, Multiple.Double],
        [Mark.One, Multiple.Triple],
        [Mark.One, Multiple.Single],
      ],
    };

    // them just finished their round and play wrapped back to me
    expect(ops.didWin([me, them], 0)).toBe(them);
  });

  it("is not won until every player has thrown every round", () => {
    const game = shanghai(true);
    game.marks = [Mark.One];
    const me: Player = {
      name: "me",
      darts: [
        [Mark.One, Multiple.Single],
        [Mark.Miss, Multiple.Single],
        [Mark.Miss, Multiple.Single],
      ],
    };
    const them: Player = { name: "them", darts: [] };

    expect(gameOperations(game).didWin([me, them], 1)).toBeFalsy();
  });

  it("is won by the highest score after all the rounds", () => {
    const game = shanghai(true);
    game.marks = [Mark.One];
    const me: Player = {
      name: "me",
      darts: [
        [Mark.One, Multiple.Single],
        [Mark.Miss, Multiple.Single],
        [Mark.Miss, Multiple.Single],
      ],
    };
    const them: Player = {
      name: "them",
      darts: [
        [Mark.One, Multiple.Double],
        [Mark.Miss, Multiple.Single],
        [Mark.Miss, Multiple.Single],
      ],
    };

    expect(gameOperations(game).didWin([me, them], 0)).toBe(them);
  });

  it("is won by every tied player after all the rounds", () => {
    const game = shanghai(true);
    game.marks = [Mark.One];
    const me: Player = {
      name: "me",
      darts: [
        [Mark.One, Multiple.Single],
        [Mark.Miss, Multiple.Single],
        [Mark.Miss, Multiple.Single],
      ],
    };
    const them: Player = {
      name: "them",
      darts: [
        [Mark.Miss, Multiple.Single],
        [Mark.One, Multiple.Single],
        [Mark.Miss, Multiple.Single],
      ],
    };

    expect(gameOperations(game).didWin([me, them], 0)).toEqual([me, them]);
  });
});

describe("stats", () => {
  const ops = gameOperations(shanghai());

  it("sums scores and counts non-miss marks", () => {
    const me: Player = {
      name: "me",
      darts: [
        [Mark.One, Multiple.Triple],
        [Mark.Miss, Multiple.Single],
      ],
    };
    const them: Player = { name: "them", darts: [[Mark.One, Multiple.Double]] };

    expect(ops.stats([me, them])).toEqual({ scores: [3, 2], marks: [1, 1] });
  });
});
