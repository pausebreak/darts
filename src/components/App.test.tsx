import React from "react";
import { render, screen } from "@testing-library/react";
import { App } from "./App";
import { useStore } from "../machine";
import { resetStores } from "../../__mocks__/zustand";
import { ohGames } from "../games";

afterEach(resetStores);

test("shows when someone wins", () => {
  const player = { name: "me", darts: [] };
  const store = useStore.getState();
  store.addPlayer(player);
  store.setGame(ohGames());
  store.setPlayerWon(player);

  render(<App />);
  const won = screen.getByText(/me is the winner/i);
  expect(won).toBeTruthy();
});
