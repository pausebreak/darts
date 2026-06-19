import React from "react";
import { act, render, screen } from "@testing-library/react";
import { App } from "./App";
import { useStore } from "../machine";
import { resetStores } from "../../__mocks__/zustand";
import { bulls, cricket, ohGames, shanghai } from "../games";
import { tactical } from "../games/tactical";

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

  test("shows the Tactical game", () => {
    const player = { name: "me", darts: [] };
    const store = useStore.getState();
    store.addPlayer(player);
    store.setGame(tactical(false));

    render(<App />);
    const nextButton = screen.getByText(/Next/i);
    expect(nextButton).toBeTruthy();
  });

  test("shows the Shanghai game", () => {
    const player = { name: "me", darts: [] };
    const store = useStore.getState();
    store.addPlayer(player);
    store.setGame(shanghai());

    render(<App />);
    expect(screen.getByText(/Round 1 of 20/i)).toBeTruthy();
    expect(screen.getByText(/Next/i)).toBeTruthy();
  });

  test("shows multiple winners on a tie", () => {
    const me = { name: "me", darts: [] };
    const you = { name: "you", darts: [] };
    const store = useStore.getState();
    store.addPlayer(me);
    store.addPlayer(you);
    store.setGame(shanghai(true));
    store.setWinner([me, you]);

    render(<App />);
    const won = screen.getByText(/me and you are the winners/i);
    expect(won).toBeTruthy();
  });

  test("shows game setup if no game set", () => {
    const player = { name: "me", darts: [] };
    const store = useStore.getState();
    store.addPlayer(player);

    render(<App />);
    const playersHeader = screen.getByText("Players");
    expect(playersHeader).toBeTruthy();
    expect(screen.getByText("1 player")).toBeTruthy();
    const gameHeader = screen.getByText("Game");
    expect(gameHeader).toBeTruthy();
  });

  test("shows qr code and share url in about section", () => {
    const player = { name: "me", darts: [] };
    const store = useStore.getState();
    store.addPlayer(player);

    render(<App />);
    const aboutHeader = screen.getByText("About");
    expect(aboutHeader).toBeTruthy();

    act(() => {
      aboutHeader.click();
    });

    const htmlText = screen.getByText("https://pausebreak.github.io/darts/");
    expect(htmlText).toBeTruthy();

    const qr = screen.getByLabelText("QR URL CODE");
    expect(qr).toBeTruthy();
  });
});
