import { useStore } from "./machine";
import { bulls, cricket } from "./games";
import { Mark, Multiple } from "./types";
import { resetStores } from "../__mocks__/zustand";

afterEach(resetStores);

describe("addPlayer during a game", () => {
  it("fills new player with misses up to the current round", () => {
    const store = useStore.getState();
    store.addPlayer({ name: "Alice", darts: [] });
    store.addPlayer({ name: "Bob", darts: [] });
    store.setGame(bulls());

    // Throw a full round for both players (3 darts each)
    store.addThrowToCurrentPlayer([Mark.Bull, Multiple.Single]);
    store.addThrowToCurrentPlayer([Mark.Bull, Multiple.Single]);
    store.addThrowToCurrentPlayer([Mark.Bull, Multiple.Single]);
    store.addThrowToCurrentPlayer([Mark.Bull, Multiple.Single]);
    store.addThrowToCurrentPlayer([Mark.Bull, Multiple.Single]);
    store.addThrowToCurrentPlayer([Mark.Bull, Multiple.Single]);

    // Now in round 2 — add a new player
    store.addPlayer({ name: "Charlie", darts: [] });

    const charlie = useStore.getState().players.find((p) => p.name === "Charlie");

    // Should have 3 misses (1 round × 3 darts)
    expect(charlie.darts).toHaveLength(3);
    expect(charlie.darts).toEqual([
      [Mark.Miss, Multiple.Single],
      [Mark.Miss, Multiple.Single],
      [Mark.Miss, Multiple.Single],
    ]);
  });

  it("fills multiple rounds of misses", () => {
    const store = useStore.getState();
    store.addPlayer({ name: "Alice", darts: [] });
    store.addPlayer({ name: "Bob", darts: [] });
    store.setGame(bulls());

    // Throw 2 full rounds (6 darts per player = 12 total)
    for (let i = 0; i < 12; i++) {
      store.addThrowToCurrentPlayer([Mark.Miss, Multiple.Single]);
    }

    store.addPlayer({ name: "Charlie", darts: [] });

    const charlie = useStore.getState().players.find((p) => p.name === "Charlie");
    // 2 rounds × 3 darts = 6 misses
    expect(charlie.darts).toHaveLength(6);
  });

  it("does not fill misses when no game is active", () => {
    const store = useStore.getState();
    store.addPlayer({ name: "Alice", darts: [] });
    store.addPlayer({ name: "Bob", darts: [] });

    const bob = useStore.getState().players.find((p) => p.name === "Bob");
    expect(bob.darts).toHaveLength(0);
  });

  it("does not fill misses when adding the first player to a game", () => {
    const store = useStore.getState();
    store.setGame(cricket(false));
    store.addPlayer({ name: "Alice", darts: [] });

    const alice = useStore.getState().players.find((p) => p.name === "Alice");
    expect(alice.darts).toHaveLength(0);
  });

  it("fills misses for mid-round addition", () => {
    const store = useStore.getState();
    store.addPlayer({ name: "Alice", darts: [] });
    store.addPlayer({ name: "Bob", darts: [] });
    store.setGame(bulls());

    // Alice throws 2 of 3 darts (mid-round)
    store.addThrowToCurrentPlayer([Mark.Bull, Multiple.Single]);
    store.addThrowToCurrentPlayer([Mark.Bull, Multiple.Single]);

    // currentRound is 1 since someone has thrown
    store.addPlayer({ name: "Charlie", darts: [] });

    const charlie = useStore.getState().players.find((p) => p.name === "Charlie");
    // Round 1 is in progress, so 1 round × 3 = 3 misses
    expect(charlie.darts).toHaveLength(3);
  });
});
