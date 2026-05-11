import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { GameSetup } from "./GameSetup";
import { useStore } from "../machine";
import { resetStores } from "../../__mocks__/zustand";
import { GameName } from "../types";

afterEach(resetStores);

const addPlayers = (...names: string[]) => {
  const store = useStore.getState();
  names.forEach((name) => store.addPlayer({ name, darts: [] }));
};

const openGameAccordion = () => {
  act(() => {
    screen.getByText("Game").click();
  });
};

const pickGame = (label: RegExp) => {
  act(() => {
    screen.getByRole("button", { name: label }).click();
  });
};

const togglePointing = () => {
  act(() => {
    fireEvent.click(screen.getByLabelText(/pointing/i));
  });
};

const start = () => {
  act(() => {
    screen.getByRole("button", { name: /^start$/i }).click();
  });
};

describe("GameSetup pointing", () => {
  test("Cricket: Start with pointing checked stores pointing=true", () => {
    addPlayers("alice", "bob");
    render(<GameSetup />);
    openGameAccordion();
    pickGame(/^Cricket/);
    togglePointing();
    start();

    const game = useStore.getState().game;
    expect(game?.name).toBe(GameName.Cricket);
    expect(game?.pointing).toBe(true);
  });

  test("Cricket: Start without pointing stores pointing=false", () => {
    addPlayers("alice", "bob");
    render(<GameSetup />);
    openGameAccordion();
    pickGame(/^Cricket/);
    start();

    const game = useStore.getState().game;
    expect(game?.name).toBe(GameName.Cricket);
    expect(game?.pointing).toBe(false);
  });

  test("Cricket: toggling pointing after picking the game still applies", () => {
    // Regression: game config was previously built at button-click time,
    // so checking pointing afterwards had no effect on the final game.
    addPlayers("alice", "bob");
    render(<GameSetup />);
    openGameAccordion();
    pickGame(/^Cricket/);
    togglePointing();
    start();

    expect(useStore.getState().game?.pointing).toBe(true);
  });

  test("Tactical: Start with pointing checked stores pointing=true", () => {
    addPlayers("alice", "bob");
    render(<GameSetup />);
    openGameAccordion();
    pickGame(/^Tactical/);
    togglePointing();
    start();

    const game = useStore.getState().game;
    expect(game?.name).toBe(GameName.Tactical);
    expect(game?.pointing).toBe(true);
  });

  test("Tactical: Start without pointing stores pointing=false", () => {
    addPlayers("alice", "bob");
    render(<GameSetup />);
    openGameAccordion();
    pickGame(/^Tactical/);
    start();

    const game = useStore.getState().game;
    expect(game?.name).toBe(GameName.Tactical);
    expect(game?.pointing).toBe(false);
  });

  test("single-player forces pointing=false even when toggled", () => {
    addPlayers("solo");
    render(<GameSetup />);
    openGameAccordion();
    pickGame(/^Cricket/);
    const checkbox = screen.getByLabelText(/pointing/i) as HTMLInputElement;
    expect(checkbox.disabled).toBe(true);
    start();
    expect(useStore.getState().game?.pointing).toBe(false);
  });
});
