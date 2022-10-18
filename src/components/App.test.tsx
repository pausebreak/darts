import React from "react";
import { render, screen } from "@testing-library/react";
import { App } from "./App";
import { useStore } from "../machine";
import { resetStores } from "../../__mocks__/zustand";
import { bulls, cricket, ohGames } from "../games";

afterEach(resetStores);

describe("App", () => {
  test("shows when someone wins", () => {
    const player = { name: "me", darts: [] };
    const store = useStore.getState();
    store.addPlayer(player);
    store.setGame(ohGames(101));
    store.setWinner(player);

    render(<App />);
    const won = screen.getByText(/me is the winner/i);
    expect(won).toBeTruthy();
  });

  test("shows the game if no winner", () => {
    const player = { name: "me", darts: [] };
    const store = useStore.getState();
    store.addPlayer(player);
    store.setGame(bulls());

    render(<App />);
    const nextButton = screen.getByText(/Next/i);
    expect(nextButton).toBeTruthy();
  });

  test("shows the Cricket game", () => {
    const player = { name: "me", darts: [] };
    const store = useStore.getState();
    store.addPlayer(player);
    store.setGame(cricket(false));

    render(<App />);
    const nextButton = screen.getByText(/Next/i);
    expect(nextButton).toBeTruthy();
  });

  test("shows game chooser if no game set", () => {
    const player = { name: "me", darts: [] };
    const store = useStore.getState();
    store.addPlayer(player);

    render(<App />);
    const addPlayerButton = screen.getByText(/Add Player/i);
    expect(addPlayerButton).toBeTruthy();
  });
});
