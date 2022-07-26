import React from "react";
import { render, screen } from "@testing-library/react";
import { App } from "./App";
import { useStore } from "../machine";

test("shows when someone wins", () => {
  const player = { name: "me", darts: [] };
  const store = useStore.getState();
  store.addPlayer(player);
  store.setPlayerWon(player);

  render(<App />);
  const won = screen.getByText(/me Won/i);
  expect(won).toBeTruthy();
});
