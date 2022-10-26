import React from "react";
import { render, screen } from "@testing-library/react";
import { useStore } from "../../machine";
import { resetStores } from "../../../__mocks__/zustand";
import { cricket } from "../../games";
import { Cricket } from "./Cricket";
import { Mark, Multiple } from "../../types";

afterEach(resetStores);

describe("Cricket.tsx", () => {
  test("shows something with game", () => {
    const store = useStore.getState();
    store.setGame(cricket(false));
    store.addPlayer({ name: "person", darts: [] });
    store.addPlayer({ name: "other dude", darts: [] });

    render(<Cricket />);
    expect(screen.getByText("person")).toBeTruthy();
    expect(screen.getByText("other dude")).toBeTruthy();
  });

  test("does show points when pointing", () => {
    const store = useStore.getState();
    store.setGame(cricket(true));
    store.addPlayer({
      name: "person",
      darts: [
        [Mark.Fifteen, Multiple.Triple],
        [Mark.Fifteen, Multiple.Triple],
      ],
    });
    store.addPlayer({
      name: "person 2",
      darts: [],
    });

    render(<Cricket />);
    expect(screen.getByText("45")).toBeTruthy();
    expect(screen.getByText("0")).toBeTruthy();
  });

  test("does not show points when not pointing", () => {
    const store = useStore.getState();
    store.setGame(cricket(false));
    store.addPlayer({
      name: "person",
      darts: [],
    });
    store.addPlayer({
      name: "person 2",
      darts: [],
    });

    render(<Cricket />);
    expect(screen.queryByText("0")).toBeFalsy();
  });
});
